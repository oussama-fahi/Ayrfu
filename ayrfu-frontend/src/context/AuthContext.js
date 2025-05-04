// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AuthAPI from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const loadUser = async () => {
      if (AuthAPI.isAuthenticated()) {
        try {
          const userData = await AuthAPI.getCurrentUser();
          setCurrentUser(userData);
        } catch (err) {
          console.error('Error loading user:', err);
          AuthAPI.logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const userData = await AuthAPI.login({ email, password });
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const newUser = await AuthAPI.register(userData);
      return newUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    AuthAPI.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    hasRole: (role) => currentUser?.roles.includes(role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};