import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
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
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useAuth } from '../../hooks/useAuth';
import candidateService from '../../api/services/candidate.service';

const CandidateApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const response = await candidateService.getApplicationById(id);
      setApplication(response.data);
      setError(null);
    } catch (err) {
      console.error('Error while fetching application details:', err);
      setError('Unable to load application details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    
    setSendingMessage(true);
    try {
      let response;
      
      if (file) {
        // Send message with attachment
        response = await candidateService.addApplicationMessageWithAttachment(id, newMessage, file);
      } else {
        // Send message without attachment
        response = await candidateService.addApplicationMessage(id, newMessage);
      }
      
      // Update application messages
      setApplication({
        ...application,
        messages: [...application.messages, response.data]
      });
      
      // Clear inputs
      setNewMessage('');
      setFile(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error sending message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleOpenWithdrawDialog = () => {
    setWithdrawDialog(true);
  };

  const handleCloseWithdrawDialog = () => {
    setWithdrawDialog(false);
  };

  const handleWithdrawApplication = async () => {
    try {
      const response = await candidateService.withdrawApplication(id);
      setApplication({
        ...application,
        status: 'WITHDRAWN'
      });
      handleCloseWithdrawDialog();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      setError('Error withdrawing application. Please try again.');
      handleCloseWithdrawDialog();
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'REVIEWING': return 'In Review';
      case 'INTERVIEW': return 'Interview';
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      case 'WITHDRAWN': return 'Withdrawn';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'primary';
      case 'REVIEWING': return 'secondary';
      case 'INTERVIEW': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'WITHDRAWN': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Steps for progress stepper
  const steps = ['Application submitted', 'Under review', 'Interview', 'Decision'];
  
  const getActiveStep = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'REVIEWING': return 1;
      case 'INTERVIEW': return 2;
      case 'ACCEPTED':
      case 'REJECTED':
      case 'WITHDRAWN': return 3;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/candidate/applications')}
        >
          Return to my applications
        </Button>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>Application not found.</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/candidate/applications')}
        >
          Return to my applications
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Application Details</Typography>
        <Chip 
          label={getStatusLabel(application.status)} 
          color={getStatusColor(application.status)}
          size="large"
        />
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{application.position.title}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {application.position.company || 'Company not specified'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{application.position.location}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">{application.position.workModel}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Application submitted on {formatDate(application.appliedAt)}
              </Typography>
            </Box>
            
            {application.interviewDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Interview scheduled for {formatDate(application.interviewDate)}
                </Typography>
              </Box>
            )}
            
            {application.status === 'ACCEPTED' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body1" color="success.main">
                  Application accepted on {formatDate(application.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {application.status === 'REJECTED' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body1" color="error.main">
                  Application rejected on {formatDate(application.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {application.status === 'WITHDRAWN' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Application withdrawn on {formatDate(application.updatedAt)}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stepper 
              activeStep={getActiveStep(application.status)} 
              alternativeLabel
              sx={{ mb: 4 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {application.notes && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Notes:</Typography>
                <Typography variant="body2">{application.notes}</Typography>
              </Paper>
            )}
            
            {application.status === 'PENDING' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleOpenWithdrawDialog}
                >
                  Withdraw my application
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>Messages</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ height: '300px', overflow: 'auto', mb: 3 }}>
          {application.messages && application.messages.length > 0 ? (
            <List>
              {application.messages.map((message) => (
                <ListItem key={message.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: message.sender.id === user.id ? 'primary.main' : 'secondary.main' }}>
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
                      <>
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.primary"
                          sx={{ display: 'inline', mt: 1 }}
                        >
                          {message.content}
                        </Typography>
                        
                        {message.attachmentUrl && (
                          <Box 
                            component="a"
                            href={message.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              display: 'block', 
                              mt: 1,
                              p: 1,
                              bgcolor: 'background.default',
                              borderRadius: 1,
                              textDecoration: 'none',
                              color: 'inherit'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {message.attachmentName || 'Attachment'}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">No messages yet.</Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {file && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 1, 
            mb: 2, 
            bgcolor: 'background.default',
            borderRadius: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{file.name}</Typography>
            </Box>
            <Button size="small" color="error" onClick={handleRemoveFile}>Remove</Button>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            label="Your message"
            multiline
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={application.status === 'WITHDRAWN' || sendingMessage}
            sx={{ mr: 2 }}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              disabled={application.status === 'WITHDRAWN' || sendingMessage}
            >
              Attach File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && !file) || sendingMessage || application.status === 'WITHDRAWN'}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/candidate/applications')}
        >
          Return to my applications
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/positions/${application.position.id}`)}
        >
          View job posting
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
            Are you sure you want to withdraw your application for the position of {application.position.title}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog}>Cancel</Button>
          <Button onClick={handleWithdrawApplication} color="error">
            Withdraw my application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CandidateApplicationDetailPage;