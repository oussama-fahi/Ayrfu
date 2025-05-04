import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, clearError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error, token } = useSelector((state) => state.auth);
  
  const login = useCallback(
    async (email, password) => {
      try {
        await dispatch(loginAction({ email, password })).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );
  
  const logout = useCallback(
    () => {
      dispatch(logoutAction());
    },
    [dispatch]
  );
  
  const clearAuthError = useCallback(
    () => {
      dispatch(clearError());
    },
    [dispatch]
  );
  
  const hasRole = useCallback(
    (role) => {
      if (!user || !user.roles) return false;
      return user.roles.some(r => r.name === role);
    },
    [user]
  );
  
  const isAdmin = useCallback(
    () => hasRole('ADMIN'),
    [hasRole]
  );
  
  const isSuperUser = useCallback(
    () => hasRole('SUPER_USER'),
    [hasRole]
  );
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearAuthError,
    hasRole,
    isAdmin,
    isSuperUser
  };
};

export default useAuth;