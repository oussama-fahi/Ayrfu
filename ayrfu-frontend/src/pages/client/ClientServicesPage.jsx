import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchActiveServices, searchServicesByKeywords } from '../../redux/slices/servicesSlice';

const ClientServicesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { services, isLoading, error } = useSelector((state) => state.services);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    dispatch(fetchActiveServices());
  }, [dispatch]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
    // If search query is not empty, search by keywords
    if (e.target.value.trim()) {
      // Split search query into keywords
      const keywords = e.target.value.toLowerCase().split(' ').filter(k => k.length > 0);
      if (keywords.length > 0) {
        dispatch(searchServicesByKeywords(keywords));
      }
    } else {
      // If search query is empty, fetch all active services
      dispatch(fetchActiveServices());
    }
  };
  
  const handleRequestService = (serviceId) => {
    navigate('/client/services/request', { state: { serviceId } });
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Our Services</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a service..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : services.length > 0 ? (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  
                  {service.keywords && service.keywords.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {service.keywords.map((keyword, index) => (
                        <Chip 
                          key={index} 
                          label={keyword} 
                          size="small" 
                          color="secondary" 
                          variant="outlined" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    Details
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleRequestService(service.id)}
                  >
                    Request this service
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No services found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery 
              ? "Try modifying your search terms" 
              : "No services are available at the moment"
            }
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ClientServicesPage;