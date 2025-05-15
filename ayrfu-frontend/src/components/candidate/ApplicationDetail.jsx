import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { fetchApplicationById, withdrawApplication, updateApplication } from '../../redux/slices/candidatesSlice';
import { sendApplicationMessage } from '../../redux/slices/messagesSlice';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  
  const { currentApplication, isLoading, error } = useSelector((state) => state.candidates);
  const { sendingMessage } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  
  const [newMessage, setNewMessage] = useState('');
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  
  // Fetch application details on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
  }, [dispatch, id]);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentApplication?.messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    dispatch(sendApplicationMessage({
      applicationId: id,
      content: newMessage,
    }));
    
    setNewMessage('');
  };
  
  // Handle opening withdraw dialog
  const handleOpenWithdrawDialog = () => {
    setWithdrawDialog(true);
  };
  
  // Handle closing withdraw dialog
  const handleCloseWithdrawDialog = () => {
    setWithdrawDialog(false);
  };
  
  // Handle withdrawing application
  const handleWithdrawApplication = () => {
    dispatch(withdrawApplication(id));
    handleCloseWithdrawDialog();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'REVIEWING':
        return 'In Review';
      case 'INTERVIEW':
        return 'Interview';
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      case 'WITHDRAWN':
        return 'Withdrawn';
      default:
        return status;
    }
  };
  
  // Get status color
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
  
  // Application process steps
  const steps = ['Application Submitted', 'Application Review', 'Interview', 'Decision'];
  
  // Get active step based on status
  const getActiveStep = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'REVIEWING':
        return 1;
      case 'INTERVIEW':
        return 2;
      case 'ACCEPTED':
      case 'REJECTED':
      case 'WITHDRAWN':
        return 3;
      default:
        return 0;
    }
  };
  
  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading application details...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/candidate/applications')}>
          Return to Applications
        </Button>
      </Container>
    );
  }
  
  if (!currentApplication) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>Application not found.</Alert>
        <Button variant="contained" onClick={() => navigate('/candidate/applications')}>
          Return to Applications
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Application Details</Typography>
        <Chip 
          label={getStatusLabel(currentApplication.status)} 
          color={getStatusColor(currentApplication.status)} 
          size="large" 
        />
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{currentApplication.position.title}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{currentApplication.position.company || 'UDDAN'}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{currentApplication.position.location}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{currentApplication.position.workModel}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Application submitted on {formatDate(currentApplication.appliedAt)}
              </Typography>
            </Box>
            
            {currentApplication.interviewDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Interview scheduled for {formatDate(currentApplication.interviewDate)}
                </Typography>
              </Box>
            )}
            
            {currentApplication.status === 'ACCEPTED' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body1" color="success.main">
                  Application accepted on {formatDate(currentApplication.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {currentApplication.status === 'REJECTED' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body1" color="error.main">
                  Application rejected on {formatDate(currentApplication.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {currentApplication.status === 'WITHDRAWN' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Application withdrawn on {formatDate(currentApplication.updatedAt)}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stepper activeStep={getActiveStep(currentApplication.status)} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {currentApplication.notes && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Notes:</Typography>
                <Typography variant="body2">{currentApplication.notes}</Typography>
              </Paper>
            )}
            
            {currentApplication.status === 'PENDING' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleOpenWithdrawDialog}
                >
                  Withdraw Application
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>Cover Letter</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {currentApplication.coverLetter}
        </Typography>
      </Paper>
      
      <Typography variant="h5" gutterBottom>Messages</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ height: '300px', overflow: 'auto', mb: 3 }}>
          {currentApplication.messages && currentApplication.messages.length > 0 ? (
            <List>
              {currentApplication.messages.map((message) => (
                <ListItem key={message.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: message.senderId === user.id ? 'primary.main' : 'secondary.main' 
                      }}
                    >
                      {message.sender.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{message.sender.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(message.sentAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        component="span" 
                        variant="body2" 
                        color="text.primary" 
                        sx={{ display: 'inline', mt: 1 }}
                      >
                        {message.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">No messages yet.</Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            label="Your message"
            multiline
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={currentApplication.status === 'WITHDRAWN'}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendingMessage || currentApplication.status === 'WITHDRAWN'}
            sx={{ height: '56px' }}
          >
            {sendingMessage ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/candidate/applications')}
        >
          Return to Applications
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(`/positions/${currentApplication.position.id}`)}
        >
          View Job Listing
        </Button>
      </Box>
      
      {/* Withdraw confirmation dialog */}
      <Dialog
        open={withdrawDialog}
        onClose={handleCloseWithdrawDialog}
      >
        <DialogTitle>Confirm Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw your application for the position of {currentApplication.position.title}? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog}>Cancel</Button>
          <Button onClick={handleWithdrawApplication} color="error">
            Withdraw Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationDetail;