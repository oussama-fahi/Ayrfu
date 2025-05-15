// src/pages/candidate/JobApplicationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material';

// Import components
import TechnologiesStep from '../../components/public/applicants/TechnologiesStep';
import LanguagesStep from '../../components/public/applicants/LanguagesStep';
import LocationStep from '../../components/public/applicants/LocationStep';
import ExperienceStep from '../../components/public/applicants/ExperienceStep';
import WorkModelStep from '../../components/public/applicants/WorkModelStep';
import PersonalInfoStep from '../../components/public/applicants/PersonalInfoStep';

// Import Redux actions and selectors
import { 
  fetchCandidateProfile, 
  createOrUpdateProfile, 
  applyForPosition,
  updateProfileField,
  selectCandidateProfile,
  selectProfileCompleteness,
  selectCandidateLoading,
  selectCandidateSubmitting,
  selectCandidateError
} from '../../redux/slices/candidatesSlice';

import {
  fetchPositionById,
  selectCurrentPosition,
  selectPositionsLoading
} from '../../redux/slices/positionsSlice';

const steps = [
  'Review Profile',
  'Position Details',
  'Motivation Letter',
  'Confirmation'
];

const JobApplicationPage = () => {
  const { id: positionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const candidateProfile = useSelector(selectCandidateProfile);
  const profileComplete = useSelector(selectProfileCompleteness);
  const isLoading = useSelector(selectCandidateLoading);
  const isPositionLoading = useSelector(selectPositionsLoading);
  const isSubmitting = useSelector(selectCandidateSubmitting);
  const error = useSelector(selectCandidateError);
  const position = useSelector(selectCurrentPosition);
  
  // Local state
  const [activeStep, setActiveStep] = useState(0);
  const [motivationLetter, setMotivationLetter] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  
  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchCandidateProfile());
    dispatch(fetchPositionById(positionId));
  }, [dispatch, positionId]);
  
  const handleNext = () => {
    // If profile is incomplete, don't allow proceeding past first step
    if (activeStep === 0 && !profileComplete && !editMode) {
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async () => {
    dispatch(applyForPosition({ 
      positionId, 
      motivationLetter 
    })).then((resultAction) => {
      if (applyForPosition.fulfilled.match(resultAction)) {
        navigate('/candidate/application-success', {
          state: { 
            message: 'Your application has been submitted successfully!',
            positionTitle: position?.title
          }
        });
      }
    });
  };
  
  const handleEditProfile = () => {
    setEditMode(true);
  };
  
  const handleSaveProfile = () => {
    const profileData = {
      ...candidateProfile
    };
    
    // Add CV file if a new one was selected
    if (cvFile) {
      profileData.cvFile = cvFile;
    }
    
    dispatch(createOrUpdateProfile(profileData))
      .then((resultAction) => {
        if (createOrUpdateProfile.fulfilled.match(resultAction)) {
          setEditMode(false);
        }
      });
  };
  
  // Handle updating a field in the candidate profile
  const handleProfileChange = (field, value) => {
    dispatch(updateProfileField({ field, value }));
  };
  
  // Handle updating personal info from the PersonalInfoStep component
  const handlePersonalInfoChange = (data) => {
    if (data.name !== candidateProfile?.fullName) {
      handleProfileChange('fullName', data.name);
    }
    
    if (data.phone !== candidateProfile?.phoneNumber) {
      handleProfileChange('phoneNumber', data.phone);
    }
    
    if (data.address !== candidateProfile?.address) {
      handleProfileChange('address', data.address);
    }
    
    if (data.gender !== candidateProfile?.gender) {
      handleProfileChange('gender', data.gender);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Review Profile
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Candidate Profile
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {editMode ? (
              // Edit mode - show profile edit forms
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <PersonalInfoStep 
                    data={{
                      name: candidateProfile?.fullName || '',
                      email: candidateProfile?.email || '',
                      phone: candidateProfile?.phoneNumber || '',
                      address: candidateProfile?.address || '',
                      gender: candidateProfile?.gender || ''
                    }}
                    onChange={handlePersonalInfoChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Experience Level
                  </Typography>
                  <ExperienceStep
                    selectedExperience={candidateProfile?.experienceLevel}
                    onChange={(value) => handleProfileChange('experienceLevel', value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Technologies
                  </Typography>
                  <TechnologiesStep
                    selectedTechnologies={candidateProfile?.technologies || []}
                    onChange={(value) => handleProfileChange('technologies', value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Languages
                  </Typography>
                  <LanguagesStep
                    selectedLanguages={candidateProfile?.languages || []}
                    onChange={(value) => handleProfileChange('languages', value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Preferred Location
                  </Typography>
                  <LocationStep
                    selectedLocation={candidateProfile?.preferredLocation}
                    onChange={(value) => handleProfileChange('preferredLocation', value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Work Model
                  </Typography>
                  <WorkModelStep
                    selectedWorkModel={candidateProfile?.preferredWorkModel}
                    onChange={(value) => handleProfileChange('preferredWorkModel', value)}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    CV/Resume
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {candidateProfile?.cvPath ? (
                      <Typography>
                        Current CV: {candidateProfile.cvPath}
                      </Typography>
                    ) : (
                      <Typography color="error">
                        No CV uploaded yet
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                  >
                    {candidateProfile?.cvPath ? 'Replace CV' : 'Upload CV'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCvFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                  {cvFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {cvFile.name}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      sx={{ mr: 2 }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Saving...
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              // View mode - show profile details
              <>
                {!profileComplete && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Your profile is incomplete. Please edit your profile to complete all required information.
                  </Alert>
                )}
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Personal Information
                        </Typography>
                        <Typography variant="body1">
                          <strong>Name:</strong> {candidateProfile?.fullName || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Email:</strong> {candidateProfile?.email || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Phone:</strong> {candidateProfile?.phoneNumber || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Gender:</strong> {candidateProfile?.gender || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Address:</strong> {candidateProfile?.address || 'Not provided'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Professional Profile
                        </Typography>
                        <Typography variant="body1">
                          <strong>Experience Level:</strong> {candidateProfile?.experienceLevel || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Preferred Location:</strong> {candidateProfile?.preferredLocation || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Work Model:</strong> {candidateProfile?.preferredWorkModel || 'Not provided'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>CV/Resume:</strong> {candidateProfile?.cvPath ? 'Uploaded' : 'Not uploaded'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Skills & Languages
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Technologies:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {candidateProfile?.technologies?.length > 0 ? (
                            candidateProfile.technologies.map((tech, index) => (
                              <Chip key={index} label={tech} />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No technologies specified
                            </Typography>
                          )}
                        </Box>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Languages:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {candidateProfile?.languages?.length > 0 ? (
                            candidateProfile.languages.map((lang, index) => (
                              <Chip key={index} label={lang} />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No languages specified
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </>
            )}
          </Box>
        );
      
      case 1: // Position Details
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Position Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {position?.title}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={position?.technology} />
                  <Chip label={position?.location} />
                  <Chip label={position?.workModel} />
                  <Chip label={`Experience: ${position?.experienceLevel}`} />
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Job Description:
                </Typography>
                <Typography variant="body1" paragraph>
                  {position?.description || 'No description provided'}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Required Languages:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {position?.languages?.map((lang, index) => (
                    <Chip key={index} label={lang} />
                  ))}
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Your Profile Match
                  </Typography>
                  
                  {candidateProfile?.technologies?.some(tech => 
                    position?.technology?.toLowerCase().includes(tech.toLowerCase())
                  ) ? (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      Your technological skills match this position's requirements.
                    </Alert>
                  ) : (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      Your technological skills may not fully match this position.
                    </Alert>
                  )}
                  
                  {candidateProfile?.experienceLevel === position?.experienceLevel ? (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      Your experience level matches the position's requirements.
                    </Alert>
                  ) : (
                    <Alert severity="info" sx={{ mb: 1 }}>
                      Your experience level is different from what's requested.
                    </Alert>
                  )}
                  
                  {candidateProfile?.languages?.some(lang => 
                    position?.languages?.includes(lang)
                  ) ? (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      Your language skills match this position's requirements.
                    </Alert>
                  ) : (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      Your language skills may not match this position's requirements.
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      
      case 2: // Motivation Letter
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Motivation Letter
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Write a motivation letter explaining why you're interested in this position and why you would be a good fit.
            </Typography>
            
            <TextField
              label="Motivation Letter"
              multiline
              rows={10}
              fullWidth
              value={motivationLetter}
              onChange={(e) => setMotivationLetter(e.target.value)}
              placeholder="Dear Hiring Manager,

I am writing to express my interest in the [Position Title] position at UDDAN. I believe my skills and experience make me an ideal candidate because..."
            />
          </Box>
        );
      
      case 3: // Confirmation
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Application Confirmation
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your application before submitting. Once submitted, you can track the status in your candidate dashboard.
            </Alert>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Position:</strong> {position?.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Applicant:</strong> {candidateProfile?.fullName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Email:</strong> {candidateProfile?.email}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Phone:</strong> {candidateProfile?.phoneNumber}
                </Typography>
              </CardContent>
            </Card>
            
            <Typography variant="subtitle1" gutterBottom>
              Motivation Letter:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {motivationLetter || 'No motivation letter provided.'}
              </Typography>
            </Paper>
            
            <Alert severity="success">
              Your profile information and CV will be automatically included with this application.
            </Alert>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  if (isLoading || isPositionLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading application data...
        </Typography>
      </Container>
    );
  }
  
  if (error && !editMode) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/positions')}>
          Back to Positions
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Application
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 3, pb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ p: 3 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0 || (editMode && activeStep === 0) || isSubmitting}
            onClick={handleBack}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !profileComplete}
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
              disabled={(activeStep === 0 && !profileComplete && !editMode) || (editMode && activeStep === 0)}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default JobApplicationPage;