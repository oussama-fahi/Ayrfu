import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { getCandidateApplications } from '../../redux/slices/candidatesSlice';

const CandidateApplicationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { applications, isLoading, error } = useSelector((state) => state.candidates);
  const { user } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Fetch applications on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getCandidateApplications(user.id));
    }
  }, [dispatch, user]);
  
  // Display notification if redirected from another page with a message
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        open: true,
        message: location.state.message,
        severity: location.state.type || 'info',
      });
      
      // Clear the state to prevent showing the notification on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle sort by change
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Toggle sort direction
  const handleSortDirectionToggle = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Navigate to application details
  const handleViewApplication = (applicationId) => {
    navigate(`/candidate/applications/${applicationId}`);
  };
  
  // Handle closing notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
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
  
  // Filter applications based on search and status filter
  const filteredApplications = applications.filter(app => {
    // Filter by search query
    if (searchQuery && !app.position.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !app.position.technology.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !app.position.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (statusFilter && app.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let valueA, valueB;
    
    // Sort by different fields
    switch (sortBy) {
      case 'appliedAt':
        valueA = new Date(a.appliedAt);
        valueB = new Date(b.appliedAt);
        break;
      case 'updatedAt':
        valueA = new Date(a.updatedAt);
        valueB = new Date(b.updatedAt);
        break;
      case 'position.title':
        valueA = a.position.title;
        valueB = b.position.title;
        break;
      case 'position.company':
        valueA = a.position.company || '';
        valueB = b.position.company || '';
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      default:
        valueA = new Date(a.appliedAt);
        valueB = new Date(b.appliedAt);
    }
    
    // Apply sort direction
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading applications...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Applications</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/positions')}
        >
          Browse Job Opportunities
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by position, company, location..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Filter by status"
              >
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="REVIEWING">In Review</MenuItem>
                <MenuItem value="INTERVIEW">Interview</MenuItem>
                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                label="Sort by"
              >
                <MenuItem value="appliedAt">Application Date</MenuItem>
                <MenuItem value="updatedAt">Last Update</MenuItem>
                <MenuItem value="position.title">Position Title</MenuItem>
                <MenuItem value="position.company">Company</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSortDirectionToggle}
              startIcon={<FilterListIcon />}
              sx={{ height: '56px' }}
            >
              {sortDirection === 'asc' ? 'ASC' : 'DESC'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {applications.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">You have no applications yet</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Start applying for positions to track your job applications.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/positions')}
          >
            Browse Job Opportunities
          </Button>
        </Paper>
      ) : sortedApplications.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No applications match your search</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria or filters.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List sx={{ width: '100%' }}>
            {sortedApplications.map((application, index) => (
              <React.Fragment key={application.id}>
                <ListItem 
                  alignItems="flex-start" 
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="view" 
                      onClick={() => handleViewApplication(application.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" component="span">
                          {application.position.title}
                        </Typography>
                        <Chip 
                          label={getStatusLabel(application.status)} 
                          color={getStatusColor(application.status)} 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Company:</strong> {application.position.company || 'UDDAN'}
                          </Typography>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Location:</strong> {application.position.location}
                          </Typography>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Type:</strong> {application.position.workModel}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Application submitted on:</strong> {formatDate(application.appliedAt)}
                          </Typography>
                          {application.updatedAt && (
                            <Typography variant="body2" component="span" display="block">
                              <strong>Last updated:</strong> {formatDate(application.updatedAt)}
                            </Typography>
                          )}
                          {application.interviewDate && (
                            <Typography variant="body2" component="span" display="block">
                              <strong>Interview date:</strong> {formatDate(application.interviewDate)}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                </ListItem>
                {index < sortedApplications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CandidateApplicationsPage;