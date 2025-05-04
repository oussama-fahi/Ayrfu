import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { 
  createCandidate, 
  uploadCandidateCV, 
  applyForPosition,
  clearError,
  resetApplicationSuccess,
  resetUploadSuccess
} from '../../redux/slices/candidatesSlice';
import AlertMessage from '../common/AlertMessage';

const ApplicationForm = ({ positionId, position, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error, currentCandidate, applicationSuccess, uploadSuccess } = useSelector((state) => state.candidates);
  
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    coverLetter: '',
  });
  
  const [cvFile, setCvFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  useEffect(() => {
    // Clear errors on unmount
    return () => {
      dispatch(clearError());
      dispatch(resetApplicationSuccess());
      dispatch(resetUploadSuccess());
    };
  }, [dispatch]);
  
  useEffect(() => {
    // If candidate is created and CV uploaded successfully, proceed to apply
    if (currentCandidate && uploadSuccess && step === 2) {
      handleApplyForPosition();
    }
  }, [currentCandidate, uploadSuccess]);
  
  useEffect(() => {
    // When application is successful, show success message
    if (applicationSuccess) {
      setShowSuccessAlert(true);
      
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [applicationSuccess, onSuccess]);
  
  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateStep2 = () => {
    const errors = {};
    
    if (!cvFile) {
      errors.cvFile = 'Please upload your CV/resume';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setCvFile(file);
      
      // Clear file error if present
      if (formErrors.cvFile) {
        setFormErrors({
          ...formErrors,
          cvFile: undefined
        });
      }
    }
  };
  
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async () => {
    try {
      // First, create candidate profile
      const candidateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };
      
      await dispatch(createCandidate(candidateData)).unwrap();
      
      // Then upload CV
      if (currentCandidate) {
        await dispatch(uploadCandidateCV({
          id: currentCandidate.id,
          file: cvFile
        })).unwrap();
      }
      
      // Application submission will be triggered by the useEffect when CV upload is successful
    } catch (err) {
      // Error is handled in the slice
    }
  };
  
  const handleApplyForPosition = async () => {
    try {
      const applicationData = {
        positionId,
        coverLetter: formData.coverLetter,
      };
      
      await dispatch(applyForPosition({
        id: currentCandidate.id,
        applicationData
      })).unwrap();
    } catch (err) {
      // Error is handled in the slice
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Apply for {position ? position.title : 'Position'}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {step === 1 ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="fullName"
              label="Full Name"
              fullWidth
              required
              value={formData.fullName}
              onChange={handleInputChange}
              error={!!formErrors.fullName}
              helperText={formErrors.fullName}
              disabled={isLoading}
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
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="phoneNumber"
              label="Phone Number"
              fullWidth
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Resume/CV Upload
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Please upload your resume or CV. Supported formats: PDF, DOCX, DOC.
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={handleClickUpload}
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                Select File
              </Button>
              
              {cvFile ? (
                <Typography variant="body2" color="success.main">
                  File selected: {cvFile.name}
                </Typography>
              ) : (
                <Typography variant="body2" color="error.main">
                  {formErrors.cvFile || 'No file selected'}
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="coverLetter"
              label="Cover Letter (Optional)"
              fullWidth
              multiline
              rows={6}
              value={formData.coverLetter}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {step === 2 && (
          <Button
            variant="outlined"
            onClick={handlePrevStep}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextStep}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {isLoading ? 'Processing...' : step === 1 ? 'Next' : 'Submit Application'}
          </Button>
        </Box>
      </Box>
      
      <AlertMessage
        open={showSuccessAlert}
        message="Your application has been submitted successfully!"
        severity="success"
        onClose={() => setShowSuccessAlert(false)}
      />
    </Paper>
  );
};

export default ApplicationForm;