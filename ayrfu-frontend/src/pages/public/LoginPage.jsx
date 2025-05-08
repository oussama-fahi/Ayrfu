// src/pages/public/LoginPage.jsx - Fix login redirection
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Paper, Typography, TextField, Button, Link,
  Divider, Alert, CircularProgress, Tabs, Tab
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearAuthError, getRedirectionPath } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loginType, setLoginType] = useState(0); // 0 = candidate/client, 1 = admin/super-user
  const [loggingIn, setLoggingIn] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    // Clear any previous auth errors
    if (clearAuthError) clearAuthError();
    
    // If authenticated and not loading anymore, redirect
    if (isAuthenticated && !isLoading) {
      const redirectTo = getRedirectionPath();
      // Add a small delay to ensure state updates are complete
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, getRedirectionPath, clearAuthError]);

  // Set login type based on URL
  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setLoginType(1);
    }
  }, [location]);

  const handleLoginTypeChange = (event, newValue) => {
    setLoginType(newValue);
    clearAuthError();
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors on input change
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setLoggingIn(true);
    try {
      // Call login function and wait for it to complete
      await login(formData.email, formData.password);
      // No need to navigate here - the useEffect will handle redirection
    } catch (err) {
      console.error('Login error:', err);
      // Error state is already set in the login function
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ width: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
          <Box sx={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', borderRadius: '50%', mb: 2 }}>
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in to UDDAN
          </Typography>
          
          <Tabs value={loginType} onChange={handleLoginTypeChange} sx={{ mb: 3, width: '100%' }}>
            <Tab label="Candidate/Client" />
            <Tab label="Administration" />
          </Tabs>
          
          {loginType === 0 ? (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Access your candidate or client account
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Access the admin interface
            </Typography>
          )}
          
          {formErrors.email && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {formErrors.email}
            </Alert>
          )}
          
          {formErrors.password && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {formErrors.password}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          {location.state?.message && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              {location.state.message}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              disabled={loggingIn || isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              disabled={loggingIn || isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loggingIn || isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loggingIn || isLoading ? (
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              ) : null}
              {loggingIn || isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Or
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
              
              {loginType === 0 && (
                <Link component={RouterLink} to="/register" variant="body2">
                  Create an account
                </Link>
              )}
            </Box>
            
            {loginType === 0 && (
              <>
                <Divider sx={{ width: '100%', my: 3 }} />
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Are you a recruiter or a company?
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    component={RouterLink}
                    to="/contact"
                    sx={{ mt: 1 }}
                  >
                    Contact us
                  </Button>
                </Box>
              </>
            )}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/"
                variant="text"
                size="small"
              >
                Return to Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;