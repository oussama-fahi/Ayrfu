import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon,
  IconButton as IconButton
} from '@mui/icons-material';
import {
  getCandidateApplications,
  withdrawApplication,
  clearError
} from '../../redux/slices/candidatesSlice';

const CandidateApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { applications, isLoading, error, success } = useSelector((state) => state.candidates);
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for withdrawal dialog
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState(null);
  
  // Load candidate applications
  useEffect(() => {
    if (user?.id) {
      dispatch(getCandidateApplications(user.id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, user, success]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle sort field change
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Toggle sort direction
  const handleToggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // View application details
  const handleViewApplication = (applicationId) => {
    navigate(`/candidate/applications/${applicationId}`);
  };
  
  // Open withdraw dialog
  const handleOpenWithdrawDialog = (application) => {
    setApplicationToWithdraw(application);
    setWithdrawDialogOpen(true);
  };
  
  // Close withdraw dialog
  const handleCloseWithdrawDialog = () => {
    setWithdrawDialogOpen(false);
    setApplicationToWithdraw(null);
  };
  
  // Withdraw application
  const handleWithdrawApplication = () => {
    if (applicationToWithdraw && user?.id) {
      dispatch(withdrawApplication({
        candidateId: user.id,
        applicationId: applicationToWithdraw.id
      }));
      handleCloseWithdrawDialog();
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status label for display
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'REVIEWING':
        return 'Under Review';
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
  
  // Get status color for chip
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
  
  // Filter and sort applications
  const getFilteredApplications = () => {
    let filtered = [...applications];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.position.title.toLowerCase().includes(term) ||
        app.position.company?.toLowerCase().includes(term) ||
        app.position.location.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      // Get values to compare based on sortBy
      switch (sortBy) {
        case 'appliedAt':
          aValue = new Date(a.appliedAt).getTime();
          bValue = new Date(b.appliedAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt || a.appliedAt).getTime();
          bValue = new Date(b.updatedAt || b.appliedAt).getTime();
          break;
        case 'position.title':
          aValue = a.position.title.toLowerCase();
          bValue = b.position.title.toLowerCase();
          break;
        case 'position.company':
          aValue = (a.position.company || '').toLowerCase();
          bValue = (b.position.company || '').toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      // Apply sort direction
      return sortDirection === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
    
    return filtered;
  };
  
  const filteredApplications = getFilteredApplications();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Applications
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/positions')}
        >
          Browse Job Positions
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters and Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by position, company, location..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
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
                <MenuItem value="REVIEWING">Under Review</MenuItem>
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
              onClick={handleToggleSortDirection}
              startIcon={<FilterListIcon />}
              sx={{ height: '56px' }}
            >
              {sortDirection === 'asc' ? 'ASC' : 'DESC'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Applications List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredApplications.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {application.position.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {application.position.workModel}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    {application.position.company || 'Not specified'}
                  </TableCell>
                  
                  <TableCell>
                    {application.position.location}
                  </TableCell>
                  
                  <TableCell>
                    {formatDate(application.appliedAt)}
                    {application.updatedAt && application.updatedAt !== application.appliedAt && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Updated: {formatDate(application.updatedAt)}
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusLabel(application.status)}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewApplication(application.id)}
                        >
                          View
                        </Button>
                      </Tooltip>
                      
                      {application.status === 'PENDING' && (
                        <Tooltip title="Withdraw Application">
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleOpenWithdrawDialog(application)}
                          >
                            Withdraw
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No applications found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchTerm || statusFilter
              ? 'Try modifying your search criteria or filters'
              : 'You haven\'t submitted any job applications yet'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/positions')}
          >
            Browse Job Positions
          </Button>
        </Paper>
      )}
      
      {/* Withdraw Application Dialog */}
      <Dialog
        open={withdrawDialogOpen}
        onClose={handleCloseWithdrawDialog}
      >
        <DialogTitle>Confirm Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw your application for{' '}
            <strong>{applicationToWithdraw?.position.title}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleWithdrawApplication}
            color="error"
            variant="contained"
          >
            Withdraw Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CandidateApplications;