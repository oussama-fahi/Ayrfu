import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  useTheme,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../hooks/useAuth';

// Step Components
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';
import PersonalInfoStep from '../../components/public/applicants/PersonalInfoStep';
import UploadCVStep from '../../components/public/applicants/UploadCVStep';
import MotivationLetterStep from '../../components/public/applicants/MotivationLetterStep';

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

const ApplicantsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { positionId } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [criteria, setCriteria] = useState({
    technologies: [],
    languages: [],
    location: null,
    experienceLevel: '',
    workModel: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    cvFile: null,
    motivationLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated on initial load
  useEffect(() => {
    // If there's a position ID, try to load the position details
    if (positionId) {
      setLoading(true);
      // Fetch position details
      fetch(`/api/positions/${positionId}`)
        .then(response => response.json())
        .then(data => {
          setPosition(data);
          // Pre-fill some criteria based on the position
          if (data.technology) {
            setCriteria(prev => ({
              ...prev,
              technologies: [data.technology]
            }));
          }
        })
        .catch(error => console.error('Error fetching position:', error))
        .finally(() => setLoading(false));
    }

    // Check authentication - redirect to login if not authenticated
    if (!isAuthenticated && positionId) {
      navigate('/login', { 
        state: { 
          from: { pathname: `/apply/${positionId}` },
          positionId: positionId
        } 
      });
    }
  }, [isAuthenticated, positionId, navigate]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCriteria({
      technologies: [],
      languages: [],
      location: null,
      experienceLevel: '',
      workModel: '',
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      cvFile: null,
      motivationLetter: '',
    });
  };

  const handleCriteriaChange = (field, value) => {
    setCriteria((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare application data
      const applicationData = {
        positionId: positionId,
        technologies: criteria.technologies,
        languages: criteria.languages,
        preferredLocation: criteria.location,
        experienceLevel: criteria.experienceLevel,
        workModel: criteria.workModel,
        motivationLetter: criteria.motivationLetter,
        // Any other fields needed
      };

      // File needs special handling with FormData
      const formData = new FormData();
      formData.append('application', JSON.stringify(applicationData));
      if (criteria.cvFile) {
        formData.append('cvFile', criteria.cvFile);
      }

      // Submit application to backend
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        // Navigate to confirmation page or dashboard
        navigate('/candidate/applications', { 
          state: { message: 'Application submitted successfully!' } 
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TechnologiesStep
            selectedTechnologies={criteria.technologies}
            onChange={(technologies) => handleCriteriaChange('technologies', technologies)}
          />
        );
      case 1:
        return (
          <LanguagesStep
            selectedLanguages={criteria.languages}
            onChange={(languages) => handleCriteriaChange('languages', languages)}
          />
        );
      case 2:
        return (
          <LocationStep
            selectedLocation={criteria.location}
            onChange={(location) => handleCriteriaChange('location', location)}
          />
        );
      case 3:
        return (
          <ExperienceStep
            selectedExperience={criteria.experienceLevel}
            onChange={(level) => handleCriteriaChange('experienceLevel', level)}
          />
        );
      case 4:
        return (
          <WorkModelStep
            selectedWorkModel={criteria.workModel}
            onChange={(model) => handleCriteriaChange('workModel', model)}
          />
        );
      case 5:
        return (
          <PersonalInfoStep
            data={criteria.personalInfo}
            onChange={(info) => handleCriteriaChange('personalInfo', info)}
          />
        );
      case 6:
        return (
          <UploadCVStep
            file={criteria.cvFile}
            onChange={(file) => handleCriteriaChange('cvFile', file)}
          />
        );
      case 7:
        return (
          <MotivationLetterStep
            letter={criteria.motivationLetter}
            onChange={(text) => handleCriteriaChange('motivationLetter', text)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const isStepInvalid = () => {
    const { technologies, languages, location, experienceLevel, workModel, personalInfo, cvFile } = criteria;
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
        return !personalInfo.name || !personalInfo.phone;
      case 6:
        return !cvFile;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading application form...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={theme.gradientTextStyle}
      >
        {position ? `Apply for ${position.title}` : 'Job Application'}
      </Typography>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>{getStepContent(activeStep)}</Box>

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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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

export default ApplicantsPage;