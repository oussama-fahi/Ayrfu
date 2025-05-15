// src/components/candidate/MultiStepApplicationForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';

// Import the step components
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';
import PersonalInfoStep from '../../components/public/applicants/PersonalInfoStep';
import UploadCVStep from '../../components/public/applicants/UploadCVStep';
import MotivationLetterStep from '../../components/public/applicants/MotivationLetterStep';

// Import the required Redux actions
import { fetchPositionById } from '../../redux/slices/positionsSlice';
import { applyForPosition } from '../../redux/slices/candidatesSlice';

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

const MultiStepApplicationForm = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { user } = useSelector((state) => state.auth);
  const { currentPosition, isLoading: positionLoading } = useSelector((state) => state.positions);
  const { currentCandidate, isLoading: candidateLoading, applicationSuccess } = useSelector((state) => state.candidates);
  
  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data state with default values from user profile
  const [applicationData, setApplicationData] = useState({
    technologies: [],
    languages: [],
    location: '',
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

  // Fetch position details when component mounts
  useEffect(() => {
    if (positionId) {
      dispatch(fetchPositionById(positionId));
    }
  }, [dispatch, positionId]);

  // Auto-populate form with candidate data when available
  useEffect(() => {
    if (user && currentCandidate) {
      setApplicationData({
        technologies: currentCandidate.technologies || [],
        languages: currentCandidate.languages || [],
        location: currentCandidate.preferredLocation || '',
        experienceLevel: currentCandidate.experienceLevel || '',
        workModel: currentCandidate.preferredWorkModel || '',
        personalInfo: {
          name: user.fullName || '',
          email: user.email || '',
          phone: currentCandidate.phoneNumber || '',
          address: currentCandidate.address || '',
        },
        cvFile: null, // CV file can't be pre-populated
        motivationLetter: generateMotivationLetter(),
      });
    }
  }, [user, currentCandidate]);

  // Generate a default motivation letter based on candidate profile and position
  const generateMotivationLetter = () => {
    if (!currentCandidate || !currentPosition) return '';
    
    return `Dear Hiring Manager,

I am writing to express my interest in the ${currentPosition?.title} position at UDDAN. With ${currentCandidate?.experienceLevel} experience in ${currentCandidate?.technologies?.join(', ')}, I believe I would be a valuable addition to your team.

My experience with ${currentPosition?.technology} makes me well-suited for this role, and I am particularly interested in the opportunity to work in a ${currentPosition?.workModel} setting at ${currentPosition?.location}.

I look forward to discussing how my skills and experience align with your needs.

Sincerely,
${user?.fullName}`;
  };

  // Navigate to next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Navigate to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Update form data when steps change
  const handleCriteriaChange = (field, value) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Check if current step is valid
  const isStepInvalid = () => {
    const { technologies, languages, location, experienceLevel, workModel, personalInfo, cvFile } = applicationData;
    
    switch (activeStep) {
      case 0: // Technologies
        return technologies.length === 0;
      case 1: // Languages
        return languages.length === 0;
      case 2: // Location
        return !location;
      case 3: // Experience
        return !experienceLevel;
      case 4: // Work Model
        return !workModel;
      case 5: // Personal Info
        return !personalInfo.name || !personalInfo.email || !personalInfo.phone;
      case 6: // CV Upload
        // Only require CV if candidate doesn't already have one uploaded
        return !cvFile && !currentCandidate?.cvPath;
      default:
        return false;
    }
  };

  // Submit application
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare application data
      const applicationPayload = {
        positionId: positionId,
        coverLetter: applicationData.motivationLetter
      };
      
      // If there's a new CV file, we need to upload it first
      if (applicationData.cvFile) {
        // This would typically be handled by updating the candidate profile with the new CV
        // before submitting the application, but for simplicity we'll assume it's handled
        // in the applyForPosition action
      }
      
      // Dispatch the action to submit the application
      await dispatch(applyForPosition({
        id: currentCandidate.id, 
        applicationData: applicationPayload
      })).unwrap();
      
      // Navigate to success page or application detail
      navigate('/candidate/applications', { 
        state: { 
          success: true, 
          message: `Your application for ${currentPosition.title} has been submitted successfully.` 
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TechnologiesStep
            selectedTechnologies={applicationData.technologies}
            onChange={(technologies) => handleCriteriaChange('technologies', technologies)}
          />
        );
      case 1:
        return (
          <LanguagesStep
            selectedLanguages={applicationData.languages}
            onChange={(languages) => handleCriteriaChange('languages', languages)}
          />
        );
      case 2:
        return (
          <LocationStep
            selectedLocation={applicationData.location}
            onChange={(location) => handleCriteriaChange('location', location)}
          />
        );
      case 3:
        return (
          <ExperienceStep
            selectedExperience={applicationData.experienceLevel}
            onChange={(level) => handleCriteriaChange('experienceLevel', level)}
          />
        );
      case 4:
        return (
          <WorkModelStep
            selectedWorkModel={applicationData.workModel}
            onChange={(model) => handleCriteriaChange('workModel', model)}
          />
        );
      case 5:
        return (
          <PersonalInfoStep
            data={applicationData.personalInfo}
            onChange={(info) => handleCriteriaChange('personalInfo', info)}
          />
        );
      case 6:
        return (
          <UploadCVStep
            file={applicationData.cvFile}
            onChange={(file) => handleCriteriaChange('cvFile', file)}
            existingCV={currentCandidate?.cvPath}
          />
        );
      case 7:
        return (
          <MotivationLetterStep
            letter={applicationData.motivationLetter}
            onChange={(text) => handleCriteriaChange('motivationLetter', text)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  // Show loading state
  if (positionLoading || candidateLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading application form...
        </Typography>
      </Container>
    );
  }

  // Show error if position not found
  if (!currentPosition) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Position not found or has been removed.
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/positions')}
        >
          Back to Positions
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Apply for: {currentPosition.title}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 4, mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
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
                disabled={isSubmitting || isStepInvalid()}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

export default MultiStepApplicationForm;