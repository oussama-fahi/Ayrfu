// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

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
  const { getCurrentUser, hasRole } = useAuth();

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
        const userData = await getCurrentUser();
        setUser(userData);
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
  }, [getCurrentUser]);

  // Check if the user has required roles
  const hasRequiredRole = () => {
    if (!user || !user.roles || requiredRoles.length === 0) {
      return true; // No roles required or user has no roles
    }
    
    return requiredRoles.some(role => hasRole(role));
  };

  // Special check for candidate routes - check if the route is under /candidate
  const isCandidateRoute = location.pathname.startsWith('/candidate');
  const isCandidate = user && hasRole && hasRole('ROLE_CANDIDATE');

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
    // Redirect based on user's role
    if (hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_USER')) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (hasRole('ROLE_CANDIDATE')) {
      return <Navigate to="/candidate/dashboard" replace />;
    } else if (hasRole('ROLE_CLIENT')) {
      return <Navigate to="/client/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Render the protected route if authenticated and has required roles
  return <Outlet />;
};

export default ProtectedRoute;