import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Code as CodeIcon,
  Work as WorkIcon,
  Translate as TranslateIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { fetchActivePositions, fetchMatchingPositions } from '../../redux/slices/positionsSlice';

const PositionsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { positions, isLoading, error } = useSelector((state) => state.positions);
  const { user } = useSelector((state) => state.auth);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    technology: '',
    experienceLevel: '',
    location: '',
    workModel: '',
    language: '',
  });
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter options (we'll extract these from the positions data)
  const [filterOptions, setFilterOptions] = useState({
    technologies: [],
    experienceLevels: [],
    locations: [],
    workModels: [],
    languages: [],
  });
  
  // Load positions on component mount
  useEffect(() => {
    dispatch(fetchActivePositions({ page: 0, size: 100 }));
  }, [dispatch]);
  
  // Extract filter options from the positions data
  useEffect(() => {
    if (positions && positions.length > 0) {
      const technologies = [...new Set(positions.map(p => p.technology))];
      const experienceLevels = [...new Set(positions.map(p => p.experienceLevel))];
      const locations = [...new Set(positions.map(p => p.location))];
      const workModels = [...new Set(positions.map(p => p.workModel))];
      
      // Extract unique languages from all positions
      const languages = [...new Set(
        positions
          .flatMap(p => p.languages || [])
          .filter(Boolean)
      )];
      
      setFilterOptions({
        technologies,
        experienceLevels,
        locations,
        workModels,
        languages,
      });
    }
  }, [positions]);
  
  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page on filter change
  };
  
  // Handle search submission
  const handleSearch = () => {
    // Only include non-empty filter values
    const searchCriteria = Object.entries(filters)
      .reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      
    // Add search term to criteria if present
    if (searchTerm.trim()) {
      searchCriteria.query = searchTerm.trim();
    }
    
    // If we have search criteria, dispatch search action
    if (Object.keys(searchCriteria).length > 0) {
      dispatch(fetchMatchingPositions(searchCriteria));
    } else {
      // Otherwise, load all positions
      dispatch(fetchActivePositions());
    }
  };
  
  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      technology: '',
      experienceLevel: '',
      location: '',
      workModel: '',
      language: '',
    });
    dispatch(fetchActivePositions());
  };
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Navigate to position details
  const handleViewDetails = (id) => {
    navigate(`/positions/${id}`);
  };
  
  // Navigate to application form
  const handleApply = (id) => {
    navigate(`/apply/${id}`);
  };
  
  // Apply client-side filtering for search term if needed
  // (In a real app, this would be handled by the server)
  const filteredPositions = positions.filter(position => {
    if (searchTerm && !position.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !position.technology.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !position.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  // Calculate pagination
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPositions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Job Opportunities
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore our open positions and find your perfect career match
        </Typography>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search positions..."
              variant="outlined"
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
          
          {/* Action buttons */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
          </Grid>
          
          {/* Filter selects */}
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Technology</InputLabel>
              <Select
                name="technology"
                value={filters.technology}
                onChange={handleFilterChange}
                label="Technology"
              >
                <MenuItem value="">All Technologies</MenuItem>
                {filterOptions.technologies.map(tech => (
                  <MenuItem key={tech} value={tech}>{tech}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Experience</InputLabel>
              <Select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                label="Experience"
              >
                <MenuItem value="">All Levels</MenuItem>
                {filterOptions.experienceLevels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Location</InputLabel>
              <Select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                {filterOptions.locations.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Work Model</InputLabel>
              <Select
                name="workModel"
                value={filters.workModel}
                onChange={handleFilterChange}
                label="Work Model"
              >
                <MenuItem value="">All Models</MenuItem>
                {filterOptions.workModels.map(model => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                label="Language"
              >
                <MenuItem value="">All Languages</MenuItem>
                {filterOptions.languages.map(language => (
                  <MenuItem key={language} value={language}>{language}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results */}
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {filteredPositions.length} {filteredPositions.length === 1 ? 'Position' : 'Positions'} Found
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : filteredPositions.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            No positions match your search criteria. Try adjusting your filters or search term.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {currentItems.map(position => (
              <Grid item xs={12} key={position.id}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                          {position.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            icon={<CodeIcon />} 
                            label={position.technology} 
                            size="small" 
                            color="primary" 
                          />
                          <Chip 
                            icon={<LocationIcon />} 
                            label={position.location} 
                            size="small" 
                          />
                          <Chip 
                            icon={<WorkIcon />} 
                            label={position.workModel} 
                            size="small" 
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {position.description && position.description.length > 200
                            ? `${position.description.substring(0, 200)}...`
                            : position.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">Experience:</Typography>
                          <Typography variant="body2">{position.experienceLevel}</Typography>
                        </Box>
                        
                        {position.languages && position.languages.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="subtitle2">
                              <TranslateIcon 
                                fontSize="small" 
                                sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} 
                              />
                              Languages:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {position.languages.map((lang, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={lang} 
                                  size="small" 
                                  variant="outlined" 
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={4} sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: { xs: 'flex-start', md: 'flex-end' }, 
                        mt: { xs: 2, md: 0 } 
                      }}>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={() => handleViewDetails(position.id)} 
                          endIcon={<ArrowForwardIcon />} 
                          sx={{ mb: 2 }}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleApply(position.id)}
                        >
                          Apply Now
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large" 
              showFirstButton 
              showLastButton 
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PositionsList;