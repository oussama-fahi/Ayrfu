// src/pages/public/RegistrationSuccessPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Link,
  Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RegistrationSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get message from location state or use default
  const message = location.state?.message || 'Your registration was successful!';
  const role = location.state?.role || 'user';
  
  // Redirect to home if accessed directly without coming from registration
  useEffect(() => {
    if (!location.state) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);
  
  // Get role-specific UI elements
  const getRoleIcon = () => {
    switch (role) {
      case 'candidate':
        return <PersonIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />;
      case 'client':
        return <BusinessIcon sx={{ fontSize: 40, mb: 1, color: 'secondary.main' }} />;
      default:
        return <CheckCircleIcon sx={{ fontSize: 40, mb: 1, color: 'success.main' }} />;
    }
  };
  
  const getNextSteps = () => {
    switch (role) {
      case 'candidate':
        return (
          <>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              What's Next?
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                Browse open positions and find opportunities that match your skills
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Apply for positions with your completed profile
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Track your applications in your candidate dashboard
              </Typography>
            </Box>
          </>
        );
      case 'client':
        return (
          <>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              What's Next?
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                Complete your company profile with additional details
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Browse services or post job positions
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Connect with our team for custom solutions
              </Typography>
            </Box>
          </>
        );
      default:
        return (
          <Typography variant="body1" paragraph>
            You can now log in to your account and access all features.
          </Typography>
        );
    }
  };
  
  const getButtonLink = () => {
    switch (role) {
      case 'candidate':
        return '/positions';
      case 'client':
        return '/client/dashboard';
      default:
        return '/';
    }
  };
  
  const getButtonText = () => {
    switch (role) {
      case 'candidate':
        return 'Browse Open Positions';
      case 'client':
        return 'Go to Client Dashboard';
      default:
        return 'Go to Home Page';
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'success.light',
            mx: 'auto',
            mb: 2
          }}
        >
          <CheckCircleIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="h4" gutterBottom color="success.main">
          Registration Successful!
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 3 }}>
          {message}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {getRoleIcon()}
          {getNextSteps()}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={RouterLink}
            to={getButtonLink()}
            sx={{ px: 4 }}
          >
            {getButtonText()}
          </Button>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Need help? <Link component={RouterLink} to="/contact">Contact our support team</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationSuccessPage;