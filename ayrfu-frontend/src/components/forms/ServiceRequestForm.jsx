// src/components/forms/ServiceRequestForm.js
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createServiceRequest } from '../../redux/slices/serviceRequestsSlice';

const ServiceRequestForm = ({ serviceId, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, error } = useSelector((state) => state.serviceRequests);
  const { currentService } = useSelector((state) => state.services);
  
  const [formData, setFormData] = useState({
    serviceId: serviceId || '',
    details: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.serviceId) {
      errors.serviceId = 'Service is required';
    }
    
    if (!formData.details.trim()) {
      errors.details = 'Please provide details about your request';
    } else if (formData.details.length > 2000) {
      errors.details = 'Details must be less than 2000 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(createServiceRequest(formData)).unwrap();
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/client/requests');
      }
    } catch (err) {
      console.error('Error submitting service request:', err);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Request Service
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {currentService && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            {currentService.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentService.description}
          </Typography>
        </Box>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="details"
              label="Request Details"
              multiline
              rows={6}
              fullWidth
              required
              value={formData.details}
              onChange={handleChange}
              error={!!formErrors.details}
              helperText={formErrors.details || 'Please describe what you need in detail. Include any specific requirements or questions.'}
              disabled={isLoading}
            />
            <FormHelperText>
              {`${formData.details.length}/2000 characters`}
            </FormHelperText>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ServiceRequestForm;