import LaptopIcon from '@mui/icons-material/Laptop';
import PublicIcon from '@mui/icons-material/Public';
import WorkIcon from '@mui/icons-material/Work';
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';


const locations = [
  { id: 'remote', label: 'Remote', icon: <PublicIcon fontSize="large" color="primary" /> },
  { id: 'onsite', label: 'On-site', icon: <WorkIcon fontSize="large" color="primary" /> },
  { id: 'hybrid', label: 'Hybrid', icon: <LaptopIcon fontSize="large" color="primary" /> },
];

const LocationStep = ({ selectedLocation, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Select Your Preferred Work Location
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