import {
  ArrowBack as ArrowBackIcon,
  BusinessCenter as BusinessCenterIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Code as CodeIcon,
  LocationOn as LocationOnIcon,
  Translate as TranslateIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * PositionDetailPage component - Displays details of a specific job position
 * 
 * @returns {JSX.Element} The rendered component
 */
const PositionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/positions/${id}`);
        setPosition(response.data);
      } catch (err) {
        console.error('Error fetching position details:', err);
        setError('Failed to load position details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosition();
  }, [id]);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading position details...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/positions')}
        >
          Back to Positions
        </Button>
      </Container>
    );
  }
  
  if (!position) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Position not found or has been removed.
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/positions')}
        >
          Back to Positions
        </Button>
      </Container>
    );
  }
  
  // For mock data demonstration purposes
  const mockResponsibilities = [
    "Design and develop high-volume, low-latency applications",
    "Write clean, maintainable code with proper testing",
    "Collaborate with cross-functional teams",
    "Participate in code reviews",
    "Troubleshoot production issues"
  ];
  
  const mockRequirements = [
    `${position.experienceLevel} level experience in ${position.technology}`,
    "Strong problem-solving skills",
    "Excellent communication and teamwork abilities",
    "Proactive attitude and willingness to learn",
    "Ability to work in a fast-paced environment"
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component="button"
          underline="hover" 
          color="inherit"
          onClick={() => navigate('/')}
        >
          Home
        </Link>
        <Link 
          component="button"
          underline="hover" 
          color="inherit"
          onClick={() => navigate('/positions')}
        >
          Positions
        </Link>
        <Typography color="text.primary">{position.title}</Typography>
      </Breadcrumbs>
      
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/positions')}
        sx={{ mb: 4 }}
      >
        Back to Positions
      </Button>
      
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {position.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip icon={<CodeIcon />} label={position.technology} />
          <Chip icon={<LocationOnIcon />} label={position.location} />
          <Chip icon={<WorkIcon />} label={position.workModel} />
          <Chip label={`Experience: ${position.experienceLevel}`} />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Job Description
        </Typography>
        <Typography variant="body1" paragraph>
          {position.description || 'No description provided.'}
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Responsibilities
            </Typography>
            <List>
              {mockResponsibilities.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <List>
              {mockRequirements.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Additional Information */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessCenterIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                <strong>Position Type:</strong> {position.workModel}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                <strong>Location:</strong> {position.location}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                <strong>Start Date:</strong> Immediate
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mb: 3, mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            <TranslateIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
            <strong>Languages:</strong>
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {position.languages && position.languages.map((language, index) => (
              <Chip key={index} label={language} />
            ))}
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate(`/apply/${position.id}`)}
          sx={{ py: 1.5, px: 4 }}
        >
          Apply Now
        </Button>
      </Box>
    </Container>
  );
};

export default PositionDetailPage;