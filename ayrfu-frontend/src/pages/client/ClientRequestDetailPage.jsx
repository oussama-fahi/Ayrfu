import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { AssignmentTurnedIn as AssignmentIcon, Schedule as ScheduleIcon } from '@mui/icons-material';

import { getServiceRequestById, deleteServiceRequest } from '../../redux/slices/serviceRequestsSlice';

const ClientRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentRequest, isLoading, error } = useSelector((state) => state.serviceRequests);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(getServiceRequestById(id));
    }
  }, [dispatch, id]);
  
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteRequest = async () => {
    try {
      await dispatch(deleteServiceRequest(id)).unwrap();
      navigate('/client/requests');
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'primary';
      case 'IN_REVIEW':
        return 'secondary';
      case 'ACCEPTED':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_REVIEW':
        return 'In Review';
      case 'ACCEPTED':
        return 'Accepted';
      case 'COMPLETED':
        return 'Completed';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Steps for progress
  const steps = ['Request Received', 'In Review', 'Completed'];
  
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'IN_REVIEW':
        return 1;
      case 'ACCEPTED':
      case 'COMPLETED':
        return 2;
      case 'REJECTED':
        return 3; // Rejected is a special case, not shown in stepper
      default:
        return 0;
    }
  };
  
  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading details...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate('/client/requests')}
        >
          Return to Requests
        </Button>
      </Container>
    );
  }
  
  if (!currentRequest) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Request not found.
        </Alert>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate('/client/requests')}
        >
          Return to Requests
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Service Request Details</Typography>
        <Chip 
          label={getStatusLabel(currentRequest.status)} 
          color={getStatusColor(currentRequest.status)}
        />
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {currentRequest.service?.title || 'Service Request'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Requested on: {formatDate(currentRequest.createdAt)}
              </Typography>
            </Box>
            
            {currentRequest.updatedAt && currentRequest.updatedAt !== currentRequest.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Last updated: {formatDate(currentRequest.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {currentRequest.service?.id && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Service: {currentRequest.service.title}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stepper 
              activeStep={getStepIndex(currentRequest.status)} 
              alternativeLabel
              sx={{ mb: 4 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Request Details
            </Typography>
            <Typography variant="body1">
              {currentRequest.details}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => navigate('/client/requests')}
        >
          Back to Requests
        </Button>
        
        {currentRequest.status === 'PENDING' && (
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleDeleteDialogOpen}
          >
            Cancel Request
          </Button>
        )}
      </Box>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this service request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Go Back</Button>
          <Button 
            onClick={handleDeleteRequest} 
            color="error"
          >
            Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientRequestDetailPage;