import {
    Check as CheckIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
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
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    clearRequestsError,
    deleteServiceRequest,
    getServiceRequestsByStatus,
    updateServiceRequestStatus,
} from '../../redux/slices/serviceRequestsSlice';

import AlertMessage from '../../components/common/AlertMessage';

const ServiceRequestsManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { requests, isLoading, error } = useSelector((state) => state.serviceRequests);
  
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  useEffect(() => {
    // Load initial requests filtered by PENDING status
    dispatch(getServiceRequestsByStatus({ status: statusFilter }));
    
    // Clear any error on unmount
    return () => {
      dispatch(clearRequestsError());
    };
  }, [dispatch, statusFilter]);
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    // In a real app, you might navigate to a detail page
    // navigate(`/admin/service-requests/${request.id}`);
  };
  
  const handleOpenStatusDialog = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setStatusDialogOpen(true);
  };
  
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedRequest(null);
    setNewStatus('');
  };
  
  const handleOpenDeleteDialog = (request) => {
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedRequest(null);
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedRequest || !newStatus) return;
    
    try {
      await dispatch(updateServiceRequestStatus({
        id: selectedRequest.id,
        status: newStatus
      })).unwrap();
      
      setAlertMessage(`Request status updated to ${getStatusLabel(newStatus)}`);
      setAlertSeverity('success');
      setShowAlert(true);
      handleCloseStatusDialog();
      
      // Refresh requests with the current filter
      dispatch(getServiceRequestsByStatus({ status: statusFilter }));
    } catch (error) {
      setAlertMessage('Failed to update request status');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };
  
  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      await dispatch(deleteServiceRequest(selectedRequest.id)).unwrap();
      
      setAlertMessage('Service request deleted successfully');
      setAlertSeverity('success');
      setShowAlert(true);
      handleCloseDeleteDialog();
      
      // Refresh requests with the current filter
      dispatch(getServiceRequestsByStatus({ status: statusFilter }));
    } catch (error) {
      setAlertMessage('Failed to delete service request');
      setAlertSeverity('error');
      setShowAlert(true);
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
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Service Requests Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter Requests
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_REVIEW">In Review</MenuItem>
                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {request.client ? `${request.client.name || request.client.email}` : 'Unknown Client'}
                      </TableCell>
                      <TableCell>{request.service?.title || 'Unknown Service'}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(request.status)}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="View Details">
                            <Button
                              size="small"
                              onClick={() => handleViewRequest(request)}
                              sx={{ mr: 1 }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                          
                          <Tooltip title="Update Status">
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => handleOpenStatusDialog(request)}
                              sx={{ mr: 1 }}
                            >
                              <CheckIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                          
                          <Tooltip title="Delete">
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(request)}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No {getStatusLabel(statusFilter).toLowerCase()} requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>Update Request Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status for the service request from {selectedRequest?.client?.name || 'client'}.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="new-status-label">New Status</InputLabel>
            <Select
              labelId="new-status-label"
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_REVIEW">In Review</MenuItem>
              <MenuItem value="ACCEPTED">Accepted</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteRequest}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Message */}
      <AlertMessage
        open={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
};

export default ServiceRequestsManagement;