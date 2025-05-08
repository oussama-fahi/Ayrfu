// src/contexts/AuthContext.jsx - Fix auth context
import React, { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Create authentication context
export const AuthContext = createContext(null);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Component to handle redirections
export const AuthRedirector = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if user is authenticated and not loading
    if (auth.isAuthenticated && !auth.isLoading) {
      const currentPath = location.pathname;
      const redirectionPath = auth.getRedirectionPath();

      // Check if user is on a path requiring redirection
      const publicPaths = ['/', '/login', '/register', '/contact'];
      const needsRedirection = 
        publicPaths.includes(currentPath) || 
        (!currentPath.includes('/admin') && auth.hasRole('ROLE_ADMIN')) ||
        (!currentPath.includes('/admin') && auth.hasRole('ROLE_SUPER_USER')) ||
        (!currentPath.includes('/candidate') && auth.hasRole('ROLE_CANDIDATE')) ||
        (!currentPath.includes('/client') && auth.hasRole('ROLE_CLIENT'));

      if (needsRedirection) {
        // Use a small timeout to ensure state updates
        setTimeout(() => {
          navigate(redirectionPath, { replace: true });
        }, 50);
      }
    }
  }, [auth, navigate, location]);

  return null;
};

export default AuthContext;