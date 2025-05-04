import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * A wrapper around routes that checks if the user is authenticated
 * before rendering the child route components.
 */
const ProtectedRoute = ({ 
  requiredRoles = [] // Array of required roles (optional)
}) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();
  
  // While checking authentication status, show loading spinner
  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // If roles are required, check if user has at least one of them
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to dashboard
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  // User is authenticated and has required roles, render the route
  return <Outlet />;
};

export default ProtectedRoute;