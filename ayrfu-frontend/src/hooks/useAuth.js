// src/hooks/useAuth.js
import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction, getCurrentUser as fetchCurrentUserAction } from '../redux/slices/authSlice';
import { fetchCandidateProfile } from '../redux/slices/candidatesSlice';

// Create context for authentication
const AuthContext = createContext();

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { 
    user, 
    isLoading, 
    error, 
    isAuthenticated 
  } = useSelector(state => state.auth);
  
  const { 
    currentCandidate, 
    error: candidateError 
  } = useSelector(state => state.candidates);

  const [hasCandidateProfile, setHasCandidateProfile] = useState(false);

  // Check if candidate profile exists when component mounts
  useEffect(() => {
    if (isAuthenticated && hasRole('ROLE_CANDIDATE')) {
      dispatch(fetchCandidateProfile())
        .unwrap()
        .then(candidateData => {
          if (candidateData && candidateData.id) {
            setHasCandidateProfile(true);
          } else {
            setHasCandidateProfile(false);
          }
        })
        .catch(() => {
          setHasCandidateProfile(false);
        });
    }
  }, [dispatch, isAuthenticated, user]);

  // Get current user data from backend
  const getCurrentUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchCurrentUserAction()).unwrap();
      return result;
    } catch (err) {
      console.error('Error fetching current user:', err);
      throw err;
    }
  }, [dispatch]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const result = await dispatch(loginAction({ email, password })).unwrap();
      return result;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

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

  // Get redirection path based on user roles
  const getRedirectionPath = useCallback(() => {
    if (!user || !user.roles) return '/';
    
    if (hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_USER')) {
      return '/admin/dashboard';
    } else if (hasRole('ROLE_CANDIDATE')) {
      return '/candidate/dashboard';
    } else if (hasRole('ROLE_CLIENT')) {
      return '/client/dashboard';
    }
    
    return '/';
  }, [user, hasRole]);

  // Clear authentication errors
  const clearAuthError = useCallback(() => {
    // This would be handled by a Redux action
  }, []);

  // Provide the auth context value
  const authContext = {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    getCurrentUser,
    hasRole,
    clearAuthError,
    getRedirectionPath,
    hasCandidateProfile,
    candidateProfile: currentCandidate,
    candidateError
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;