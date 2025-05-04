import React from 'react';
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
  Chip,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const languages = [
  'English', 'French', 'Spanish', 'German', 'Italian', 
  'Portuguese', 'Dutch', 'Swedish', 'Norwegian', 'Danish',
  'Finnish', 'Russian', 'Polish', 'Czech', 'Slovak',
  'Hungarian', 'Romanian', 'Bulgarian', 'Greek', 'Turkish',
  'Arabic', 'Hebrew', 'Hindi', 'Urdu', 'Persian',
  'Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese',
];

const LanguagesStep = ({ selectedLanguages = [], onChange }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredLanguages = languages.filter(lang =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggle = (language) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onChange(newSelection);
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Select Languages You Speak
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Choose all the languages you can communicate in. Language skills are important for many positions.
      </Typography>
      
      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel htmlFor="lang-search">Search Languages</InputLabel>
        <OutlinedInput
          id="lang-search"
          value={searchTerm}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          label="Search Languages"
        />
      </FormControl>
      
      {selectedLanguages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Languages:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedLanguages.map((lang) => (
              <Chip
                key={lang}
                label={lang}
                onDelete={() => handleToggle(lang)}
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}
      
      <Grid container spacing={2}>
        {filteredLanguages.map((language) => (
          <Grid item xs={12} sm={6} md={4} key={language}>
            <Card 
              variant={selectedLanguages.includes(language) ? "outlined" : "elevation"}
              sx={{
                cursor: 'pointer',
                border: selectedLanguages.includes(language) ? '2px solid #1976d2' : 'none',
                bgcolor: selectedLanguages.includes(language) ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
              }}
              onClick={() => handleToggle(language)}
            >
              <CardContent>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedLanguages.includes(language)}
                      onChange={() => handleToggle(language)}
                      color="primary"
                    />
                  }
                  label={language}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredLanguages.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No languages found matching your search. Try a different term.
        </Typography>
      )}
    </div>
  );
};

export default LanguagesStep;