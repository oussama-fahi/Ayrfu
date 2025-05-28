import CheckIcon from '@mui/icons-material/Check';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { createServiceRequest, resetSuccess } from '../../redux/slices/serviceRequestsSlice';
import { fetchServiceById } from '../../redux/slices/servicesSlice';

const ClientServiceRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: '',
    details: '',
  });
  
  const { services, currentService, isLoading: servicesLoading } = useSelector((state) => state.services);
  const { isLoading: requestLoading, error, success } = useSelector((state) => state.serviceRequests);
  
  const steps = ['Select Service', 'Request Details', 'Confirmation'];
  
  useEffect(() => {
    // If a serviceId is passed via navigation state, pre-select it
    if (location.state?.serviceId) {
      setFormData(prev => ({
        ...prev,
        serviceId: location.state.serviceId
      }));
      dispatch(fetchServiceById(location.state.serviceId));
      setActiveStep(1); // Move directly to details step
    }
    
    // Clear success state on mount
    return () => {
      dispatch(resetSuccess());
    };
  }, [location, dispatch]);
  
  useEffect(() => {
    // Update selected service when currentService changes
    if (currentService) {
      setSelectedService(currentService);
    }
  }, [currentService]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If service changes, load its details
    if (name === 'serviceId' && value) {
      dispatch(fetchServiceById(value));
    }
  };
  
  // Navigate to next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Navigate to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    dispatch(createServiceRequest(formData));
  };
  
  // Check if next button should be disabled
  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !formData.serviceId;
    } else if (activeStep === 1) {
      return !formData.details;
    }
    return false;
  };
  
  // Redirect to request detail on successful submission
  useEffect(() => {
    if (success) {
      navigate('/client/requests');
    }
  }, [success, navigate]);
  
  // Render content based on current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Service selection step
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select the service you'd like to request
            </Typography>
            
            <TextField
              select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              label="Service"
              fullWidth
              sx={{ mb: 3 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </TextField>
            
            {selectedService && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{selectedService.title}</Typography>
                  
                  {selectedService.keywords && selectedService.keywords.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {selectedService.keywords.map((keyword, index) => (
                        <Chip 
                          key={index} 
                          label={keyword} 
                          size="small" 
                          color="secondary" 
                          variant="outlined" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedService.description}
                  </Typography>
                  
                  {selectedService.availability && (
                    <Typography variant="subtitle1" color="primary">
                      Availability: {selectedService.availability}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        );
        
      case 1: // Request details step
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Request Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="details"
                  label="Description of your request"
                  multiline
                  rows={4}
                  value={formData.details}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  placeholder="Please describe in detail what you need..."
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 2: // Confirmation step
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your request
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Service:</Typography>
                  <Typography variant="body1">{selectedService?.title}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Details:</Typography>
                  <Typography variant="body1" paragraph>{formData.details}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                By submitting this request, you agree to be contacted by our team to discuss the details and next steps.
              </Typography>
            </Alert>
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  if (servicesLoading && activeStep === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading available services...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Service Request</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack}
              startIcon={<NavigateBeforeIcon />}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleSubmit}
                endIcon={requestLoading ? <CircularProgress size={20} /> : <CheckIcon />}
                disabled={requestLoading}
              >
                {requestLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
                disabled={isNextDisabled()}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClientServiceRequestPage;