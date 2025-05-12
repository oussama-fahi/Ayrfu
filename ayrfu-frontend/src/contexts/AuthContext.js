import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from '../axios';

// Create context for authentication
const AuthContext = createContext();

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Get current user data from backend
  const getCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Unable to retrieve profile');
      
      // Remove token if unauthorized
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        setIsAuthenticated(true);
        
        // Load complete user profile after login
        await getCurrentUser();
        
        // Check if there's a redirect URL stored
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectPath;
        }
        
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get redirection path based on user roles
  const getRedirectionPath = useCallback(() => {
    if (!user || !user.roles) return '/';
    
    const userRoles = user.roles.map(role => typeof role === 'string' ? role : role.name);
    
    if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_SUPER_USER')) {
      return '/admin/dashboard';
    } else if (userRoles.includes('ROLE_CANDIDATE')) {
      return '/candidate/dashboard';
    } else if (userRoles.includes('ROLE_CLIENT')) {
      return '/client/dashboard';
    }
    return '/';
  }, [user]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Force a page reload to clear any component state
    window.location.href = '/';
  }, []);

  // Clear authentication errors
  const clearAuthError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user has a specific role
  const hasRole = useCallback((roleName) => {
    if (!user || !user.roles) return false;
    
    // Handle roles as array of strings
    if (Array.isArray(user.roles) && typeof user.roles[0] === 'string') {
      return user.roles.includes(roleName);
    }
    
    // Handle roles as array of objects with a name property
    if (Array.isArray(user.roles) && typeof user.roles[0] === 'object') {
      return user.roles.some(r => r.name === roleName);
    }
    
    return false;
  }, [user]);

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', userData);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        setIsAuthenticated(true);
        await getCurrentUser();
      }
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on initial render if token exists
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated,
        login,
        logout,
        register,
        getCurrentUser,
        hasRole,
        clearAuthError,
        getRedirectionPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;