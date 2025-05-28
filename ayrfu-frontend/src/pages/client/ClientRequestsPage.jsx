import {
  Assignment as AssignmentIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
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
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
  Fade,
  Skeleton
} from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentClientServiceRequests,
  clearRequestsError,
  resetSuccess
} from '../../redux/slices/serviceRequestsSlice';

const ClientRequestsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const { requests, isLoading, error } = useSelector((state) => state.serviceRequests);
  const { user } = useSelector((state) => state.auth);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (user?.id) {
      try {
        await dispatch(getCurrentClientServiceRequests({ page: 0, size: 50 })).unwrap();
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    fetchRequests();
    
    return () => {
      dispatch(clearRequestsError());
      dispatch(resetSuccess());
    };
  }, [fetchRequests, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleViewRequest = (id) => {
    navigate(`/client/requests/${id}`);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const getFilteredRequests = () => {
    if (!requests || !Array.isArray(requests)) {
      return [];
    }

    let filtered = requests;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        request.service?.title?.toLowerCase().includes(term) ||
        request.details?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'PENDING': 'warning',
      'IN_REVIEW': 'info',
      'ACCEPTED': 'success',
      'COMPLETED': 'success',
      'REJECTED': 'error'
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'PENDING': 'Pending Review',
      'IN_REVIEW': 'In Review',
      'ACCEPTED': 'Accepted',
      'COMPLETED': 'Completed',
      'REJECTED': 'Rejected'
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRequestStats = () => {
    if (!Array.isArray(requests)) return { total: 0, pending: 0, completed: 0, inReview: 0 };
    
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      completed: requests.filter(r => r.status === 'COMPLETED').length,
      inReview: requests.filter(r => r.status === 'IN_REVIEW').length
    };
  };

  const filteredRequests = getFilteredRequests();
  const stats = getRequestStats();

  if (isLoading && !requests?.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={36} />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))}
        </Grid>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={120} />
            </Box>
          ))}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={theme.gradientTextStyle}>
          My Service Requests
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: 1,
              '&:hover': { boxShadow: 2 }
            }}
          >
            <RefreshIcon sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/client/services')}
          >
            Request New Service
          </Button>
        </Box>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearRequestsError())}>
            {error}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'warning.main', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {stats.pending}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'info.main', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {stats.inReview}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                In Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'success.main', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {stats.completed}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Filter & Search
          </Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by service name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
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
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {filteredRequests.length} of {stats.total} requests
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {isLoading && requests?.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress color="secondary" size={24} />
          <Typography sx={{ ml: 2 }}>Refreshing...</Typography>
        </Box>
      ) : null}

      {filteredRequests.length > 0 ? (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} md={6} key={request.id}>
              <Fade in timeout={300}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleViewRequest(request.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, pr: 2 }}>
                        {request.service?.title || 'Service Request'}
                      </Typography>
                      <Chip
                        label={getStatusLabel(request.status)}
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Requested on: {formatDate(request.createdAt)}
                    </Typography>

                    {request.updatedAt && request.updatedAt !== request.createdAt && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Last updated: {formatDate(request.updatedAt)}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        height: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {request.details || 'No additional details provided.'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        ID: #{request.id}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRequest(request.id);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {searchTerm || statusFilter !== 'ALL' 
              ? 'No matching requests found' 
              : 'No service requests yet'
            }
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filters'
              : "You haven't made any service requests yet. Browse our services to get started."
            }
          </Typography>
          {(searchTerm || statusFilter !== 'ALL') ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleClearSearch}>
                Clear Search
              </Button>
              <Button variant="outlined" onClick={() => setStatusFilter('ALL')}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/client/services')}
            >
              Browse Services
            </Button>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default ClientRequestsPage;