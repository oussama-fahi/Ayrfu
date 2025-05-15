import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import {
  DashboardCustomize as DashboardIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { getCandidateApplications } from '../../redux/slices/candidatesSlice';
import { fetchActivePositions } from '../../redux/slices/positionsSlice';
import { fetchUnreadMessageCount } from '../../redux/slices/messagesSlice';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { applications, isLoading: applicationsLoading } = useSelector((state) => state.candidates);
  const { positions, isLoading: positionsLoading } = useSelector((state) => state.positions);
  const { unreadCount, isLoading: messagesLoading } = useSelector((state) => state.messages);
  
  const [dashboardData, setDashboardData] = useState({
    recentApplications: [],
    applicationStats: {
      total: 0,
      pending: 0,
      reviewing: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
    },
    recommendedPositions: [],
  });
  
  const [error, setError] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getCandidateApplications(user.id));
      dispatch(fetchActivePositions());
      dispatch(fetchUnreadMessageCount());
    }
  }, [dispatch, user]);
  
  // Process applications data
  useEffect(() => {
    if (applications) {
      // Calculate application stats
      const appStats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'PENDING').length,
        reviewing: applications.filter(app => app.status === 'REVIEWING').length,
        interview: applications.filter(app => app.status === 'INTERVIEW').length,
        accepted: applications.filter(app => app.status === 'ACCEPTED').length,
        rejected: applications.filter(app => app.status === 'REJECTED').length,
        withdrawn: applications.filter(app => app.status === 'WITHDRAWN').length,
      };
      
      // Get 5 most recent applications
      const recentApps = [...applications]
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 5);
      
      setDashboardData(prev => ({
        ...prev,
        recentApplications: recentApps,
        applicationStats: appStats,
      }));
    }
  }, [applications]);
  
  // Process positions for recommendations
  useEffect(() => {
    if (positions && positions.length > 0 && user?.technologies) {
      // Simple recommendation algorithm based on matching technologies
      // In a real app, this would be more sophisticated
      const userTechs = user.technologies || [];
      const userLangs = user.languages || [];
      const userExpLevel = user.experienceLevel;
      const userLocation = user.preferredLocation;
      const userWorkModel = user.preferredWorkModel;
      
      // Calculate a match score for each position
      const scoredPositions = positions.map(position => {
        let score = 0;
        
        // Technology match (highest weight)
        if (userTechs.includes(position.technology)) {
          score += 40;
        }
        
        // Language match
        const langMatch = position.languages?.filter(lang => userLangs.includes(lang)).length || 0;
        score += langMatch * 15;
        
        // Experience level match
        if (position.experienceLevel === userExpLevel) {
          score += 20;
        }
        
        // Location match
        if (position.location === userLocation) {
          score += 15;
        }
        
        // Work model match
        if (position.workModel === userWorkModel) {
          score += 10;
        }
        
        return {
          ...position,
          matchScore: score,
        };
      });
      
      // Sort by match score and get top 3
      const recommended = scoredPositions
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      
      setDashboardData(prev => ({
        ...prev,
        recommendedPositions: recommended,
      }));
    }
  }, [positions, user]);
  
  // Prepare chart data
  const pieChartData = [
    { name: 'Pending', value: dashboardData.applicationStats.pending, color: '#1976D2' },
    { name: 'Reviewing', value: dashboardData.applicationStats.reviewing, color: '#9C27B0' },
    { name: 'Interview', value: dashboardData.applicationStats.interview, color: '#FF9800' },
    { name: 'Accepted', value: dashboardData.applicationStats.accepted, color: '#4CAF50' },
    { name: 'Rejected', value: dashboardData.applicationStats.rejected, color: '#F44336' },
    { name: 'Withdrawn', value: dashboardData.applicationStats.withdrawn, color: '#9E9E9E' },
  ].filter(item => item.value > 0);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'primary';
      case 'REVIEWING':
        return 'secondary';
      case 'INTERVIEW':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'WITHDRAWN':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };
  
  // Check if loading
  const isLoading = applicationsLoading || positionsLoading || messagesLoading;
  
  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.fullName || 'Candidate'}
      </Typography>
      
      {/* Dashboard Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              bgcolor: 'primary.light', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 2,
            }}>
              <DashboardIcon fontSize="large" sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Applications</Typography>
              <Typography variant="h4">{dashboardData.applicationStats.total}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              bgcolor: 'success.light', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 2,
            }}>
              <WorkIcon fontSize="large" sx={{ color: 'success.main' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Active Applications</Typography>
              <Typography variant="h4">
                {dashboardData.applicationStats.pending + 
                 dashboardData.applicationStats.reviewing + 
                 dashboardData.applicationStats.interview}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              bgcolor: 'warning.light', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 2,
            }}>
              <EmailIcon fontSize="large" sx={{ color: 'warning.main' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Unread Messages</Typography>
              <Typography variant="h4">{unreadCount}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        {/* Applications Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Application Status</Typography>
            {dashboardData.applicationStats.total > 0 ? (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} application(s)`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't submitted any applications yet.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/positions')} 
                  sx={{ mt: 2 }}
                >
                  Browse Job Openings
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Applications */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Applications</Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => navigate('/candidate/applications')}
              >
                View All
              </Button>
            </Box>
            {dashboardData.recentApplications.length > 0 ? (
              <List>
                {dashboardData.recentApplications.map((application) => (
                  <React.Fragment key={application.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/candidate/applications/${application.id}`)}
                      sx={{ py: 2 }}
                    >
                      <ListItemText 
                        primary={application.position.title}
                        secondary={`Applied on: ${formatDate(application.appliedAt)}`}
                      />
                      <Chip 
                        label={formatStatus(application.status)} 
                        color={getStatusColor(application.status)} 
                        size="small" 
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't submitted any applications yet.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/positions')} 
                  sx={{ mt: 2 }}
                >
                  Browse Job Openings
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recommended Positions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recommended Positions</Typography>
            {dashboardData.recommendedPositions.length > 0 ? (
              <Grid container spacing={3}>
                {dashboardData.recommendedPositions.map((position) => (
                  <Grid item xs={12} md={4} key={position.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{position.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {position.technology} • {position.location} • {position.workModel}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {position.description && position.description.length > 100
                            ? `${position.description.substring(0, 100)}...`
                            : position.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AssessmentIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="subtitle2">
                            Match Score: {position.matchScore}%
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/positions/${position.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          onClick={() => navigate(`/apply/${position.id}`)}
                          endIcon={<ArrowForwardIcon />}
                        >
                          Apply
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  {user?.technologies?.length > 0 
                    ? 'No recommended positions available for your profile at the moment.'
                    : 'Complete your profile with skills and preferences to get personalized recommendations.'}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/positions')} 
                  sx={{ mt: 2, mr: 2 }}
                >
                  Browse All Positions
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/user/profile')} 
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CandidateDashboard;