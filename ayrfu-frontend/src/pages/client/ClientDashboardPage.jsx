// src/pages/client/ClientDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    serviceRequests: [],
    requestStats: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    },
    recentMessages: [],
    recentDocuments: [],
    recommendedServices: []
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch service requests
        const requestsResponse = await axios.get('/api/service-requests/my-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch recent messages
        const messagesResponse = await axios.get('/api/messages/recent/client', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch recent documents
        const documentsResponse = await axios.get('/api/documents/recent', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch recommended services
        const servicesResponse = await axios.get('/api/services/recommended', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Calculate request stats
        const requests = requestsResponse.data || [];
        const requestStats = {
          total: requests.length,
          pending: requests.filter(req => req.status === 'PENDING').length,
          inProgress: requests.filter(req => req.status === 'IN_PROGRESS').length,
          completed: requests.filter(req => req.status === 'COMPLETED').length,
          cancelled: requests.filter(req => req.status === 'CANCELLED').length
        };
        
        setDashboardData({
          serviceRequests: requests.slice(0, 5),
          requestStats,
          recentMessages: messagesResponse.data || [],
          recentDocuments: documentsResponse.data || [],
          recommendedServices: servicesResponse.data || []
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Prepare chart data
  const pieChartData = [
    { name: 'Pending', value: dashboardData.requestStats.pending, color: '#1976D2' },
    { name: 'In Progress', value: dashboardData.requestStats.inProgress, color: '#FF9800' },
    { name: 'Completed', value: dashboardData.requestStats.completed, color: '#4CAF50' },
    { name: 'Cancelled', value: dashboardData.requestStats.cancelled, color: '#F44336' }
  ].filter(item => item.value > 0);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'primary';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.fullName || user?.client?.companyName || 'Client'}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Service requests summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Service Request Status
            </Typography>
            
            {dashboardData.requestStats.total > 0 ? (
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
                    <Tooltip formatter={(value) => [`${value} request(s)`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't submitted any service requests yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate('/client/services')}
                  sx={{ mt: 2 }}
                >
                  Browse Services
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recent service requests */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Service Requests
              </Typography>
              <Button 
                variant="outlined" 
                color="secondary"
                size="small"
                onClick={() => navigate('/client/services')}
              >
                View All
              </Button>
            </Box>
            
            {dashboardData.serviceRequests.length > 0 ? (
              <List>
                {dashboardData.serviceRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/client/requests/${request.id}`)}
                      sx={{ py: 2 }}
                    >
                      <ListItemText 
                        primary={request.service.title}
                        secondary={`Requested on: ${formatDate(request.requestedAt)}`}
                      />
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status)} 
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
                  You haven't submitted any service requests yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate('/client/services')}
                  sx={{ mt: 2 }}
                >
                  Browse Services
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recent documents */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Documents
              </Typography>
              <Button 
                variant="outlined"
                color="secondary" 
                size="small"
                onClick={() => navigate('/client/documents')}
              >
                View All
              </Button>
            </Box>
            
            {dashboardData.recentDocuments.length > 0 ? (
              <List>
                {dashboardData.recentDocuments.map((document) => (
                  <React.Fragment key={document.id}>
                    <ListItem 
                      button 
                      onClick={() => window.open(`/api/documents/view/${document.id}`, '_blank')}
                      sx={{ py: 2 }}
                    >
                      <ListItemText 
                        primary={document.filename}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {document.documentType}
                            </Typography>
                            <Typography component="p" variant="body2">
                              Uploaded: {formatDate(document.uploadedAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No documents available.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate('/client/documents/upload')}
                  sx={{ mt: 2 }}
                >
                  Upload Document
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recent messages */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Messages
              </Typography>
              <Button 
                variant="outlined"
                color="secondary" 
                size="small"
                onClick={() => navigate('/client/messages')}
              >
                View All
              </Button>
            </Box>
            
            {dashboardData.recentMessages.length > 0 ? (
              <List>
                {dashboardData.recentMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate('/client/messages', { state: { selectedMessage: message.id } })}
                      sx={{ 
                        py: 2,
                        bgcolor: !message.read ? 'rgba(46, 125, 50, 0.08)' : 'transparent'
                      }}
                    >
                      <ListItemText 
                        primary={message.senderName}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {formatDate(message.sentAt)}
                            </Typography>
                            <Typography component="p" variant="body2">
                              {message.content && message.content.length > 100
                                ? `${message.content.substring(0, 100)}...`
                                : message.content}
                            </Typography>
                          </>
                        }
                      />
                      {!message.read && (
                        <Chip label="New" size="small" color="secondary" />
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No messages available.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recommended services */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Services
            </Typography>
            
            {dashboardData.recommendedServices.length > 0 ? (
              <Grid container spacing={3}>
                {dashboardData.recommendedServices.map((service) => (
                  <Grid item xs={12} md={4} key={service.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {service.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {service.keywords.join(', ')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {service.description && service.description.length > 100
                            ? `${service.description.substring(0, 100)}...`
                            : service.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/services/${service.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained"
                          color="secondary" 
                          onClick={() => navigate('/client/services/request', { state: { serviceId: service.id } })}
                        >
                          Request Service
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No recommended services available at the moment.
                </Typography>
                <Button 
                  variant="contained"
                  color="secondary" 
                  onClick={() => navigate('/client/services')}
                  sx={{ mt: 2 }}
                >
                  Browse All Services
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientDashboardPage;