import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  FormHelperText,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { createPosition, updatePosition, clearError } from '../../redux/slices/positionsSlice';
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

const PositionForm = ({ positionId = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error, currentPosition } = useSelector((state) => state.positions);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technology: '',
    location: '',
    languages: [],
    experienceLevel: '',
    workModel: '',
    active: true
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  
  const isEditMode = !!positionId;
  
  useEffect(() => {
    // Clear errors on unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  useEffect(() => {
    // If in edit mode and currentPosition is available, use it to populate the form
    if (isEditMode && currentPosition) {
      setFormData({
        title: currentPosition.title || '',
        description: currentPosition.description || '',
        technology: currentPosition.technology || '',
        location: currentPosition.location || '',
        languages: currentPosition.languages || [],
        experienceLevel: currentPosition.experienceLevel || '',
        workModel: currentPosition.workModel || '',
        active: currentPosition.active
      });
    }
  }, [isEditMode, currentPosition]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.technology.trim()) {
      errors.technology = 'Technology is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (formData.languages.length === 0) {
      errors.languages = 'At least one language is required';
    }
    
    if (!formData.experienceLevel.trim()) {
      errors.experienceLevel = 'Experience level is required';
    }
    
    if (!formData.workModel.trim()) {
      errors.workModel = 'Work model is required';
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
  
  const handleLanguageChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData({
      ...formData,
      languages: typeof value === 'string' ? value.split(',') : value,
    });
    
    // Clear languages error if any
    if (formErrors.languages) {
      setFormErrors({
        ...formErrors,
        languages: undefined
      });
    }
  };
  
  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      active: e.target.checked
    });
  };
  
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage('');
      
      // Clear languages error if any
      if (formErrors.languages) {
        setFormErrors({
          ...formErrors,
          languages: undefined
        });
      }
    }
  };
  
  const handleDeleteLanguage = (languageToDelete) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(language => language !== languageToDelete)
    });
    
    // Check if languages is empty after deletion and set error if needed
    if (formData.languages.length <= 1) {
      setFormErrors({
        ...formErrors,
        languages: 'At least one language is required'
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode) {
        await dispatch(updatePosition({ id: positionId, positionData: formData })).unwrap();
      } else {
        await dispatch(createPosition(formData)).unwrap();
        // Reset form after successful creation
        setFormData({
          title: '',
          description: '',
          technology: '',
          location: '',
          languages: [],
          experienceLevel: '',
          workModel: '',
          active: true
        });
      }
      
      setShowSuccessAlert(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled in the slice
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Edit Position' : 'Create New Position'}
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
            <TextField
              name="title"
              label="Position Title"
              fullWidth
              required
              value={formData.title}
              onChange={handleInputChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="technology"
              label="Technology"
              fullWidth
              required
              value={formData.technology}
              onChange={handleInputChange}
              error={!!formErrors.technology}
              helperText={formErrors.technology}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!formErrors.location} disabled={isLoading}>
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                name="location"
                value={formData.location}
                label="Location *"
                onChange={handleInputChange}
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
              {formErrors.location && <FormHelperText>{formErrors.location}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!formErrors.experienceLevel} disabled={isLoading}>
              <InputLabel id="experience-label">Experience Level</InputLabel>
              <Select
                labelId="experience-label"
                name="experienceLevel"
                value={formData.experienceLevel}
                label="Experience Level *"
                onChange={handleInputChange}
              >
                {experienceLevels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
              {formErrors.experienceLevel && <FormHelperText>{formErrors.experienceLevel}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!formErrors.workModel} disabled={isLoading}>
              <InputLabel id="work-model-label">Work Model</InputLabel>
              <Select
                labelId="work-model-label"
                name="workModel"
                value={formData.workModel}
                label="Work Model *"
                onChange={handleInputChange}
              >
                {workModels.map((model) => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
              {formErrors.workModel && <FormHelperText>{formErrors.workModel}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!formErrors.languages} disabled={isLoading}>
              <InputLabel id="languages-label">Languages</InputLabel>
              <Select
                labelId="languages-label"
                multiple
                value={formData.languages}
                onChange={handleLanguageChange}
                input={<OutlinedInput label="Languages *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {languages.map((language) => (
                  <MenuItem
                    key={language}
                    value={language}
                  >
                    {language}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.languages && <FormHelperText>{formErrors.languages}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
              <TextField
                label="Add Custom Language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                disabled={isLoading}
                fullWidth
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <Button 
                onClick={handleAddLanguage} 
                variant="contained" 
                sx={{ ml: 2 }}
                disabled={!newLanguage.trim() || isLoading}
              >
                Add
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleSwitchChange}
                  name="active"
                  color="primary"
                  disabled={isLoading}
                />
              }
              label="Active"
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
                {isLoading ? 'Saving...' : isEditMode ? 'Update Position' : 'Create Position'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      <AlertMessage
        open={showSuccessAlert}
        message={isEditMode ? "Position updated successfully!" : "Position created successfully!"}
        severity="success"
        onClose={() => setShowSuccessAlert(false)}
      />
    </Paper>
  );
};

export default PositionForm;