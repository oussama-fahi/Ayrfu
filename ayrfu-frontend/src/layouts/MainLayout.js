// src/layouts/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            UDDAN
          </Typography>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/applicants"
          >
            For Candidates
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/clients"
          >
            For Clients
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/contact"
          >
            Contact Us
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;