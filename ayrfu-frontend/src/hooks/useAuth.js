import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in based on token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // Get current user data from backend
  const getCurrentUser = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/auth/profile');
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch user profile');
      // Clear token if unauthorized
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return response.data;
      }
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
  }, []);

  // Check for roles
  const hasRole = useCallback((role) => {
    if (!user || !user.roles) return false;
    
    if (Array.isArray(user.roles)) {
      return user.roles.includes(role);
    }
    
    // Handle roles as objects with name property
    if (typeof user.roles === 'object') {
      return user.roles.some(r => r.name === role);
    }
    
    return false;
  }, [user]);

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
    getCurrentUser,
    hasRole
  };
};

export default useAuth;