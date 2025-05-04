// src/components/forms/CandidateForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  Box,
  Chip,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import { createCandidate, clearError } from '../../redux/slices/candidatesSlice';
import AlertMessage from '../common/AlertMessage';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

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

const languages = [
  'English', 
  'French', 
  'Spanish', 
  'German', 
  'Portuguese', 
  'Italian', 
  'Dutch', 
  'Chinese', 
  'Japanese', 
  'Arabic'
];

const technologies = [
  'Java', 'Spring Boot', 'JavaScript', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Python', 'Django', 'Flask', 'C#', '.NET',
  'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis'
];

const CandidateForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.candidates);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: null,
    gender: '',
    technologies: [],
    languages: [],
    experienceLevel: '',
    preferredLocation: '',
    preferredWorkModel: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  
  useEffect(() => {
    // Clear errors on unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
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
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date
    });
  };
  
  const handleTechnologyChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData({
      ...formData,
      technologies: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  const handleLanguageChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData({
      ...formData,
      languages: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  const handleAddTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };
  
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };
  
  const handleDeleteTechnology = (techToDelete) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(tech => tech !== techToDelete)
    });
  };
  
  const handleDeleteLanguage = (langToDelete) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(lang => lang !== langToDelete)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(createCandidate(formData)).unwrap();
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: null,
        gender: '',
        technologies: [],
        languages: [],
        experienceLevel: '',
        preferredLocation: '',
        preferredWorkModel: ''
      });
      
      setShowSuccessAlert(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled in the slice
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Candidate Profile
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Box sx={{ mb: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
            
            <Grid item xs={12} sm={6}>
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isLoading}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleInputChange}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    disabled={isLoading}
                  />
                )}
                maxDate={new Date()}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Professional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isLoading}>
                <InputLabel id="experience-level-label">Experience Level</InputLabel>
                <Select
                  labelId="experience-level-label"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  label="Experience Level"
                  onChange={handleInputChange}
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isLoading}>
                <InputLabel id="preferred-location-label">Preferred Location</InputLabel>
                <Select
                  labelId="preferred-location-label"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  label="Preferred Location"
                  onChange={handleInputChange}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isLoading}>
                <InputLabel id="preferred-work-model-label">Preferred Work Model</InputLabel>
                <Select
                  labelId="preferred-work-model-label"
                  name="preferredWorkModel"
                  value={formData.preferredWorkModel}
                  label="Preferred Work Model"
                  onChange={handleInputChange}
                >
                  {workModels.map((model) => (
                    <MenuItem key={model} value={model}>{model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Technologies
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }} disabled={isLoading}>
                <InputLabel id="technologies-label">Technologies</InputLabel>
                <Select
                  labelId="technologies-label"
                  multiple
                  value={formData.technologies}
                  onChange={handleTechnologyChange}
                  input={<OutlinedInput label="Technologies" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {technologies.map((tech) => (
                    <MenuItem
                      key={tech}
                      value={tech}
                    >
                      {tech}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Add Custom Technology"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                disabled={isLoading}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAddTechnology}
                        disabled={!newTechnology.trim() || isLoading}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Languages
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }} disabled={isLoading}>
                <InputLabel id="languages-label">Languages</InputLabel>
                <Select
                  labelId="languages-label"
                  multiple
                  value={formData.languages}
                  onChange={handleLanguageChange}
                  input={<OutlinedInput label="Languages" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {languages.map((lang) => (
                    <MenuItem
                      key={lang}
                      value={lang}
                    >
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Add Custom Language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                disabled={isLoading}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAddLanguage}
                        disabled={!newLanguage.trim() || isLoading}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                >
                  {isLoading ? 'Creating Profile...' : 'Create Profile'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        
        <AlertMessage
          open={showSuccessAlert}
          message="Candidate profile created successfully!"
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
        />
      </Paper>
    </LocalizationProvider>
  );
};

export default CandidateForm;