// src/components/public/applicants/TechnologiesStep.jsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Checkbox, 
  FormControlLabel, 
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  InputAdornment, 
  IconButton, 
  Chip, 
  Box, 
  Alert,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CodeIcon from '@mui/icons-material/Code';
import { useSelector } from 'react-redux';

// This is a fallback list, but ideally should come from API
const defaultTechnologies = [
  'Java', 'Spring Boot', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js', 
  'Python', 'Django', 'Flask', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 
  'Ruby on Rails', 'Go', 'Rust', 'AWS', 'Azure', 'Google Cloud', 'Docker', 
  'Kubernetes', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'HTML', 
  'CSS', 'Sass', 'Less', 'Bootstrap', 'Material UI', 'DevOps', 'CI/CD', 
  'Jenkins', 'Git', 'Agile', 'Scrum', 'Mobile', 'Android', 'iOS', 
  'React Native', 'Flutter'
];

const TechnologiesStep = ({ selectedTechnologies = [], onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTechnologies, setAvailableTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get position data from Redux store
  const { currentPosition } = useSelector((state) => state.positions);
  
  // Initialize available technologies
  useEffect(() => {
    // If current position is available, prioritize the technology required
    // and fetch related technologies
    const fetchTechnologies = async () => {
      setLoading(true);
      try {
        // In a real application, you would fetch this from an API
        // like /api/technologies or similar
        
        // For now, we'll simulate a response
        const technologies = [...defaultTechnologies];
        
        // If there's a current position, make sure its technology is in the list
        if (currentPosition && currentPosition.technology) {
          // Remove it first to avoid duplicates
          const filteredTechs = technologies.filter(
            tech => tech.toLowerCase() !== currentPosition.technology.toLowerCase()
          );
          
          // Add it at the beginning
          setAvailableTechnologies([
            currentPosition.technology,
            ...filteredTechs
          ]);
        } else {
          setAvailableTechnologies(technologies);
        }
      } catch (error) {
        console.error('Error fetching technologies:', error);
        setAvailableTechnologies(defaultTechnologies);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechnologies();
  }, [currentPosition]);
  
  // Filter technologies based on search term
  const filteredTechnologies = availableTechnologies.filter(tech => 
    tech.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle technology selection
  const handleToggle = (technology) => {
    const newSelection = selectedTechnologies.includes(technology)
      ? selectedTechnologies.filter(t => t !== technology)
      : [...selectedTechnologies, technology];
    
    onChange(newSelection);
  };
  
  // Handle search change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Group technologies by category
  const getTechnologyCategory = (tech) => {
    const frontendTechs = ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript', 'Sass', 'Less', 'Bootstrap', 'Material UI'];
    const backendTechs = ['Java', 'Spring Boot', 'Node.js', 'Python', 'Django', 'Flask', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust'];
    const dbTechs = ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis'];
    const cloudTechs = ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'];
    const mobileTechs = ['Mobile', 'Android', 'iOS', 'React Native', 'Flutter'];
    
    if (frontendTechs.includes(tech)) return 'Frontend';
    if (backendTechs.includes(tech)) return 'Backend';
    if (dbTechs.includes(tech)) return 'Database';
    if (cloudTechs.includes(tech)) return 'Cloud & DevOps';
    if (mobileTechs.includes(tech)) return 'Mobile';
    return 'Other';
  };
  
  // If position has a specific technology, highlight it
  const isRequiredTechnology = (tech) => {
    return currentPosition && 
      currentPosition.technology && 
      tech.toLowerCase() === currentPosition.technology.toLowerCase();
  };
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Select Technologies You're Experienced With
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Choose all the technologies you have experience with. This will help us find the most relevant positions for you.
      </Typography>
      
      {currentPosition && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            This position requires <strong>{currentPosition.technology}</strong> experience. Make sure to select it if you have experience with this technology.
          </Typography>
        </Alert>
      )}
      
      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel htmlFor="tech-search">Search Technologies</InputLabel>
        <OutlinedInput
          id="tech-search"
          value={searchTerm}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  aria-label="clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }
          label="Search Technologies"
        />
      </FormControl>
      
      {selectedTechnologies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Technologies:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedTechnologies.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                onDelete={() => handleToggle(tech)}
                color={isRequiredTechnology(tech) ? "error" : "primary"}
                icon={<CodeIcon />}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Group technologies by category for better organization */}
          {['Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'Mobile', 'Other'].map(category => {
            const techsInCategory = filteredTechnologies.filter(
              tech => getTechnologyCategory(tech) === category
            );
            
            if (techsInCategory.length === 0) return null;
            
            return (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  pb: 1
                }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {techsInCategory.map((technology) => (
                    <Grid item xs={12} sm={6} md={4} key={technology}>
                      <Card 
                        variant={selectedTechnologies.includes(technology) ? "outlined" : "elevation"}
                        sx={{
                          cursor: 'pointer',
                          border: selectedTechnologies.includes(technology) 
                            ? '2px solid #1976d2' 
                            : isRequiredTechnology(technology)
                              ? '2px dashed #f44336'
                              : 'none',
                          bgcolor: selectedTechnologies.includes(technology) 
                            ? 'rgba(25, 118, 210, 0.08)' 
                            : isRequiredTechnology(technology)
                              ? 'rgba(244, 67, 54, 0.08)'
                              : 'inherit',
                        }}
                        onClick={() => handleToggle(technology)}
                      >
                        <CardContent>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedTechnologies.includes(technology)}
                                onChange={() => handleToggle(technology)}
                                color={isRequiredTechnology(technology) ? "error" : "primary"}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {technology}
                                {isRequiredTechnology(technology) && (
                                  <Chip 
                                    label="Required" 
                                    size="small" 
                                    color="error" 
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
          
          {filteredTechnologies.length === 0 && (
            <Typography 
              variant="body1" 
              color="text.secondary" 
              align="center" 
              sx={{ mt: 4 }}
            >
              No technologies found matching your search. Try a different term.
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export default TechnologiesStep;