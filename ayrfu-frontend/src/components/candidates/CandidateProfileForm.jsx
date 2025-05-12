// src/components/candidates/CandidateProfileForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
  CircularProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { createCandidate } from '../../redux/slices/candidatesSlice';

const experienceLevels = [
  'Entry-level',
  'Junior',
  'Mid-level',
  'Senior',
  'Lead',
  'Principal'
];

const workModels = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship'
];

const locations = [
  'Remote',
  'On-site',
  'Hybrid',
  'Europe',
  'North America',
  'South America',
  'Asia',
  'Africa',
  'Australia'
];

// A large list of common programming languages and technologies
const commonTechnologies = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Express.js', 'Python', 'Django', 'Flask',
  'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel',
  'Ruby', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'C++', 'C', 'Dart', 'Flutter',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'GraphQL', 'REST API', 'HTML', 'CSS', 'Sass',
  'LESS', 'Bootstrap', 'Material UI', 'Tailwind CSS',
  'Git', 'GitHub', 'GitLab', 'DevOps', 'CI/CD',
  'Jenkins', 'Terraform', 'Serverless', 'Microservices'
];

// A list of languages
const commonLanguages = [
  'English', 'French', 'Spanish', 'German', 'Italian',
  'Portuguese', 'Dutch', 'Russian', 'Mandarin', 'Japanese',
  'Korean', 'Arabic', 'Hindi', 'Swedish', 'Finnish',
  'Norwegian', 'Danish', 'Polish', 'Czech', 'Greek',
  'Turkish', 'Romanian', 'Hungarian'
];

const CandidateProfileForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error, currentCandidate } = useSelector((state) => state.candidates);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    technologies: [],
    languages: [],
    experienceLevel: '',
    preferredLocation: '',
    preferredWorkModel: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTechnologiesChange = (_, newValue) => {
    setFormData({
      ...formData,
      technologies: newValue
    });
  };

  const handleLanguagesChange = (_, newValue) => {
    setFormData({
      ...formData,
      languages: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phoneNumber || 
        formData.technologies.length === 0 || formData.languages.length === 0 || 
        !formData.experienceLevel || !formData.preferredWorkModel) {
      
      return;
    }
    
    try {
      await dispatch(createCandidate(formData)).unwrap();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by the Redux slice
      console.error('Failed to create candidate profile:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Complete Your Candidate Profile
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Please fill in the following information to create your candidate profile. This will allow you to apply for positions and receive personalized job recommendations.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true} // Email comes from auth and shouldn't be editable
              helperText="Email from your account"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
          
          {/* Skills & Preferences */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Skills & Preferences
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={commonTechnologies}
              value={formData.technologies}
              onChange={handleTechnologiesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Technologies & Skills"
                  placeholder="Add technologies"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={commonLanguages}
              value={formData.languages}
              onChange={handleLanguagesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Languages"
                  placeholder="Add languages"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Experience Level</InputLabel>
              <Select
                name="experienceLevel"
                value={formData.experienceLevel}
                label="Experience Level"
                onChange={handleInputChange}
                disabled={isLoading}
              >
                {experienceLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Preferred Work Model</InputLabel>
              <Select
                name="preferredWorkModel"
                value={formData.preferredWorkModel}
                label="Preferred Work Model"
                onChange={handleInputChange}
                disabled={isLoading}
              >
                {workModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Preferred Location</InputLabel>
              <Select
                name="preferredLocation"
                value={formData.preferredLocation}
                label="Preferred Location"
                onChange={handleInputChange}
                disabled={isLoading}
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Creating Profile..." : "Create Profile"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CandidateProfileForm;