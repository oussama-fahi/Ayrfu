// src/pages/admin/PositionManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { fetchAllPositions, deletePosition, togglePositionStatus } from '../../redux/slices/positionsSlice';
import AlertMessage from '../../components/common/AlertMessage';

const PositionManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { positions, isLoading, error } = useSelector((state) => state.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    status: 'all', // 'all', 'active', 'inactive'
    experienceLevel: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get unique experience levels for filter
  const experienceLevels = ['', ...new Set(positions.map(p => p.experienceLevel))];

  useEffect(() => {
    dispatch(fetchAllPositions());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [positions, searchTerm, filterOptions]);

  const applyFilters = () => {
    let filtered = [...positions];

    // Apply status filter
    if (filterOptions.status === 'active') {
      filtered = filtered.filter(position => position.active);
    } else if (filterOptions.status === 'inactive') {
      filtered = filtered.filter(position => !position.active);
    }

    // Apply experience level filter
    if (filterOptions.experienceLevel) {
      filtered = filtered.filter(position => position.experienceLevel === filterOptions.experienceLevel);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(position => 
        position.title.toLowerCase().includes(term) || 
        position.technology.toLowerCase().includes(term) || 
        position.location.toLowerCase().includes(term)
      );
    }
    
    setFilteredPositions(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.value,
    });
  };

  const handleMenuOpen = (event, position) => {
    setAnchorEl(event.currentTarget);
    setSelectedPosition(position);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (selectedPosition) {
      navigate(`/admin/positions/edit/${selectedPosition.id}`);
    }
  };

  const handleToggleStatus = () => {
    handleMenuClose();
    if (selectedPosition) {
      dispatch(togglePositionStatus({
        id: selectedPosition.id,
        active: selectedPosition.active
      })).then(() => {
        setSuccessMessage(`Position ${selectedPosition.active ? 'deactivated' : 'activated'} successfully!`);
        setShowSuccessAlert(true);
      });
    }
  };

  const handleDeleteDialogOpen = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedPosition) {
      dispatch(deletePosition(selectedPosition.id)).then(() => {
        setSuccessMessage('Position deleted successfully!');
        setShowSuccessAlert(true);
        handleDeleteDialogClose();
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Position Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/admin/positions/create')}
        >
          Add New Position
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search positions..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: '200px' }}
          />
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              name="status"
              value={filterOptions.status}
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="experience-filter-label">Experience</InputLabel>
            <Select
              labelId="experience-filter-label"
              name="experienceLevel"
              value={filterOptions.experienceLevel}
              label="Experience"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {experienceLevels.filter(level => level).map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Technology</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Work Model</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPositions.length > 0 ? (
                  filteredPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>{position.title}</TableCell>
                      <TableCell>{position.technology}</TableCell>
                      <TableCell>{position.location}</TableCell>
                      <TableCell>{position.experienceLevel}</TableCell>
                      <TableCell>{position.workModel}</TableCell>
                      <TableCell>
                        <Chip 
                          label={position.active ? "Active" : "Inactive"} 
                          color={position.active ? "success" : "default"} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleMenuOpen(e, position)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No positions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Position actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedPosition?.active ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{selectedPosition?.active ? 'Deactivate' : 'Activate'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteDialogOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the position "{selectedPosition?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <AlertMessage
        open={showSuccessAlert}
        message={successMessage}
        severity="success"
        onClose={() => setShowSuccessAlert(false)}
      />
    </Box>
  );
};

export default PositionManagement;