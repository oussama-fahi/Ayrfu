// src/pages/admin/ServiceRequestDetail.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Divider, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Typography 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchServiceRequestById, updateServiceRequestStatus, deleteServiceRequest } from '../../redux/slices/serviceRequestsSlice';

const ServiceRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentServiceRequest, isLoading, error } = useSelector((state) => state.serviceRequests);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  useEffect(() => {
    if (id) {
      dispatch(fetchServiceRequestById(id));
    }
  }, [dispatch, id]);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleStatusDialogOpen = () => {
    if (currentServiceRequest) {
      setNewStatus(currentServiceRequest.status);
    }
    setStatusUpdateOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusUpdateOpen(false);
  };

  const handleStatusUpdate = async () => {
    try {
      await dispatch(updateServiceRequestStatus({ id, status: newStatus })).unwrap();
      setStatusUpdateOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteRequest = async () => {
    try {
      await dispatch(deleteServiceRequest(id)).unwrap();
      handleDeleteDialogClose();
      navigate('/admin/service-requests');
    } catch (error) {
      console.error('Failed to delete service request:', error);
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
      case 'REJECTED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading request details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/admin/service-requests')}
        >
          Back to Requests
        </Button>
      </Container>
    );
  }

  if (!currentServiceRequest) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>Service request not found.</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/admin/service-requests')}
        >
          Back to Requests
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/admin/service-requests')}
        >
          Back to Requests
        </Button>
        <Typography variant="h4">Service Request Details</Typography>
        <Chip 
          label={currentServiceRequest.status} 
          color={getStatusColor(currentServiceRequest.status)} 
          size="large" 
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <MiscellaneousServicesIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">{currentServiceRequest.service.title}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Request Details</Typography>
            <Typography variant="body1" paragraph>
              {currentServiceRequest.details || 'No additional details provided.'}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Client:</strong> {currentServiceRequest.client.fullName || currentServiceRequest.client.companyName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Requested on:</strong> {formatDate(currentServiceRequest.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                {currentServiceRequest.updatedAt && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UpdateIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Last updated:</strong> {formatDate(currentServiceRequest.updatedAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Actions</Typography>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ mb: 2 }} 
              onClick={handleStatusDialogOpen}
            >
              Update Status
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth
              startIcon={<DeleteIcon />} 
              onClick={handleDeleteDialogOpen}
            >
              Delete Request
            </Button>
          </Paper>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Client Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {currentServiceRequest.client.fullName || currentServiceRequest.client.companyName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> {currentServiceRequest.client.email}
              </Typography>
              {currentServiceRequest.client.phoneNumber && (
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {currentServiceRequest.client.phoneNumber}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateOpen} onClose={handleStatusDialogClose}>
        <DialogTitle>Update Request Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Change the status of this service request.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_REVIEW">In Review</MenuItem>
              <MenuItem value="ACCEPTED">Accepted</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteRequest} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceRequestDetail;