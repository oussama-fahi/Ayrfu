import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  CircularProgress,
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
  const [loggingIn, setLoggingIn] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirectTo = getRedirectionPath();
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, getRedirectionPath]);

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
      const result = await login(formData.email, formData.password);
      if (result) {
        // Redirection will be handled by the AuthContext
      }
    } catch (err) {
      console.error('Login error:', err);
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
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Access your account - candidates, clients and administrators
          </Typography>

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
              <Link component={RouterLink} to="/register" variant="body2">
                Create an account
              </Link>
            </Box>
            
            <Divider sx={{ width: '100%', my: 3 }} />
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button component={RouterLink} to="/" variant="text" size="small">
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