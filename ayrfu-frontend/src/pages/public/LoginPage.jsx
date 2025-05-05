// src/pages/public/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Avatar, 
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Login API call
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Store token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Check if this is for admin login
        const isAdminPath = window.location.pathname.includes('/admin');
        
        if (isAdminPath) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const isAdminLogin = window.location.pathname.includes('/admin');
  
  return (
    <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: isAdminLogin ? 'secondary.main' : 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {isAdminLogin ? 'Admin Login' : 'Sign in to AYRFU'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
            helperText={formErrors.email}
            disabled={isLoading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color={isAdminLogin ? 'secondary' : 'primary'}
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          {!isAdminLogin && (
            <>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Or
                </Typography>
              </Divider>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  Don't have an account?
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  Register New Account
                </Button>
              </Box>
            </>
          )}
          
          <Button 
            component={Link} 
            to="/"
            fullWidth
            variant="text"
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;