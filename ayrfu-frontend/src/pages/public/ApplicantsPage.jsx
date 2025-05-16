// src/pages/public/ApplicantsPage.js
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Step Components
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import MotivationLetterStep from '../../components/public/applicants/MotivationLetterStep';
import PersonalInfoStep from '../../components/public/applicants/PersonalInfoStep';
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import UploadCVStep from '../../components/public/applicants/UploadCVStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';

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

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate submission logic (e.g., API call)
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/apply/confirmation');
    }, 2000);
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
      case 0: return technologies.length === 0;
      case 1: return languages.length === 0;
      case 2: return !location;
      case 3: return !experienceLevel;
      case 4: return !workModel;
      case 5: return !personalInfo.name || !personalInfo.phone;
      case 6: return !cvFile;
      default: return false;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={theme.gradientTextStyle}
      >
        Job Application
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
