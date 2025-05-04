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
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';

const workModels = [
  { id: 'fullTime', label: 'Full-Time', icon: <AccessTimeFilledIcon fontSize="large" color="primary" /> },
  { id: 'partTime', label: 'Part-Time', icon: <AccessTimeIcon fontSize="large" color="primary" /> },
  { id: 'contract', label: 'Contract', icon: <HandshakeIcon fontSize="large" color="primary" /> },
  { id: 'freelance', label: 'Freelance', icon: <PeopleIcon fontSize="large" color="primary" /> },
  { id: 'internship', label: 'Internship', icon: <SchoolIcon fontSize="large" color="primary" /> },
];

const WorkModelStep = ({ selectedWorkModel, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Select Your Preferred Work Model
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Choose your preferred working arrangement. This will help us find positions that match your requirements.
      </Typography>
      
      <FormControl component="fieldset">
        <RadioGroup
          name="workModel"
          value={selectedWorkModel || ''}
          onChange={handleChange}
        >
          <Grid container spacing={2}>
            {workModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <Card 
                  variant={selectedWorkModel === model.id ? "outlined" : "elevation"}
                  sx={{
                    cursor: 'pointer',
                    border: selectedWorkModel === model.id ? '2px solid #1976d2' : 'none',
                    bgcolor: selectedWorkModel === model.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    height: '100%',
                  }}
                  onClick={() => onChange(model.id)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {model.icon}
                    <FormControlLabel
                      value={model.id}
                      control={<Radio />}
                      label={model.label}
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

export default WorkModelStep;