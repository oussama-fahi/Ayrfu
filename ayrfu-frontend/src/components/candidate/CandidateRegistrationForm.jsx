import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { registerCandidate, clearError } from '../../redux/slices/candidatesSlice';

const CandidateRegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, error, success } = useSelector((state) => state.candidates);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Form state
  const [formData, setFormData] = useState({
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
    preferredWorkModel: ''
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Options for select fields
  const experienceLevelOptions = [
    'Entry-level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal'
  ];
  
  const locationOptions = [
    'Remote', 'On-site', 'Hybrid', 'Europe', 'North America', 'Asia', 'Other'
  ];
  
  const workModelOptions = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'
  ];
  
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  
  const commonTechnologies = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 
    'Java', 'Spring', 'Python', 'Django', 'Flask', 'C#', '.NET', 'PHP', 
    'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Google Cloud', 'DevOps', 'CI/CD'
  ];
  
  const commonLanguages = [
    'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese', 
    'Dutch', 'Russian', 'Chinese', 'Japanese', 'Arabic'
  ];
  
  // Redirect if registration successful
  useEffect(() => {
    if (success) {
      // Redirect to login page or dashboard
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    }
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/candidate/dashboard');
    }
    
    // Clear any errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [success, navigate, dispatch, isAuthenticated]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle multi-select changes (technologies and languages)
  const handleMultiSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const errors = {};
    
    // Basic validations
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    if (formData.technologies.length === 0) {
      errors.technologies = 'Select at least one technology';
    }
    
    if (formData.languages.length === 0) {
      errors.languages = 'Select at least one language';
    }
    
    if (!formData.experienceLevel) {
      errors.experienceLevel = 'Experience level is required';
    }
    
    if (!formData.preferredLocation) {
      errors.preferredLocation = 'Preferred location is required';
    }
    
    if (!formData.preferredWorkModel) {
      errors.preferredWorkModel = 'Preferred work model is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Remove confirmPassword from data before submitting
      const { confirmPassword, ...registrationData } = formData;
      
      dispatch(registerCandidate(registrationData));
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Candidate Registration
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph align="center">
          Create your candidate profile to apply for job positions
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
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
                type="email"
                fullWidth
                required
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
            
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
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
                error={!!formErrors.address}
                helperText={formErrors.address}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={!!formErrors.dateOfBirth}
                helperText={formErrors.dateOfBirth}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.gender} disabled={isLoading}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleInputChange}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Professional Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Professional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonTechnologies}
                value={formData.technologies}
                onChange={(e, value) => handleMultiSelectChange('technologies', value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Technologies"
                    placeholder="Select technologies"
                    error={!!formErrors.technologies}
                    helperText={formErrors.technologies}
                  />
                )}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonLanguages}
                value={formData.languages}
                onChange={(e, value) => handleMultiSelectChange('languages', value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Languages"
                    placeholder="Select languages"
                    error={!!formErrors.languages}
                    helperText={formErrors.languages}
                  />
                )}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.experienceLevel} disabled={isLoading}>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  label="Experience Level"
                  onChange={handleInputChange}
                >
                  {experienceLevelOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formErrors.experienceLevel && (
                <Typography variant="caption" color="error">
                  {formErrors.experienceLevel}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.preferredLocation} disabled={isLoading}>
                <InputLabel>Preferred Location</InputLabel>
                <Select
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  label="Preferred Location"
                  onChange={handleInputChange}
                >
                  {locationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formErrors.preferredLocation && (
                <Typography variant="caption" color="error">
                  {formErrors.preferredLocation}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.preferredWorkModel} disabled={isLoading}>
                <InputLabel>Preferred Work Model</InputLabel>
                <Select
                  name="preferredWorkModel"
                  value={formData.preferredWorkModel}
                  label="Preferred Work Model"
                  onChange={handleInputChange}
                >
                  {workModelOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formErrors.preferredWorkModel && (
                <Typography variant="caption" color="error">
                  {formErrors.preferredWorkModel}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/login')}
                  disabled={isLoading}
                >
                  Already have an account? Sign In
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CandidateRegistrationForm;