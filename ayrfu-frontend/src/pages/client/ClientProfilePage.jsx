//src/pages/client/ClientProfilePage.js
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button, CircularProgress, Container, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, fetchCurrentClient, resetSuccess, updateCurrentClient } from '../../redux/slices/clientsSlice';

const ClientProfilePage = () => {
  const dispatch = useDispatch();
  const { currentClient, isLoading, error, success } = useSelector((state) => state.clients);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    requirements: ''
  });

  useEffect(() => {
    dispatch(fetchCurrentClient());
  }, [dispatch]);

  useEffect(() => {
    if (currentClient) {
      setFormData({
        companyName: currentClient.companyName || '',
        contactPerson: currentClient.contactPerson || '',
        email: currentClient.email || '',
        phoneNumber: currentClient.phoneNumber || '',
        industry: currentClient.industry || '',
        companySize: currentClient.companySize || '',
        requirements: currentClient.requirements || ''
      });
    }
  }, [currentClient]);

  useEffect(() => {
    if (success) {
      setEditing(false);
      setTimeout(() => {
        dispatch(resetSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCurrentClient(formData));
  };

  const handleCancel = () => {
    setEditing(false);
    if (currentClient) {
      setFormData({
        companyName: currentClient.companyName || '',
        contactPerson: currentClient.contactPerson || '',
        email: currentClient.email || '',
        phoneNumber: currentClient.phoneNumber || '',
        industry: currentClient.industry || '',
        companySize: currentClient.companySize || '',
        requirements: currentClient.requirements || ''
      });
    }
    dispatch(clearError());
  };

  if (isLoading && !currentClient) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Client Profile</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                fullWidth
                disabled={!editing || isLoading}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contactPerson"
                label="Contact Person"
                value={formData.contactPerson}
                onChange={handleInputChange}
                fullWidth
                disabled={!editing || isLoading}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                value={formData.email}
                fullWidth
                disabled={true}
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                disabled={!editing || isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="industry"
                label="Industry"
                value={formData.industry}
                onChange={handleInputChange}
                fullWidth
                disabled={!editing || isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="companySize"
                label="Company Size"
                select
                value={formData.companySize}
                onChange={handleInputChange}
                fullWidth
                disabled={!editing || isLoading}
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="requirements"
                label="Special Requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                disabled={!editing || isLoading}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editing ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => dispatch(resetSuccess())}
        message="Profile updated successfully"
      />
    </Container>
  );
};

export default ClientProfilePage;