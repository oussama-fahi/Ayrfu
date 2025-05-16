// src/pages/user/UserApplicationsPage.jsx
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const UserApplicationsPage = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check if user has candidate role
    if (!hasRole('ROLE_CANDIDATE')) {
      navigate('/user/profile');
      return;
    }
    
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // Get candidate applications from the API
        const response = await axios.get('/api/users/profile/candidate/applications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
        
        // If 401 unauthorized, redirect to login
        if (err.response?.status === 401) {
          // localStorage.removeItem('token');
          // navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate, hasRole]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'primary';
      case 'REVIEWING':
        return 'secondary';
      case 'INTERVIEW':
        return 'info';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your applications...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          My Applications
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {applications.length > 0 ? (
          <List>
            {applications.map((application) => (
              <React.Fragment key={application.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    py: 2, 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                  onClick={() => navigate(`/positions/${application.position.id}`)}
                >
                  <ListItemText
                    primary={application.position.title}
                    secondary={
                      <>
                        <Typography 
                          component="span" 
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block' }}
                        >
                          Applied on: {formatDate(application.appliedAt)}
                        </Typography>
                        {application.coverLetter && (
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ 
                              display: 'block',
                              mt: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {application.coverLetter}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label={application.status} 
                      color={getStatusColor(application.status)} 
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            You haven't submitted any applications yet.
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/applicants')}
          >
            Browse Open Positions
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserApplicationsPage;