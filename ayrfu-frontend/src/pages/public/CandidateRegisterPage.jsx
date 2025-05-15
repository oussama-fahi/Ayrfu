import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Import your existing step components
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';
import PersonalInfoStep from '../../components/public/applicants/PersonalInfoStep';
import UploadCVStep from '../../components/public/applicants/UploadCVStep';
import MotivationLetterStep from '../../components/public/applicants/MotivationLetterStep';
import axios from 'axios'; // Use your axios instance

const RegisterCandidatePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Registration data
  const [registrationData, setRegistrationData] = useState({
    // Personal info
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    password: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional info
    technologies: [],
    languages: [],
    location: '', // preferredLocation in API
    experienceLevel: '',
    workModel: '', // preferredWorkModel in API
    
    // Additional info
    cvFile: null,
    motivationLetter: '',
  });
  
  const steps = [
    'Technologies',
    'Languages',
    'Work Location',
    'Experience',
    'Work Model',
    'Personal Information',
    'Upload CV',
    'Additional Info'
  ];
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle data changes from steps
  const handleTechnologiesChange = (technologies) => {
    setRegistrationData(prev => ({ ...prev, technologies }));
  };
  
  const handleLanguagesChange = (languages) => {
    setRegistrationData(prev => ({ ...prev, languages }));
  };
  
  const handleLocationChange = (location) => {
    setRegistrationData(prev => ({ ...prev, location }));
  };
  
  const handleExperienceChange = (experienceLevel) => {
    setRegistrationData(prev => ({ ...prev, experienceLevel }));
  };
  
  const handleWorkModelChange = (workModel) => {
    setRegistrationData(prev => ({ ...prev, workModel }));
  };
  
  const handlePersonalInfoChange = (personalInfo) => {
    setRegistrationData(prev => ({ 
      ...prev, 
      personalInfo: {
        ...prev.personalInfo,
        ...personalInfo
      } 
    }));
  };
  
  const handleCVChange = (cvFile) => {
    setRegistrationData(prev => ({ ...prev, cvFile }));
  };
  
  const handleMotivationLetterChange = (motivationLetter) => {
    setRegistrationData(prev => ({ ...prev, motivationLetter }));
  };
  
  // Password field handler (since it's not in your components)
  const handlePasswordChange = (password) => {
    setRegistrationData(prev => ({ ...prev, password }));
  };
  
  // Additional fields handler
  const handleAdditionalFieldChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({ ...prev, [name]: value }));
  };
  
  // Check if step is valid to enable Next button
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Technologies
        return registrationData.technologies.length > 0;
      case 1: // Languages
        return registrationData.languages.length > 0;
      case 2: // Location
        return registrationData.location !== '';
      case 3: // Experience
        return registrationData.experienceLevel !== '';
      case 4: // Work Model
        return registrationData.workModel !== '';
      case 5: // Personal Info
        return (
          registrationData.personalInfo.name !== '' && 
          registrationData.personalInfo.email !== '' &&
          registrationData.personalInfo.phone !== '' &&
          registrationData.personalInfo.address !== '' &&
          registrationData.password !== ''
        );
      case 6: // CV
        return true; // Optional
      case 7: // Motivation Letter
        return true; // Optional
      default:
        return false;
    }
  };
  
  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TechnologiesStep
            selectedTechnologies={registrationData.technologies}
            onChange={handleTechnologiesChange}
          />
        );
      case 1:
        return (
          <LanguagesStep
            selectedLanguages={registrationData.languages}
            onChange={handleLanguagesChange}
          />
        );
      case 2:
        return (
          <LocationStep
            selectedLocation={registrationData.location}
            onChange={handleLocationChange}
          />
        );
      case 3:
        return (
          <ExperienceStep
            selectedExperience={registrationData.experienceLevel}
            onChange={handleExperienceChange}
          />
        );
      case 4:
        return (
          <WorkModelStep
            selectedWorkModel={registrationData.workModel}
            onChange={handleWorkModelChange}
          />
        );
      case 5:
        return (
          <Box>
            <PersonalInfoStep
              data={registrationData.personalInfo}
              onChange={handlePersonalInfoChange}
            />
            {/* Add password fields since they're not in PersonalInfoStep */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Set your password
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={registrationData.password || ''}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                />
              </Box>
            </Box>
            {/* Additional fields required by API */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Additional Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={registrationData.dateOfBirth || ''}
                  onChange={handleAdditionalFieldChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  name="gender"
                  label="Gender"
                  select
                  value={registrationData.gender || ''}
                  onChange={handleAdditionalFieldChange}
                  fullWidth
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                </TextField>
              </Box>
            </Box>
          </Box>
        );
      case 6:
        return (
          <UploadCVStep
            file={registrationData.cvFile}
            onChange={handleCVChange}
          />
        );
      case 7:
        return (
          <MotivationLetterStep
            letter={registrationData.motivationLetter}
            onChange={handleMotivationLetterChange}
          />
        );
      default:
        return 'Unknown step';
    }
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Transform data to match API requirements
      const apiData = {
        fullName: registrationData.personalInfo.name,
        email: registrationData.personalInfo.email,
        password: registrationData.password,
        phoneNumber: registrationData.personalInfo.phone,
        address: registrationData.personalInfo.address,
        dateOfBirth: registrationData.dateOfBirth,
        gender: registrationData.gender,
        technologies: registrationData.technologies,
        languages: registrationData.languages,
        experienceLevel: registrationData.experienceLevel,
        preferredLocation: registrationData.location,
        preferredWorkModel: registrationData.workModel
      };
      
      // Submit form data
      const response = await axios.post('/api/auth/register/candidate', apiData);
      
      // Handle CV upload separately if needed
      if (registrationData.cvFile && response.data.id) {
        const formData = new FormData();
        formData.append('file', registrationData.cvFile);
        await axios.post(`/api/candidates/${response.data.id}/cv`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Navigate to success page or login
      navigate('/login', { 
        state: { message: 'Registration successful! You can now log in with your credentials.' } 
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Candidate Registration
      </Typography>
      
      <Paper sx={{ p: 4, mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
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
                endIcon={<ArrowForwardIcon />}
                disabled={!isStepValid()}
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

export default RegisterCandidatePage;