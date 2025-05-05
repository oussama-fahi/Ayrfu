// src/pages/public/MainPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Business as BusinessIcon, 
  SupervisorAccount as AdminIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  VerifiedUser as VerifiedIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';

const MainPage = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleCandidateClick = () => {
    navigate('/applicants');
  };

  const handleClientClick = () => {
    navigate('/clients');
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div>
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: { xs: 4, md: 8 },
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 6 } }}>
            <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              AYRFU
            </Typography>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Are You Ready For UDDAN?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: '700px', mx: 'auto', opacity: 0.9 }}>
              Connect with UDDAN for job opportunities and innovative business solutions.
            </Typography>
            
            {/* Authentication buttons visible directly on hero section */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center" 
              sx={{ mt: 4 }}
            >
              {isAuthenticated ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<ProfileIcon />}
                    component={Link}
                    to="/user/profile"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    My Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    component={Link}
                    to="/admin/dashboard"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Admin Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<LoginIcon />}
                    component={Link}
                    to="/login"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    startIcon={<RegisterIcon />}
                    component={Link}
                    to="/register"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Main cards */}
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
          Choose Your Path
        </Typography>
        
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                cursor: 'pointer'
              }}
              onClick={handleCandidateClick}
            >
              <Box sx={{ bgcolor: 'primary.main', p: 4, display: 'flex', justifyContent: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
                  For Candidates
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Looking for an exciting career opportunity? Explore our open positions and join our team of professionals.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCandidateClick();
                  }}
                >
                  Find Your Perfect Job
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                cursor: 'pointer'
              }}
              onClick={handleClientClick}
            >
              <Box sx={{ bgcolor: 'secondary.main', p: 4, display: 'flex', justifyContent: 'center' }}>
                <BusinessIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
                  For Clients
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Discover how UDDAN can help your business grow with our specialized services and solutions.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClientClick();
                  }}
                >
                  Explore Our Services
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                cursor: 'pointer'
              }}
              onClick={handleAdminClick}
            >
              <Box sx={{ bgcolor: '#5c6bc0', p: 4, display: 'flex', justifyContent: 'center' }}>
                <AdminIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
                  UDDAN Team
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Authorized personnel only. Access the back office to manage positions, services, and communications.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#5c6bc0', '&:hover': { bgcolor: '#3f51b5' } }}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdminClick();
                  }}
                >
                  Team Login
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Why Choose section */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
            Why Choose UDDAN?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <SpeedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quickly implement solutions that drive immediate business value.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Expert Team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Skilled professionals with deep industry knowledge and experience.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <VerifiedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Quality Assured
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rigorous quality control to ensure reliable and robust solutions.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Quick access section for authentication */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Divider sx={{ mb: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {isAuthenticated ? 'Quick Access' : 'Get Started'}
            </Typography>
          </Divider>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  component={Link}
                  to="/user/profile"
                  startIcon={<ProfileIcon />}
                >
                  My Profile
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/user/applications"
                >
                  My Applications
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/admin/dashboard"
                  startIcon={<AdminIcon />}
                >
                  Admin Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/register"
                  startIcon={<RegisterIcon />}
                >
                  Create Account
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/admin/login"
                  startIcon={<AdminIcon />}
                >
                  Admin Login
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Container>
    </div>
  );
};

export default MainPage;