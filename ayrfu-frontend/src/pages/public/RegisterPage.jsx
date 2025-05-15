// src/pages/public/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HowToRegIcon from '@mui/icons-material/HowToReg';

// Steps for Candidate Registration
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';
import PersonalInfoStep from '../../components/public/applicants/PersonalInfoStep';

// Redux action
import { 
  registerCandidate, 
  registerClient, 
  clearRegistrationState 
} from '../../redux/slices/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, user, registrationSuccess } = useSelector((state) => state.auth);

  // Role selection and step management
  const [userRole, setUserRole] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  
  // Client registration form data
  const [clientFormData, setClientFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    requirements: ''
  });
  
  // Candidate registration form data
  const [candidateFormData, setCandidateFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    technologies: [],
    languages: [],
    experienceLevel: '',
    preferredLocation: '',
    preferredWorkModel: '',
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Clear registration state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearRegistrationState());
    };
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.roles.includes('ROLE_CANDIDATE')) {
        navigate('/candidate/dashboard');
      } else if (user.roles.includes('ROLE_CLIENT')) {
        navigate('/client/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Redirect after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      const message = "Registration successful! Please check your email to verify your account.";
      navigate('/login', { state: { message } });
    }
  }, [registrationSuccess, navigate]);

  // Step definitions for candidate
  const candidateSteps = [
    'Role Selection',
    'Personal Information',
    'Technologies',
    'Languages',
    'Experience',
    'Location',
    'Work Preferences',
  ];

  // Handle role selection
  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
    setActiveStep(1); // Move to the next step after role selection
  };

  // Handle client form changes
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle candidate form changes for basic fields
  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    setCandidateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle specialized candidate form data
  const handleCandidateFieldUpdate = (field, value) => {
    setCandidateFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle next step
  const handleNext = () => {
    if (userRole === 'ROLE_CANDIDATE') {
      if (validateCandidateStep(activeStep)) {
        const newCompleted = { ...completed };
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else if (activeStep === 1) {
      // For clients, we only have the registration form after role selection
      handleSubmit();
    }
  };

  // Handle back to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Validate current step for candidate
  const validateCandidateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      // Validate personal information
      if (!candidateFormData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
      
      if (!candidateFormData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(candidateFormData.email)) {
        errors.email = 'Email is invalid';
      }
      
      if (!candidateFormData.password) {
        errors.password = 'Password is required';
      } else if (candidateFormData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!candidateFormData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (candidateFormData.password !== candidateFormData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (!candidateFormData.phoneNumber?.trim()) {
        errors.phoneNumber = 'Phone number is required';
      }
      
      if (!candidateFormData.address?.trim()) {
        errors.address = 'Address is required';
      }
    } else if (step === 2) {
      // Validate technologies
      if (candidateFormData.technologies.length === 0) {
        errors.technologies = 'Please select at least one technology';
      }
    } else if (step === 3) {
      // Validate languages
      if (candidateFormData.languages.length === 0) {
        errors.languages = 'Please select at least one language';
      }
    } else if (step === 4) {
      // Validate experience level
      if (!candidateFormData.experienceLevel) {
        errors.experienceLevel = 'Please select your experience level';
      }
    } else if (step === 5) {
      // Validate location preference
      if (!candidateFormData.preferredLocation) {
        errors.preferredLocation = 'Please select your preferred location';
      }
    } else if (step === 6) {
      // Validate work model
      if (!candidateFormData.preferredWorkModel) {
        errors.preferredWorkModel = 'Please select your preferred work model';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate client form
  const validateClientForm = () => {
    const errors = {};
    
    if (!clientFormData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!clientFormData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }
    
    if (!clientFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(clientFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!clientFormData.password) {
      errors.password = 'Password is required';
    } else if (clientFormData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!clientFormData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (clientFormData.password !== clientFormData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!clientFormData.phoneNumber?.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Final form submission
  const handleSubmit = () => {
    if (userRole === 'ROLE_CANDIDATE') {
      if (validateCandidateStep(activeStep)) {
        // Add gender if not specified
        const candidateData = {
          ...candidateFormData,
          gender: candidateFormData.gender || 'Not specified'
        };
        
        // Format date if needed
        if (candidateData.dateOfBirth) {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(candidateData.dateOfBirth);
          candidateData.dateOfBirth = date.toISOString().split('T')[0];
        }
        
        // Remove confirmPassword before submission
        const { confirmPassword, ...submissionData } = candidateData;
        
        // Dispatch candidate registration action
        dispatch(registerCandidate(submissionData));
      }
    } else if (userRole === 'ROLE_CLIENT') {
      if (validateClientForm()) {
        // Remove confirmPassword before submission
        const { confirmPassword, ...submissionData } = clientFormData;
        
        // Dispatch client registration action with correct structure
        dispatch(registerClient(submissionData));
      }
    }
  };

  // Render content for current step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Choose your account type
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              width: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {/* Candidate Side - Left */}
              <Box 
                sx={{ 
                  width: { xs: '100%', sm: '50%' },
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: userRole === 'ROLE_CANDIDATE' ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                  borderRight: { xs: 'none', sm: '1px solid' },
                  borderBottom: { xs: '1px solid', sm: 'none' },
                  borderColor: 'divider',
                }}
                onClick={() => setUserRole('ROLE_CANDIDATE')}
              >
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Candidate</Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  I'm looking for job opportunities and want to apply for positions
                </Typography>
                <RadioGroup value={userRole} onChange={handleRoleChange}>
                  <FormControlLabel 
                    value="ROLE_CANDIDATE" 
                    control={<Radio />} 
                    label="Register as Candidate" 
                  />
                </RadioGroup>
              </Box>
              
              {/* Client Side - Right */}
              <Box 
                sx={{ 
                  width: { xs: '100%', sm: '50%' },
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: userRole === 'ROLE_CLIENT' ? 'rgba(1, 232, 200, 0.04)' : 'transparent',
                }}
                onClick={() => setUserRole('ROLE_CLIENT')}
              >
                <BusinessIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Client</Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  I'm a business looking to use services or hire talent
                </Typography>
                <RadioGroup value={userRole} onChange={handleRoleChange}>
                  <FormControlLabel 
                    value="ROLE_CLIENT" 
                    control={<Radio />} 
                    label="Register as Client" 
                  />
                </RadioGroup>
              </Box>
            </Box>
          </Box>
        );
      case 1:
        if (userRole === 'ROLE_CANDIDATE') {
          return (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    required
                    value={candidateFormData.fullName}
                    onChange={handleCandidateChange}
                    error={!!formErrors.fullName}
                    helperText={formErrors.fullName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    required
                    type="email"
                    value={candidateFormData.email}
                    onChange={handleCandidateChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    required
                    value={candidateFormData.phoneNumber}
                    onChange={handleCandidateChange}
                    error={!!formErrors.phoneNumber}
                    helperText={formErrors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    required
                    value={candidateFormData.address}
                    onChange={handleCandidateChange}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={candidateFormData.dateOfBirth}
                    onChange={handleCandidateChange}
                    error={!!formErrors.dateOfBirth}
                    helperText={formErrors.dateOfBirth}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="gender"
                    label="Gender"
                    select
                    fullWidth
                    value={candidateFormData.gender}
                    onChange={handleCandidateChange}
                    error={!!formErrors.gender}
                    helperText={formErrors.gender || "Optional"}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=""></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={candidateFormData.password}
                    onChange={handleCandidateChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    value={candidateFormData.confirmPassword}
                    onChange={handleCandidateChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        } else {
          return (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="companyName"
                    label="Company Name"
                    fullWidth
                    required
                    value={clientFormData.companyName}
                    onChange={handleClientChange}
                    error={!!formErrors.companyName}
                    helperText={formErrors.companyName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="contactPerson"
                    label="Contact Person"
                    fullWidth
                    required
                    value={clientFormData.contactPerson}
                    onChange={handleClientChange}
                    error={!!formErrors.contactPerson}
                    helperText={formErrors.contactPerson}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    required
                    type="email"
                    value={clientFormData.email}
                    onChange={handleClientChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    required
                    value={clientFormData.phoneNumber}
                    onChange={handleClientChange}
                    error={!!formErrors.phoneNumber}
                    helperText={formErrors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="industry"
                    label="Industry"
                    fullWidth
                    value={clientFormData.industry}
                    onChange={handleClientChange}
                    error={!!formErrors.industry}
                    helperText={formErrors.industry}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="companySize"
                    label="Company Size"
                    select
                    fullWidth
                    value={clientFormData.companySize}
                    onChange={handleClientChange}
                    error={!!formErrors.companySize}
                    helperText={formErrors.companySize}
                    SelectProps={{
                      native: true,
                    }}
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
                    label="Special Requirements (Optional)"
                    multiline
                    rows={3}
                    fullWidth
                    value={clientFormData.requirements}
                    onChange={handleClientChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={clientFormData.password}
                    onChange={handleClientChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    value={clientFormData.confirmPassword}
                    onChange={handleClientChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        }
      case 2:
        return (
          <TechnologiesStep 
            selectedTechnologies={candidateFormData.technologies} 
            onChange={(technologies) => handleCandidateFieldUpdate('technologies', technologies)}
          />
        );
      case 3:
        return (
          <LanguagesStep 
            selectedLanguages={candidateFormData.languages} 
            onChange={(languages) => handleCandidateFieldUpdate('languages', languages)}
          />
        );
      case 4:
        return (
          <ExperienceStep 
            selectedExperience={candidateFormData.experienceLevel} 
            onChange={(level) => handleCandidateFieldUpdate('experienceLevel', level)}
          />
        );
      case 5:
        return (
          <LocationStep 
            selectedLocation={candidateFormData.preferredLocation} 
            onChange={(location) => handleCandidateFieldUpdate('preferredLocation', location)}
          />
        );
      case 6:
        return (
          <WorkModelStep 
            selectedWorkModel={candidateFormData.preferredWorkModel} 
            onChange={(model) => handleCandidateFieldUpdate('preferredWorkModel', model)}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ width: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
          <HowToRegIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Join UDDAN - Register as a candidate or client
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          {/* Stepper for steps (only show for candidate registration after role selection) */}
          {(userRole === 'ROLE_CANDIDATE' && activeStep > 0) && (
            <Stepper activeStep={activeStep - 1} alternativeLabel sx={{ width: '100%', mb: 4, mt: 2 }}>
              {candidateSteps.slice(1).map((label, index) => (
                <Step key={label} completed={completed[index + 1]}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* Form content based on current step */}
          {getStepContent(activeStep)}

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, width: '100%' }}>
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  disabled={!userRole}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              ) : (
                userRole === 'ROLE_CLIENT' || activeStep === candidateSteps.length - 1 ? (
                  <Button
                    variant="contained"
                    color={userRole === 'ROLE_CANDIDATE' ? 'primary' : 'secondary'}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )
              )}
            </Box>
          </Box>

          <Divider sx={{ width: '100%', my: 3 }} />
            
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;