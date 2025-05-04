import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';

const MainPage = () => {
  const navigate = useNavigate();

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
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            AYRFU
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Are You Ready For UDDAN?
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            Connect with UDDAN for job opportunities and innovative business solutions.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
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
                <PersonIcon sx={{ fontSize: 80, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  For Candidates
                </Typography>
                <Typography>
                  Looking for an exciting career opportunity? Explore our open positions and join our team of professionals.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handleCandidateClick}
                >
                  Find Your Perfect Job
                </Button>
              </Box>
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
                <BusinessIcon sx={{ fontSize: 80, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  For Clients
                </Typography>
                <Typography>
                  Discover how UDDAN can help your business grow with our specialized services and solutions.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  onClick={handleClientClick}
                >
                  Explore Our Services
                </Button>
              </Box>
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
                <AdminPanelSettingsIcon sx={{ fontSize: 80, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  UDDAN Team
                </Typography>
                <Typography>
                  Authorized personnel only. Access the back office to manage positions, services, and communications.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#5c6bc0', '&:hover': { bgcolor: '#3f51b5' } }}
                  fullWidth
                  onClick={handleAdminClick}
                >
                  Team Login
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ my: 8, p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Why Choose UDDAN?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <SpeedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="textSecondary">
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
                <Typography variant="body2" color="textSecondary">
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
                <Typography variant="body2" color="textSecondary">
                  Rigorous quality control to ensure reliable and robust solutions.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default MainPage;
