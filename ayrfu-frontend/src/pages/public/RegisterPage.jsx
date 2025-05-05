// src/pages/public/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const steps = ['Account Details', 'Role Selection', 'Personal Information'];

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Account details
    email: '',
    password: '',
    confirmPassword: '',
    
    // Role selection
    role: 'CANDIDATE', // Default role
    
    // Personal information
    fullName: '',
    phoneNumber: '',
    address: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);
  
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
  
  const validateCurrentStep = () => {
    const errors = {};
    
    if (activeStep === 0) {
      // Validate account details
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      }
      
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (activeStep === 1) {
      // Validate role selection
      if (!formData.role) {
        errors.role = 'Please select a role';
      }
    } else if (activeStep === 2) {
      // Validate personal information
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    // If on last step, submit the form
    if (activeStep === steps.length - 1) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Extract only needed fields for registration
        const registrationData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber || null,
          address: formData.address || null,
          roles: [{ name: formData.role }] // Send role as object with name property
        };
        
        // Send registration request
        const response = await axios.post('/ayrfu/api/auth/register', registrationData);
        
        console.log('Registration successful:', response.data);
        
        // If registration also returns a token, store it
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          // Navigate to login page with success message
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login with your new account.' 
            } 
          });
        }
      } catch (err) {
        console.error('Registration failed:', err);
        setError(
          err.response?.data?.message || 
          err.response?.data?.error || 
          'Registration failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      handleNext();
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
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
              autoComplete="new-password"
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
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={isLoading}
            />
          </>
        );
      case 1:
        return (
          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">I am registering as a:</FormLabel>
            <RadioGroup
              name="role"
              value={formData.role}
              onChange={handleChange}
              sx={{ mt: 2 }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: formData.role === 'CANDIDATE' ? '2px solid #5e35b1' : 'none',
                  bgcolor: formData.role === 'CANDIDATE' ? 'rgba(94, 53, 177, 0.08)' : 'inherit'
                }}
              >
                <FormControlLabel 
                  value="CANDIDATE" 
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">Candidate</Typography>
                    </Box>
                  } 
                />
                <Typography variant="body2" sx={{ ml: 4, mt: 1, color: 'text.secondary' }}>
                  I am looking for job opportunities at UDDAN and want to apply for positions.
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  border: formData.role === 'CLIENT' ? '2px solid #5e35b1' : 'none',
                  bgcolor: formData.role === 'CLIENT' ? 'rgba(94, 53, 177, 0.08)' : 'inherit'
                }}
              >
                <FormControlLabel 
                  value="CLIENT" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">Client</Typography>
                    </Box>
                  }
                />
                <Typography variant="body2" sx={{ ml: 4, mt: 1, color: 'text.secondary' }}>
                  I represent a business looking for UDDAN's services and solutions.
                </Typography>
              </Paper>
            </RadioGroup>
            {formErrors.role && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {formErrors.role}
              </Typography>
            )}
          </FormControl>
        );
      case 2:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              error={!!formErrors.fullName}
              helperText={formErrors.fullName}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              value={formData.address}
              onChange={handleChange}
              error={!!formErrors.address}
              helperText={formErrors.address}
              disabled={isLoading}
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
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
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create an Account
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              ) : null}
              {isLoading ? 'Processing...' : 
                activeStep === steps.length - 1 ? 'Register' : 'Next'}
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
            >
              Sign In
            </Button>
            
            <Button 
              component={Link} 
              to="/"
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
            >
              Return to Home
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;