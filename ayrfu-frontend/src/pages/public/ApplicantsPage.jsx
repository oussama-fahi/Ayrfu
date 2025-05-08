// src/pages/public/ApplicantsPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Grid,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';

// Components
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';
import MatchingPositions from '../../components/public/applicants/MatchingPositions';

// Redux
import { fetchMatchingPositions, clearMatchingPositions } from '../../redux/slices/positionsSlice';

const steps = [
  'Technologies',
  'Languages',
  'Location',
  'Experience',
  'Work Model',
  'Matching Positions',
];

const ApplicantsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matchingPositions, isLoading } = useSelector((state) => state.positions);
  
  const [activeStep, setActiveStep] = useState(0);
  const [criteria, setCriteria] = useState({
    technologies: [],
    languages: [],
    location: null,
    experienceLevel: '',
    workModel: '',
  });
  
  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      // Last step before results, fetch matching positions
      dispatch(fetchMatchingPositions(criteria));
    }
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
    });
    dispatch(clearMatchingPositions());
  };
  
  const handleCriteriaChange = (field, value) => {
    setCriteria((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        return <MatchingPositions positions={matchingPositions} />;
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Find Your Perfect Job at UDDAN
      </Typography>
      
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
            {activeStep === steps.length - 1 && (
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ mr: 2 }}
              >
                Start Again
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === steps.length - 2 ? <SearchIcon /> : <ArrowForwardIcon />}
                disabled={
                  (activeStep === 0 && criteria.technologies.length === 0) ||
                  (activeStep === 1 && criteria.languages.length === 0) ||
                  (activeStep === 2 && !criteria.location) ||
                  (activeStep === 3 && !criteria.experienceLevel) ||
                  (activeStep === 4 && !criteria.workModel) ||
                  isLoading
                }
              >
                {activeStep === steps.length - 2 ? (
                  isLoading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Finding Positions...
                    </>
                  ) : (
                    'Find Matching Positions'
                  )
                ) : (
                  'Next'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/apply')}
              >
                Apply Now
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ApplicantsPage;