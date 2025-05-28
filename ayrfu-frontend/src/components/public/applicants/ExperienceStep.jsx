import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SchoolIcon from '@mui/icons-material/School';
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

const experienceLevels = [
  { id: 'entry', label: 'Entry Level (0-2 years)', icon: <SchoolIcon fontSize="large" color="primary" /> },
  { id: 'junior', label: 'Junior (2-3 years)', icon: <WorkIcon fontSize="large" color="primary" /> },
  { id: 'mid', label: 'Mid-Level (3-5 years)', icon: <EngineeringIcon fontSize="large" color="primary" /> },
  { id: 'senior', label: 'Senior (5-8 years)', icon: <AccountTreeIcon fontSize="large" color="primary" /> },
  { id: 'lead', label: 'Lead/Principal (8+ years)', icon: <ArchitectureIcon fontSize="large" color="primary" /> },
];

const ExperienceStep = ({ selectedExperience, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Select Your Experience Level
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Choose your current level of professional experience. This helps us match you with appropriate roles.
      </Typography>
      
      <FormControl component="fieldset">
        <RadioGroup
          name="experience"
          value={selectedExperience || ''}
          onChange={handleChange}
        >
          <Grid container spacing={2}>
            {experienceLevels.map((level) => (
              <Grid item xs={12} sm={6} key={level.id}>
                <Card 
                  variant={selectedExperience === level.id ? "outlined" : "elevation"}
                  sx={{
                    cursor: 'pointer',
                    border: selectedExperience === level.id ? '2px solid #1976d2' : 'none',
                    bgcolor: selectedExperience === level.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    height: '100%',
                  }}
                  onClick={() => onChange(level.id)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {level.icon}
                    <FormControlLabel
                      value={level.id}
                      control={<Radio />}
                      label={level.label}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default ExperienceStep;