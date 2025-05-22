// src/pages/client/ClientDashboardPage.jsx
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
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderIcon from '@mui/icons-material/Folder';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

// Charts
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Redux actions
import { fetchConversations } from '../../redux/slices/conversationsSlice';
import { fetchRecentDocuments, downloadDocument } from '../../redux/slices/documentsSlice';
import { fetchUnreadMessages } from '../../redux/slices/messagesSlice';
import { fetchActiveServices } from '../../redux/slices/servicesSlice';
import { getCurrentClientServiceRequests } from '../../redux/slices/serviceRequestsSlice';

// Components
import DocumentUploadForm from '../../components/documents/DocumentUploadForm';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get data from Redux store
  const { user } = useSelector(state => state.auth);
  const { serviceRequests, isLoading: requestsLoading } = useSelector(state => state.serviceRequests);
  const { services, isLoading: servicesLoading } = useSelector(state => state.services);
  const { messages, isLoading: messagesLoading } = useSelector(state => state.messages);
  const { documents, isLoading: documentsLoading } = useSelector(state => state.documents);
  
  const isLoading = requestsLoading || servicesLoading || messagesLoading || documentsLoading;
  
  // State for document upload dialog
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(getCurrentClientServiceRequests());
    dispatch(fetchActiveServices());
    dispatch(fetchRecentDocuments());
    dispatch(fetchUnreadMessages());
    dispatch(fetchConversations());
  }, [dispatch]);

  // Calculate request stats based on status
  const requestStats = {
    total: serviceRequests?.length || 0,
    pending: serviceRequests?.filter(req => req.status === 'PENDING').length || 0,
    inProgress: serviceRequests?.filter(req => req.status === 'IN_REVIEW' || req.status === 'ACCEPTED').length || 0,
    completed: serviceRequests?.filter(req => req.status === 'COMPLETED').length || 0,
    rejected: serviceRequests?.filter(req => req.status === 'REJECTED').length || 0
  };

  // Prepare chart data
  const pieChartData = [
    { name: 'Pending', value: requestStats.pending, color: theme.palette.primary.main },
    { name: 'In Progress', value: requestStats.inProgress, color: theme.palette.warning.main },
    { name: 'Completed', value: requestStats.completed, color: theme.palette.success.main },
    { name: 'Rejected', value: requestStats.rejected, color: theme.palette.error.main }
  ].filter(item => item.value > 0);

  // Format date for displaying
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get color for status chip
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'primary';
      case 'IN_REVIEW':
        return 'warning';
      case 'ACCEPTED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Handle document upload
  const handleOpenDocumentUpload = () => {
    setDocumentUploadOpen(true);
  };

  const handleCloseDocumentUpload = (success) => {
    setDocumentUploadOpen(false);
    if (success) {
      // Refresh documents after successful upload
      dispatch(fetchRecentDocuments());
    }
  };

  const handleDownloadDocument = (documentId) => {
    dispatch(downloadDocument(documentId));
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <CircularProgress color="secondary" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading your dashboard data...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Welcome Banner */}
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', opacity: 0.1 }}>
          <BusinessIcon sx={{ fontSize: 180, position: 'absolute', top: '50%', right: -20, transform: 'translateY(-50%)' }} />
        </Box>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.fullName || user?.client?.companyName || 'Client'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, maxWidth: '90%' }}>
              Manage your service requests, documents, and communications with UDDAN all in one place.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<MiscellaneousServicesIcon />}
                onClick={() => navigate('/client/services')}
                sx={{ 
                  px: 3, 
                  py: 1.2,
                  color: 'white',
                  background: theme.palette.primary.main,
                  '&:hover': {
                    background: theme.palette.primary.dark
                  }
                }}
              >
                Browse Services
              </Button>
              
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                startIcon={<RequestQuoteIcon />}
                onClick={() => navigate('/client/requests')}
                sx={{ 
                  px: 3, 
                  py: 1.2,
                  borderColor: 'white',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                View Requests
              </Button>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    color: 'text.primary',
                    borderRadius: 2,
                    width: 120,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/client/services')}
                >
                  <MiscellaneousServicesIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    <strong>{services?.length || 0}</strong>
                    <br />
                    Services
                  </Typography>
                </Paper>
                
                <Paper
                  elevation={6}
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    color: 'text.primary',
                    borderRadius: 2,
                    width: 120,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/client/requests')}
                >
                  <RequestQuoteIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    <strong>{requestStats.total}</strong>
                    <br />
                    Requests
                  </Typography>
                </Paper>
                
                <Paper
                  elevation={6}
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    color: 'text.primary',
                    borderRadius: 2,
                    width: 120,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/client/documents')}
                >
                  <DescriptionIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    <strong>{documents?.length || 0}</strong>
                    <br />
                    Documents
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Main content area - 2/3 width */}
        <Grid item xs={12} md={8}>
          {/* Service Requests Summary */}
          <Paper 
            elevation={3} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              py: 2, 
              px: 3,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RequestQuoteIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Service Requests</Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                color="inherit"
                onClick={() => navigate('/client/requests')}
                sx={{ borderColor: 'white', color: 'white' }}
              >
                View All
              </Button>
            </Box>
            
            <Box sx={{ p: 0 }}>
              {serviceRequests && serviceRequests.length > 0 ? (
                <List disablePadding>
                  {serviceRequests.slice(0, 5).map((request, index) => (
                    <React.Fragment key={request.id}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/client/requests/${request.id}`)}
                        sx={{ 
                          py: 2,
                          px: 3,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.light, 0.1)
                          }
                        }}
                      >
                        <ListItemIcon>
                          <MiscellaneousServicesIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {request.service.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                Requested on: {formatDate(request.createdAt)}
                              </Typography>
                              {request.details && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    mt: 0.5
                                  }}
                                >
                                  {request.details}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </ListItem>
                      {index < Math.min(serviceRequests.length, 5) - 1 && (
                        <Divider component="li" sx={{ ml: 9, mr: 3 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
                  <RequestQuoteIcon color="disabled" sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Service Requests Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Get started by browsing our available services and submitting your first request.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/client/services')}
                    startIcon={<MiscellaneousServicesIcon />}
                  >
                    Browse Services
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
          
          {/* Recent Documents */}
          <Paper 
            elevation={3} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              py: 2, 
              px: 3,
              bgcolor: theme.palette.info.main,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Documents</Typography>
              </Box>
              <Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="inherit"
                  onClick={handleOpenDocumentUpload}
                  sx={{ mr: 1, borderColor: 'white', color: 'white' }}
                >
                  Upload
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="inherit"
                  onClick={() => navigate('/client/documents')}
                  sx={{ borderColor: 'white', color: 'white' }}
                >
                  View All
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ p: 0 }}>
              {documents && documents.length > 0 ? (
                <List disablePadding>
                  {documents.slice(0, 3).map((document, index) => (
                    <React.Fragment key={document.id}>
                      <ListItem 
                        button 
                        sx={{ 
                          py: 2,
                          px: 3,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.info.light, 0.1)
                          }
                        }}
                      >
                        <ListItemIcon>
                          {document.fileName ? (
                            getFileIcon(document.fileName)
                          ) : (
                            <DescriptionIcon color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {document.fileName || 'Document'}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                Uploaded on: {formatDate(document.createdAt)}
                              </Typography>
                              {document.description && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    mt: 0.5
                                  }}
                                >
                                  {document.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Box>
                          <IconButton onClick={() => window.open(`/api/documents/${document.id}/view`, '_blank')}>
                            <VisibilityIcon color="info" />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < Math.min(documents.length, 3) - 1 && (
                        <Divider component="li" sx={{ ml: 9, mr: 3 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
                  <DescriptionIcon color="disabled" sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Documents Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Upload your first document to keep track of important files.
                  </Typography>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleOpenDocumentUpload}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Document
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
          
          {/* Recent Messages */}
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              py: 2, 
              px: 3,
              bgcolor: theme.palette.success.dark,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Messages</Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                color="inherit"
                onClick={() => navigate('/client/messages')}
                sx={{ borderColor: 'white', color: 'white' }}
              >
                View All
              </Button>
            </Box>
            
            <Box sx={{ p: 0 }}>
              {messages && messages.length > 0 ? (
                <List disablePadding>
                  {messages.slice(0, 3).map((message, index) => (
                    <React.Fragment key={message.id}>
                      <ListItem 
                        button 
                        onClick={() => navigate('/client/messages', { state: { selectedMessage: message.id } })}
                        sx={{ 
                          py: 2,
                          px: 3,
                          transition: 'background-color 0.2s',
                          bgcolor: !message.read ? alpha(theme.palette.success.light, 0.1) : 'transparent',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.success.light, 0.1)
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight={!message.read ? 'bold' : 'medium'}>
                                {message.senderName}
                              </Typography>
                              {!message.read && (
                                <Chip
                                  label="New"
                                  size="small"
                                  color="success"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                fontWeight={!message.read ? 'medium' : 'normal'}
                              >
                                {formatDate(message.sentAt)}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color={!message.read ? 'text.primary' : 'text.secondary'}
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  mt: 0.5,
                                  fontWeight: !message.read ? 'medium' : 'normal'
                                }}
                              >
                                {message.content}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < Math.min(messages.length, 3) - 1 && (
                        <Divider component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
                  <EmailIcon color="disabled" sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Messages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When you receive messages, they will appear here.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Sidebar area - 1/3 width */}
        <Grid item xs={12} md={4}>
          {/* Service request statistics */}
          <Paper elevation={3} sx={{ mb: 3, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DashboardIcon sx={{ mr: 1 }} color="primary" /> 
              Request Status
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            {requestStats.total > 0 ? (
              <>
                <Box sx={{ height: 200, mx: -1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} request(s)`, 'Count']} 
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Requests:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {requestStats.total}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid item xs={6}>
                    <Chip 
                      label={`Pending: ${requestStats.pending}`}
                      color="primary"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip 
                      label={`In Progress: ${requestStats.inProgress}`}
                      color="warning"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip 
                      label={`Completed: ${requestStats.completed}`}
                      color="success"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip 
                      label={`Rejected: ${requestStats.rejected}`}
                      color="error"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <RequestQuoteIcon color="disabled" sx={{ fontSize: 60, opacity: 0.4, mb: 2 }} />
                <Typography variant="body1" color="text.secondary" paragraph>
                  You haven't submitted any service requests yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/client/services')}
                >
                  Explore Services
                </Button>
              </Box>
            )}
          </Paper>
          
          {/* Recommended Services */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MiscellaneousServicesIcon sx={{ mr: 1 }} color="secondary" /> 
              Recommended Services
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            {services && services.length > 0 ? (
              <Box>
                {services.slice(0, 3).map((service, index) => (
                  <Card 
                    key={service.id} 
                    sx={{ 
                      mb: index < 2 ? 2 : 0,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    {service.imageUrl && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={service.imageUrl}
                        alt={service.title}
                      />
                    )}
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {service.title}
                      </Typography>
                      
                      {service.keywords && service.keywords.length > 0 && (
                        <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {service.keywords.slice(0, 3).map((keyword, i) => (
                            <Chip
                              key={i}
                              label={keyword}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          ))}
                          {service.keywords.length > 3 && (
                            <Chip
                              label={`+${service.keywords.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {service.description}
                      </Typography>
                      
                      {service.availability && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <CalendarTodayIcon color="action" sx={{ mr: 0.5, fontSize: 'small' }} />
                          <Typography variant="caption" color="text.secondary">
                            Availability: {service.availability}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
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
                        onClick={() => navigate('/client/services/request', { state: { serviceId: service.id } })}
                      >
                        Request
                      </Button>
                    </CardActions>
                  </Card>
                ))}
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<MoreHorizIcon />}
                    onClick={() => navigate('/client/services')}
                  >
                    See All Services
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <MiscellaneousServicesIcon color="disabled" sx={{ fontSize: 60, opacity: 0.4, mb: 2 }} />
                <Typography variant="body1" color="text.secondary" paragraph>
                  No recommended services available at the moment.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/client/services')}
                >
                  Browse All Services
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Document Upload Dialog */}
      <DocumentUploadForm
        open={documentUploadOpen}
        onClose={handleCloseDocumentUpload}
        clientId={user?.id}
      />
    </Box>
  );
};

// Helper function for document icons
const getFileIcon = (filename) => {
  if (!filename) return <DescriptionIcon />;
  
  const extension = filename.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <DescriptionIcon style={{ color: '#e53935' }} />;
    case 'doc':
    case 'docx':
      return <DescriptionIcon style={{ color: '#1565c0' }} />;
    case 'xls':
    case 'xlsx':
      return <DescriptionIcon style={{ color: '#01e8c8' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <DescriptionIcon style={{ color: '#f57c00' }} />;
    default:
      return <DescriptionIcon />;
  }
};

export default ClientDashboardPage;