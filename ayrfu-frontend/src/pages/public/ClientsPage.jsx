// src/pages/public/ClientsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Button
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import StorageIcon from '@mui/icons-material/Storage';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';

const ClientsPage = () => {
  const navigate = useNavigate();
  
  // Liste des catégories de services avec leurs icônes
  const serviceCategories = [
    { name: 'Software Development', icon: <CodeIcon color="primary" />, id: 1 },
    { name: 'Cloud Migration & Management', icon: <CloudIcon color="primary" />, id: 2 },
    { name: 'IT Security & Compliance', icon: <SecurityIcon color="primary" />, id: 3 },
    { name: 'Mobile Application Development', icon: <PhoneAndroidIcon color="primary" />, id: 4 },
    { name: 'Data Management & Analytics', icon: <StorageIcon color="primary" />, id: 5 }, 
    { name: 'IT Consulting & Strategy', icon: <BusinessIcon color="primary" />, id: 6 },
    { name: 'Training & Workshops', icon: <SchoolIcon color="primary" />, id: 7 }
  ];
  
  const handleCategoryClick = (category) => {
    // Rediriger vers le formulaire de candidature pour ce service
    navigate(`/apply/${category.id}`, { state: { serviceCategory: category.name } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h1" sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            color: 'secondary.main'
          }}>
            Our Business Services
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: '800px', mx: 'auto' }}>
            Discover how UDDAN can help your business grow with our specialized services and solutions.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: 'secondary.main'
          }}>
            Explore Our Services
          </Typography>
          
          {/* Liste des catégories de services */}
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <List>
              {serviceCategories.map((category, index) => (
                <React.Fragment key={category.name}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    button 
                    onClick={() => handleCategoryClick(category)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
        
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: 'secondary.main'
          }}>
            Why Businesses Choose UDDAN
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'secondary.light', 
                    color: 'secondary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>
                    </svg>
                  </Box>
                  <Typography variant="h6" gutterBottom>Fast Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quickly implement solutions that drive immediate business value.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'secondary.light', 
                    color: 'secondary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </Box>
                  <Typography variant="h6" gutterBottom>Expert Team</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Skilled professionals with deep industry knowledge and experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'secondary.light', 
                    color: 'secondary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 9l-1.41-1.42L10 14.17l-2.59-2.58L6 13l4 4zm1-6h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"/>
                    </svg>
                  </Box>
                  <Typography variant="h6" gutterBottom>Quality Assured</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rigorous quality control to ensure reliable and robust solutions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Not sure which service is right for you?
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ mt: 2 }}
          >
            Contact Our Team
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default ClientsPage;