import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'primary.main' }} />
      </Box>
      
      <Typography variant="h2" component="h1" gutterBottom>
        404
      </Typography>
      
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      
      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate('/')}
      >
        Back to Home Page
      </Button>
    </Container>
  );
};

export default NotFoundPage;