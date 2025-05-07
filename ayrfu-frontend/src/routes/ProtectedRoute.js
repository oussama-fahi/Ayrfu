// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';

/**
 * A wrapper component for protected routes that requires authentication
 * and optionally specific roles
 * 
 * @param {Array} requiredRoles - Optional array of roles required to access the route
 * @returns React component
 */
const ProtectedRoute = ({ requiredRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    // Verify token and get user info
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Check if the user has required roles
  const hasRequiredRole = () => {
    if (!user || !user.roles || requiredRoles.length === 0) {
      return true; // No roles required or user has no roles
    }
    
    return user.roles.some(role => {
      // Handle roles as strings or objects with name property
      const roleName = typeof role === 'string' ? role : role.name;
      return requiredRoles.includes(roleName);
    });
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if authenticated but doesn't have required roles
  if (!hasRequiredRole()) {
    return <Navigate to="/" replace />;
  }

  // Render the protected route if authenticated and has required roles
  return <Outlet />;
};

export default ProtectedRoute;