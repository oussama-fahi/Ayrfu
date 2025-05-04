import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fetchPositionById } from '../../redux/slices/positionsSlice';

const PositionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // For demo purposes, we'll use mock data instead of fetching from Redux
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock position data
      const mockPosition = {
        id: id,
        title: "Senior Java Developer",
        description: "We are looking for a skilled Java Developer to join our team. The ideal candidate should have strong knowledge of Java, Spring Boot, and databases. You will be responsible for developing and maintaining our core applications, working in a collaborative team environment.",
        technology: "Java",
        location: "Remote",
        languages: ["English", "French"],
        experienceLevel: "Senior",
        workModel: "Full-time",
        responsibilities: [
          "Design and develop high-volume, low-latency applications",
          "Write clean, maintainable code with proper testing",
          "Collaborate with cross-functional teams",
          "Participate in code reviews",
          "Troubleshoot production issues"
        ],
        requirements: [
          "5+ years of experience with Java",
          "Strong knowledge of Spring Boot and Spring Framework",
          "Experience with relational databases and ORM technologies",
          "Familiarity with REST APIs and microservices architecture",
          "Good understanding of design patterns"
        ],
        active: true
      };
      
      setPosition(mockPosition);
      setIsLoading(false);
    }, 1000);
    
    // In a real application, you would use:
    // dispatch(fetchPositionById(id));
  }, [id]);
  
  if (isLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading position details...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading position
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/applicants')}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }
  
  if (!position) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Position not found
          </Typography>
          <Typography variant="body1" paragraph>
            The position you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/applicants')}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/applicants')}
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
          {position.description}
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Responsibilities
            </Typography>
            <List>
              {position.responsibilities.map((item, index) => (
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
              {position.requirements.map((item, index) => (
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
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            <TranslateIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
            <strong>Languages:</strong>
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {position.languages.map((language, index) => (
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
        >
          Apply Now
        </Button>
      </Box>
    </Container>
  );
};

export default PositionDetailPage;