import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const technologies = [
  'Java', 'Spring Boot', 'JavaScript', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Python', 'Django', 'Flask', 'C#', '.NET',
  'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'HTML', 'CSS', 'Sass', 'Less', 'Bootstrap', 'Material UI',
  'DevOps', 'CI/CD', 'Jenkins', 'Git', 'Agile', 'Scrum',
  'Mobile', 'Android', 'iOS', 'React Native', 'Flutter',
];

const TechnologiesStep = ({ selectedTechnologies = [], onChange }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredTechnologies = technologies.filter(tech =>
    tech.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggle = (technology) => {
    const newSelection = selectedTechnologies.includes(technology)
      ? selectedTechnologies.filter(t => t !== technology)
      : [...selectedTechnologies, technology];
    onChange(newSelection);
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Select Technologies You're Experienced With
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Choose all the technologies you have experience with. This will help us find the most relevant positions for you.
      </Typography>
      
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
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}
      
      <Grid container spacing={2}>
        {filteredTechnologies.map((technology) => (
          <Grid item xs={12} sm={6} md={4} key={technology}>
            <Card 
              variant={selectedTechnologies.includes(technology) ? "outlined" : "elevation"}
              sx={{
                cursor: 'pointer',
                border: selectedTechnologies.includes(technology) ? '2px solid #1976d2' : 'none',
                bgcolor: selectedTechnologies.includes(technology) ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
              }}
              onClick={() => handleToggle(technology)}
            >
              <CardContent>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTechnologies.includes(technology)}
                      onChange={() => handleToggle(technology)}
                      color="primary"
                    />
                  }
                  label={technology}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredTechnologies.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No technologies found matching your search. Try a different term.
        </Typography>
      )}
    </>
  );
};

export default TechnologiesStep;
