import { Assignment as AssignmentIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getCurrentClientServiceRequests } from '../../redux/slices/serviceRequestsSlice';

const ClientRequestsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { requests, isLoading, error } = useSelector((state) => state.serviceRequests);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  useEffect(() => {
    dispatch(getCurrentClientServiceRequests({}));
  }, [dispatch]);
  
  const handleViewRequest = (id) => {
    navigate(`/client/requests/${id}`);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const getFilteredRequests = () => {
    if (statusFilter === 'ALL') {
      return requests;
    }
    return requests.filter(request => request.status === statusFilter);
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
  
  const filteredRequests = getFilteredRequests();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Service Requests</Typography>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate('/client/services')}
        >
          Request New Service
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Filter Requests</Typography>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="ALL">All Requests</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_REVIEW">In Review</MenuItem>
              <MenuItem value="ACCEPTED">Accepted</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : filteredRequests.length > 0 ? (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} md={6} key={request.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">
                      {request.service?.title || 'Service Request'}
                    </Typography>
                    
                    <Chip 
                      label={getStatusLabel(request.status)} 
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Requested on: {formatDate(request.createdAt)}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" sx={{ mb: 2, height: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {request.details}
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => handleViewRequest(request.id)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No service requests found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {statusFilter !== 'ALL' 
              ? `You don't have any ${getStatusLabel(statusFilter).toLowerCase()} requests.` 
              : "You haven't made any service requests yet."}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => navigate('/client/services')} 
            sx={{ mt: 3 }}
          >
            Browse Services
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default ClientRequestsPage;