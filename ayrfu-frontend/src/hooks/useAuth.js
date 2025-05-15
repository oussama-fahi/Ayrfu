import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import axios from 'axios';

// Create context for authentication
const AuthContext = createContext();

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
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
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Unable to retrieve profile');
      
      // Remove token if unauthorized
      if (err.response?.status === 401) {
        // localStorage.removeItem('token');
        // setIsAuthenticated(false);
        // setUser(null);
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
      if (response.data) {
        return response.data;
      }
      return null;
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

  // Setup interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && isAuthenticated) {
          // Token expired or invalid
          
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Cleanup interceptor on component unmount
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated, logout]);

  return {
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
  };
}

export default useAuth;