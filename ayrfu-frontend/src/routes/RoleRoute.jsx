// src/routes/RoleRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

// Import necessary actions
import { checkCandidateProfile } from '../redux/slices/candidatesSlice';

/**
 * Enhanced RoleRoute component that checks not only for user role
 * but also for candidate profile existence when accessing candidate routes
 * 
 * @param {Array} roles - Array of roles required to access the route
 * @returns React component
 */
const RoleRoute = ({ roles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  
  // Get state from Redux store
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
  const { profileExists, isLoading: candidateLoading } = useSelector(state => state.candidates);
  
  // Check if the route is for candidate dashboard
  const isCandidateRoute = location.pathname.startsWith('/candidate');

  // This effect checks candidate profile if we're accessing a candidate route
  useEffect(() => {
    const checkAccess = async () => {
      // If going to candidate route and has candidate role, check for profile
      if (isCandidateRoute && 
          user && 
          isAuthenticated && 
          hasRole('ROLE_CANDIDATE') && 
          profileExists === null) {
        await dispatch(checkCandidateProfile());
      }
      setIsChecking(false);
    };
    
    if (!isLoading) {
      checkAccess();
    }
  }, [dispatch, isAuthenticated, user, isCandidateRoute, isLoading, profileExists]);

  // Helper function to check if user has a required role
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    
    // Handle roles as array of strings or objects with a name property
    return user.roles.some(role => {
      const roleValue = typeof role === 'string' ? role : role.name;
      return roleValue === roleName;
    });
  };

  // Show loading spinner while checking authentication or candidate profile
  if (isLoading || (isCandidateRoute && candidateLoading) || isChecking) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Checking access...</Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any of the required roles
  const hasRequiredRole = roles.length === 0 || roles.some(role => hasRole(role));
  if (!hasRequiredRole) {
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

  // Special handling for candidate routes
  if (isCandidateRoute && hasRole('ROLE_CANDIDATE')) {
    // If profile doesn't exist yet, still allow access to the dashboard
    // where the profile creation form will be shown
    if (profileExists === false && location.pathname !== '/candidate/dashboard') {
      return <Navigate to="/candidate/dashboard" replace />;
    }
  }

  // Render the protected route if authenticated and has required roles
  return <Outlet />;
};

export default RoleRoute;