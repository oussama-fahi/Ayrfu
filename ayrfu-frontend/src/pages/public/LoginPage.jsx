// src/pages/public/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  Divider,
  Grid
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract previous page path or message from location state
  const message = location.state?.message || null;
  const from = location.state?.from?.pathname || '/';
  const adminLogin = location.pathname.includes('/admin/login');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If already logged in, redirect to appropriate page
      if (adminLogin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate, adminLogin]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/login', formData);
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Check user roles to determine redirect
        const roles = response.data.roles || [];
        
        // Handle admin login specifically
        if (adminLogin) {
          // If logging in from admin page, always redirect to dashboard
          navigate('/admin/dashboard');
        } else if (roles.includes('ADMIN') || roles.includes('SUPER_USER')) {
          // If admin/super user from regular login, ask if they want to go to admin dashboard
          const goToAdmin = window.confirm('You have admin privileges. Would you like to go to the admin dashboard?');
          if (goToAdmin) {
            navigate('/admin/dashboard');
          } else {
            // Redirect to from page or home
            navigate(from !== '/' ? from : '/user/profile');
          }
        } else {
          // For regular users, go to profile page or previous page
          navigate(from !== '/' ? from : '/user/profile');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
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
        <Avatar sx={{ m: 1, bgcolor: adminLogin ? 'secondary.main' : 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {adminLogin ? 'Admin Login' : 'Sign in to AYRFU'}
        </Typography>
        
        {message && (
          <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
            {message}
          </Alert>
        )}
        
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
            color={adminLogin ? 'secondary' : 'primary'}
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          {!adminLogin && (
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