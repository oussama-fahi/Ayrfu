// src/pages/public/ClientsPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Chip, // Add this import
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';

// Redux
import { searchServicesByPrompt, clearServiceResults } from '../../redux/slices/servicesSlice';

const examplePrompts = [
  "I need help with digital transformation in my banking company",
  "Looking for mobile app development for my e-commerce business",
  "Need IT consulting for cloud migration",
  "Searching for custom software development for logistics management"
];

const ClientsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, isLoading } = useSelector((state) => state.services);
  
  const [searchPrompt, setSearchPrompt] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearchChange = (event) => {
    setSearchPrompt(event.target.value);
  };
  
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchPrompt.trim() === '') return;
    
    dispatch(searchServicesByPrompt(searchPrompt));
    setHasSearched(true);
  };
  
  const handleExampleClick = (example) => {
    setSearchPrompt(example);
  };
  
  const resetSearch = () => {
    setSearchPrompt('');
    setHasSearched(false);
    dispatch(clearServiceResults());
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Find the Right Service for Your Business
      </Typography>
      
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          How can UDDAN help your business?
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph>
          Tell us what you're looking for in your own words, and we'll match you with the most relevant services.
        </Typography>
        
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', mb: 4 }}>
            <TextField
              fullWidth
              label="Describe what you're looking for..."
              variant="outlined"
              value={searchPrompt}
              onChange={handleSearchChange}
              placeholder="e.g., I need IT consulting for my retail business..."
              sx={{ mr: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              disabled={isLoading || searchPrompt.trim() === ''}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </form>
        
        {!hasSearched && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Try one of these examples:</Typography>
            </Box>
            
            <Grid container spacing={2}>
              {examplePrompts.map((prompt, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      height: '100%',
                    }}
                    onClick={() => handleExampleClick(prompt)}
                  >
                    <CardContent>
                      <Typography variant="body1">{prompt}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {hasSearched && searchResults.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Services matching your needs
              </Typography>
              <Button variant="outlined" onClick={resetSearch}>
                New Search
              </Button>
            </Box>
            
            <Typography variant="body1" color="textSecondary" paragraph>
              We found {searchResults.length} service{searchResults.length !== 1 ? 's' : ''} that might be helpful for your business.
            </Typography>
            
            {searchResults.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                onViewDetails={() => navigate(`/services/${service.id}`)}
              />
            ))}
          </Box>
        )}
        
        {hasSearched && searchResults.length === 0 && !isLoading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No matching services found
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We couldn't find services matching your description. Please try different keywords or contact us directly for a custom solution.
            </Typography>
            <Button variant="outlined" onClick={resetSearch}>
              New Search
            </Button>
          </Box>
        )}
      </Paper>
      
      <Paper sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Why businesses choose UDDAN
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
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
  );
};

// Service Card Component
const ServiceCard = ({ service, onViewDetails }) => {
  return (
    <Paper elevation={2} sx={{ mb: 3, p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {service.title}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {service.description}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Key Benefits:</strong>
        </Typography>
        <ul>
          {service.benefits.split(',').map((benefit, index) => (
            <li key={index}>
              <Typography variant="body2">
                {benefit.trim()}
              </Typography>
            </li>
          ))}
        </ul>
      </Box>
      
      {service.availability && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Availability:</strong> {service.availability}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {service.keywords.map((keyword, index) => (
          <Chip key={index} label={keyword} size="small" />
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          onClick={onViewDetails}
        >
          Learn More
        </Button>
      </Box>
    </Paper>
  );
};

export default ClientsPage;