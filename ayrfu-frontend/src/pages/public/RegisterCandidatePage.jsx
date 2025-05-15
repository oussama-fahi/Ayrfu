// src/pages/public/RegisterCandidatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

// Import Redux actions
import { register, clearError } from '../../redux/slices/authSlice';
import { createCandidate, uploadCandidateCV } from '../../redux/slices/candidatesSlice';

const RegisterCandidatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const { isLoading: authLoading, error: authError } = useSelector(state => state.auth);
  const { isLoading: candidateLoading, error: candidateError } = useSelector(state => state.candidates);
  
  const [activeStep, setActiveStep] = useState(0);
  
  // Get email, password, and name passed from regular registration if available
  const { email = '', password = '', fullName = '' } = location.state || {};
  
  // Initialize form data with values passed from previous page if available
  const [formData, setFormData] = useState({
    technologies: [],
    languages: [],
    location: null,
    experienceLevel: '',
    workModel: '',
    personalInfo: {
      name: fullName,
      email: email,
      phone: '',
      address: '',
    },
    password: password,
    dateOfBirth: '',
    gender: '',
    cvFile: null,
    motivationLetter: '',
  });

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const steps = [
    'Technologies',
    'Languages',
    'Work Location',
    'Experience',
    'Employment Type',
    'Personal Information',
    'Upload CV',
    'Motivation Letter',
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      // If on first step, go back to main registration
      navigate('/register');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Handle criteria changes from steps
  const handleCriteriaChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePersonalInfoChange = (data) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...data
      }
    }));
  };

  const isStepInvalid = () => {
    const { technologies, languages, location, experienceLevel, workModel, personalInfo } = formData;
    
    switch (activeStep) {
      case 0:
        return technologies.length === 0;
      case 1:
        return languages.length === 0;
      case 2:
        return !location;
      case 3:
        return !experienceLevel;
      case 4:
        return !workModel;
      case 5:
        // Personal info validation (email and password are already provided)
        return !personalInfo.name || !personalInfo.phone || !personalInfo.address;
      case 6:
        return false; // CV is optional
      case 7:
        return false; // Motivation letter is optional
      default:
        return false;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TechnologiesStep
            selectedTechnologies={formData.technologies}
            onChange={(technologies) => handleCriteriaChange('technologies', technologies)}
          />
        );
      case 1:
        return (
          <LanguagesStep
            selectedLanguages={formData.languages}
            onChange={(languages) => handleCriteriaChange('languages', languages)}
          />
        );
      case 2:
        return (
          <LocationStep
            selectedLocation={formData.location}
            onChange={(location) => handleCriteriaChange('location', location)}
          />
        );
      case 3:
        return (
          <ExperienceStep
            selectedExperience={formData.experienceLevel}
            onChange={(level) => handleCriteriaChange('experienceLevel', level)}
          />
        );
      case 4:
        return (
          <WorkModelStep
            selectedWorkModel={formData.workModel}
            onChange={(model) => handleCriteriaChange('workModel', model)}
          />
        );
      case 5:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onChange={handlePersonalInfoChange}
          />
        );
      case 6:
        return (
          <UploadCVStep
            file={formData.cvFile}
            onChange={(file) => handleCriteriaChange('cvFile', file)}
          />
        );
      case 7:
        return (
          <MotivationLetterStep
            letter={formData.motivationLetter}
            onChange={(text) => handleCriteriaChange('motivationLetter', text)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const handleSubmit = async () => {
    try {
      // Format data for the API
      const userData = {
        fullName: formData.personalInfo.name,
        email: formData.personalInfo.email,
        password: formData.password,
        phoneNumber: formData.personalInfo.phone,
        address: formData.personalInfo.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        technologies: formData.technologies,
        languages: formData.languages,
        experienceLevel: formData.experienceLevel,
        preferredLocation: formData.location,
        preferredWorkModel: formData.workModel,
        role: 'ROLE_CANDIDATE'
      };

      // Register the user with the candidate role
      const resultAction = await dispatch(register(userData)).unwrap();
      
      // If CV is uploaded, upload it using the candidate ID from the registration response
      if (formData.cvFile && resultAction.id) {
        await dispatch(uploadCandidateCV({
          id: resultAction.id,
          file: formData.cvFile
        }));
      }
      
      // Navigate to login with success message
      navigate('/login', { 
        state: { message: 'Registration successful! You can now log in with your credentials.' } 
      });
      
    } catch (err) {
      console.error('Registration error:', err);
      // Error handling is already managed by Redux
    }
  };

  const isLoading = authLoading || candidateLoading;
  const error = authError || candidateError;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
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
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            {activeStep === 0 ? 'Back to Registration' : 'Back'}
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
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
                disabled={isStepInvalid()}
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