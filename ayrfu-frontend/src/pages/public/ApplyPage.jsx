import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const steps = ['Personal Information', 'Resume Upload', 'Additional Details'];

const ApplyPage = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // For demo, use a mock position
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(positionId ? true : false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    cvFile: null,
    coverLetter: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    if (positionId) {
      // Simulate fetching position
      setTimeout(() => {
        setPosition({
          id: positionId,
          title: "Senior Java Developer",
          technology: "Java",
        });
        setLoading(false);
      }, 1000);
    }
  }, [positionId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData({
        ...formData,
        cvFile: file
      });
      
      // Clear file error if present
      if (errors.cvFile) {
        setErrors({
          ...errors,
          cvFile: null
        });
      }
    }
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;
    
    if (step === 0) {
      // Validate personal information
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      }
    } else if (step === 1) {
      // Validate resume upload
      if (!formData.cvFile) {
        newErrors.cvFile = 'Resume/CV is required';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all steps before submission
    const isPersonalInfoValid = validateStep(0);
    const isResumeValid = validateStep(1);
    
    if (isPersonalInfoValid && isResumeValid) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 2000);
    } else {
      // If validation fails, go to the first invalid step
      if (!isPersonalInfoValid) {
        setActiveStep(0);
      } else if (!isResumeValid) {
        setActiveStep(1);
      }
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="fullName"
                label="Full Name"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleInputChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                required
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Please upload your resume/CV. Supported formats: PDF, DOCX, DOC.
            </Typography>
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Resume/CV
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            
            {formData.cvFile && (
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                File selected: {formData.cvFile.name}
              </Typography>
            )}
            
            {errors.cvFile && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                {errors.cvFile}
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Add any additional information you would like us to know about your application.
            </Typography>
            
            <TextField
              name="coverLetter"
              label="Cover Letter / Additional Information"
              fullWidth
              multiline
              rows={6}
              value={formData.coverLetter}
              onChange={handleInputChange}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading application form...
        </Typography>
      </Container>
    );
  }
  
  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Application Submitted!
          </Typography>
          
          <Alert severity="success" sx={{ my: 3 }}>
            Your application has been successfully submitted. We'll review it and get back to you soon.
          </Alert>
          
          <Typography variant="body1" paragraph>
            Thank you for your interest in joining UDDAN. We appreciate the time you took to apply for this position.
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Job Application
        </Typography>
        
        {position && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="subtitle1">
              Position: <strong>{position.title}</strong>
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ mb: 4 }} />
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ApplyPage;