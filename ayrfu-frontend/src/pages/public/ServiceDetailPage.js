import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

// Redux
import { fetchServiceById } from '../../redux/slices/servicesSlice';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentService, isLoading, error } = useSelector((state) => state.services);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [dispatch, id]);
  
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading service details...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading service
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/clients')}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }
  
  if (!currentService) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Service not found
          </Typography>
          <Typography variant="body1" paragraph>
            The service you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/clients')}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }
  
  // Split benefits into array
  const benefitsList = currentService.benefits.split(',').map(benefit => benefit.trim());
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/clients')}
        sx={{ mb: 4 }}
      >
        Back to Services
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {currentService.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {currentService.keywords.map((keyword, index) => (
                <Chip key={index} label={keyword} />
              ))}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body1" paragraph>
              {currentService.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Key Benefits
            </Typography>
            
            <List>
              {benefitsList.map((benefit, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
            
            {currentService.availability && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  <strong>Availability:</strong> {currentService.availability}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interested in this service?
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Contact us to learn more about how we can help your business.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<MailOutlineIcon />}
                onClick={() => navigate('/contact')}
                sx={{ mt: 2 }}
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Services
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Custom Software Development" 
                  secondary="Tailored solutions for your specific needs"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem disableGutters>
                <ListItemText 
                  primary="IT Consulting" 
                  secondary="Expert advice and strategic planning"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem disableGutters>
                <ListItemText 
                  primary="Mobile App Development" 
                  secondary="iOS and Android applications"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceDetailPage;