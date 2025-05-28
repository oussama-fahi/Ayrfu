// src/components/public/applicants/PersonalInfoStep.jsx
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';

/**
 * Enhanced PersonalInfoStep component with gender selection
 * @param {Object} data - The personal information data object
 * @param {Function} onChange - Handler for when data changes
 * @returns {JSX.Element} The rendered component
 */
const PersonalInfoStep = ({ data, onChange }) => {
  const handleInput = (field) => (e) => {
    onChange({
      ...data,
      [field]: e.target.value
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please provide your personal details. This information will be used for your candidate profile 
        and will be visible to employers when you apply for positions.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Name, Email, Phone in first row */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField 
            fullWidth 
            label="Full Name" 
            value={data.name || ''} 
            onChange={handleInput('name')}
            required
            placeholder="John Doe"
            helperText="Your full name as it should appear on applications"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField 
            fullWidth 
            label="Email" 
            value={data.email || ''} 
            onChange={handleInput('email')}
            type="email"
            required
            placeholder="john.doe@example.com"
            helperText="Your primary contact email"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField 
            fullWidth 
            label="Phone" 
            value={data.phone || ''} 
            onChange={handleInput('phone')}
            required
            placeholder="+1 (123) 456-7890"
            helperText="Include country code if possible"
          />
        </Grid>
      </Grid>

      {/* Address and Gender in second row */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={8}>
          <TextField 
            fullWidth 
            label="Address" 
            multiline 
            rows={2} 
            value={data.address || ''} 
            onChange={handleInput('address')}
            placeholder="Your full residential address"
            helperText="This will help match you with positions in your area"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              value={data.gender || ''}
              label="Gender"
              onChange={handleInput('gender')}
            >
              <MenuItem value="">
                <em>Select gender</em>
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoStep;