// src/components/common/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 6,
        mt: 'auto' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              UDDAN
            </Typography>
            <Typography variant="body2">
              New age IT Consulting with expertise in the genes, certifications as a must, and quality as our motto.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link 
              component={RouterLink} 
              to="/" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Home
            </Link>
            <Link 
              component={RouterLink} 
              to="/applicants" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              For Candidates
            </Link>
            <Link 
              component={RouterLink} 
              to="/clients" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              For Clients
            </Link>
            <Link 
              component={RouterLink} 
              to="/contact" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Contact Us
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" paragraph>
              123 Business Street<br />
              Tech City, 12345<br />
              contact@UDDAN.com<br />
              +1 (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Typography variant="body2" align="center">
          &copy; {currentYear} UDDAN. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;