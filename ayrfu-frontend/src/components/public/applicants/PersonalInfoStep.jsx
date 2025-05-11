import { TextField, Grid, Box } from '@mui/material';

const PersonalInfoStep = ({ data, onChange }) => {
  const handleInput = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <Box>
      {/* Name, Email, Phone in a single row */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Full Name"
            value={data.name || ''}
            onChange={handleInput('name')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Email"
            value={data.email || ''}
            onChange={handleInput('email')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Phone"
            value={data.phone || ''}
            onChange={handleInput('phone')}
          />
        </Grid>
      </Grid>

      {/* Address - full width */}
      <Box mt={2}>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={2}
          value={data.address || ''}
          onChange={handleInput('address')}
        />
      </Box>
    </Box>
  );
};

export default PersonalInfoStep;