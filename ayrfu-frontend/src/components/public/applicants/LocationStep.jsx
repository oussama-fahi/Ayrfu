import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PublicIcon from '@mui/icons-material/Public';
import LaptopIcon from '@mui/icons-material/Laptop';

const locations = [
  { id: 'remote', label: 'Remote', icon: <LaptopIcon fontSize="large" color="primary" /> },
  { id: 'onsite', label: 'On-site', icon: <PlaceIcon fontSize="large" color="primary" /> },
  { id: 'hybrid', label: 'Hybrid', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'europe', label: 'Europe', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'northAmerica', label: 'North America', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'southAmerica', label: 'South America', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'asia', label: 'Asia', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'africa', label: 'Africa', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'australia', label: 'Australia & Oceania', icon: <PublicIcon fontSize="large" color="primary" /> },
];

const LocationStep = ({ selectedLocation, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Select Your Preferred Location
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Choose your preferred work location. This will help us find positions that match your preferences.
      </Typography>
      
      <FormControl component="fieldset">
        <RadioGroup
          name="location"
          value={selectedLocation || ''}
          onChange={handleChange}
        >
          <Grid container spacing={2}>
            {locations.map((location) => (
              <Grid item xs={12} sm={6} md={4} key={location.id}>
                <Card 
                  variant={selectedLocation === location.id ? "outlined" : "elevation"}
                  sx={{
                    cursor: 'pointer',
                    border: selectedLocation === location.id ? '2px solid #1976d2' : 'none',
                    bgcolor: selectedLocation === location.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    height: '100%',
                  }}
                  onClick={() => onChange(location.id)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {location.icon}
                    <FormControlLabel
                      value={location.id}
                      control={<Radio />}
                      label={location.label}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default LocationStep;