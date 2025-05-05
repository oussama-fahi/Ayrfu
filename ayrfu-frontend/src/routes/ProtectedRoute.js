import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

/**
 * A wrapper component for protected routes that requires authentication
 * and optionally specific roles
 * 
 * @param {Array} requiredRoles - Optional array of roles required to access the route
 * @returns React component
 */
const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

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

  // If requiredRoles is provided, check if user has at least one of the required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = user?.roles?.some(role => 
      requiredRoles.includes(typeof role === 'string' ? role : role.name)
    );

    if (!hasRequiredRole) {
      // User is authenticated but doesn't have the required role
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role (if specified)
  return <Outlet />;
};

export default ProtectedRoute;