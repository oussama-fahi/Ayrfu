// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch user profile');
      
      // Clear token if unauthorized
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
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Clear authentication error
  const clearAuthError = useCallback(() => {
    setError(null);
  }, []);

  // Check for roles - enhanced to handle role names properly
  const hasRole = useCallback((roleName) => {
    if (!user || !user.roles) return false;
    
    // Handle roles as array of strings
    if (Array.isArray(user.roles) && typeof user.roles[0] === 'string') {
      return user.roles.includes(roleName);
    }
    
    // Handle roles as array of objects with name property
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
    clearAuthError
  };
};

export default useAuth;