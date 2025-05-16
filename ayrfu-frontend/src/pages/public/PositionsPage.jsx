import {
  ArrowForward as ArrowForwardIcon,
  Code as CodeIcon,
  FilterList as FilterListIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Translate as TranslateIcon,
  Work as WorkIcon
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
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PositionsPage component - Displays all job openings
 * 
 * @returns {JSX.Element} The rendered component
 */
const PositionsPage = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    technology: '',
    experienceLevel: '',
    location: '',
    workModel: ''
  });
  
  // Fetch positions when component mounts
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/positions/active');
        setPositions(response.data);
        setFilteredPositions(response.data);
      } catch (err) {
        console.error('Error fetching positions:', err);
        setError('Failed to load job positions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPositions();
  }, []);
  
  // Update filtered positions when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, positions]);
  
  const applyFilters = () => {
    let result = [...positions];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(position => 
        position.title.toLowerCase().includes(term) ||
        position.description?.toLowerCase().includes(term) ||
        position.technology.toLowerCase().includes(term)
      );
    }
    
    // Apply specific filters
    if (filters.technology) {
      result = result.filter(position => 
        position.technology.toLowerCase() === filters.technology.toLowerCase()
      );
    }
    
    if (filters.experienceLevel) {
      result = result.filter(position => 
        position.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase()
      );
    }
    
    if (filters.location) {
      result = result.filter(position => 
        position.location.toLowerCase() === filters.location.toLowerCase()
      );
    }
    
    if (filters.workModel) {
      result = result.filter(position => 
        position.workModel.toLowerCase() === filters.workModel.toLowerCase()
      );
    }
    
    setFilteredPositions(result);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      technology: '',
      experienceLevel: '',
      location: '',
      workModel: ''
    });
  };
  
  const handleViewDetails = (positionId) => {
    navigate(`/positions/${positionId}`);
  };
  
  // Extract unique filter options
  const getFilterOptions = () => {
    const technologies = [...new Set(positions.map(p => p.technology))];
    const experienceLevels = [...new Set(positions.map(p => p.experienceLevel))];
    const locations = [...new Set(positions.map(p => p.location))];
    const workModels = [...new Set(positions.map(p => p.workModel))];
    
    return { technologies, experienceLevels, locations, workModels };
  };
  
  const filterOptions = getFilterOptions();
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading job opportunities...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Job Opportunities
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore our open positions and find your perfect career match
        </Typography>
      </Box>
      
      {/* Search and filters */}
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
          )
        }}
      />
    </Grid>
    
    {/* Filter title and clear button */}
    <Grid item xs={12} md={6}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterListIcon color="primary" />
        
        <Button 
          size="small" 
          onClick={handleClearFilters}
          sx={{ ml: 'auto' }}
        >
          Clear All
        </Button>
      </Box>
    </Grid>
    
    {/* Filter selects - using a more compact approach */}
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Technology Filter */}
        <Box sx={{ minWidth: '180px', flex: '1 1 180px' }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="tech-label" sx={{ bgcolor: 'background.paper', px: 0.5 }}>Technology</InputLabel>
            <Select
              labelId="tech-label"
              name="technology"
              value={filters.technology}
              label="Technology"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.technologies.map(tech => (
                <MenuItem key={tech} value={tech}>{tech}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Experience Filter */}
        <Box sx={{ minWidth: '180px', flex: '1 1 180px' }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="exp-label" sx={{ bgcolor: 'background.paper', px: 0.5 }}>Experience</InputLabel>
            <Select
              labelId="exp-label"
              name="experienceLevel"
              value={filters.experienceLevel}
              label="Experience"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.experienceLevels.map(exp => (
                <MenuItem key={exp} value={exp}>{exp}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Location Filter */}
        <Box sx={{ minWidth: '180px', flex: '1 1 180px' }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="loc-label" sx={{ bgcolor: 'background.paper', px: 0.5 }}>Location</InputLabel>
            <Select
              labelId="loc-label"
              name="location"
              value={filters.location}
              label="Location"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.locations.map(loc => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Work Model Filter */}
        <Box sx={{ minWidth: '180px', flex: '1 1 180px' }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="work-label" sx={{ bgcolor: 'background.paper', px: 0.5 }}>Work Model</InputLabel>
            <Select
              labelId="work-label"
              name="workModel"
              value={filters.workModel}
              label="Work Model"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.workModels.map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Grid>
  </Grid>
</Paper>
      
      {/* Results */}
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {filteredPositions.length} {filteredPositions.length === 1 ? 'Position' : 'Positions'} Found
        </Typography>
        
        {filteredPositions.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            No positions match your search criteria. Try adjusting your filters or search term.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredPositions.map(position => (
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
                            : position.description
                          }
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            Experience:
                          </Typography>
                          <Typography variant="body2">
                            {position.experienceLevel}
                          </Typography>
                        </Box>
                        
                        {position.languages && position.languages.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="subtitle2">
                              <TranslateIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                              Languages:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {position.languages.map((lang, idx) => (
                                <Chip key={idx} label={lang} size="small" variant="outlined" />
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
                          onClick={() => navigate(`/apply/${position.id}`)}
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
      </Box>
    </Container>
  );
};

export default PositionsPage;