import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, createService, updateService } from '../../redux/slices/servicesSlice';
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

const availabilityOptions = [
  'Immediate',
  'In 1 week',
  'In 2 weeks',
  'In 1 month',
  'Custom'
];

const ServiceForm = ({ serviceId = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error, currentService } = useSelector((state) => state.services);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    benefits: '',
    availability: '',
    keywords: [],
    active: true
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  
  const isEditMode = !!serviceId;
  
  useEffect(() => {
    // Clear errors on unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  useEffect(() => {
    // If in edit mode and currentService is available, use it to populate the form
    if (isEditMode && currentService) {
      setFormData({
        title: currentService.title || '',
        description: currentService.description || '',
        benefits: currentService.benefits || '',
        availability: currentService.availability || '',
        keywords: currentService.keywords || [],
        active: currentService.active
      });
    }
  }, [isEditMode, currentService]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (formData.keywords.length === 0) {
      errors.keywords = 'At least one keyword is required';
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
  
  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      active: e.target.checked
    });
  };
  
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()]
      });
      setNewKeyword('');
      
      // Clear keywords error if any
      if (formErrors.keywords) {
        setFormErrors({
          ...formErrors,
          keywords: undefined
        });
      }
    }
  };
  
  const handleDeleteKeyword = (keywordToDelete) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(keyword => keyword !== keywordToDelete)
    });
    
    // Check if keywords is empty after deletion and set error if needed
    if (formData.keywords.length <= 1) {
      setFormErrors({
        ...formErrors,
        keywords: 'At least one keyword is required'
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
        await dispatch(updateService({ id: serviceId, serviceData: formData })).unwrap();
      } else {
        await dispatch(createService(formData)).unwrap();
        // Reset form after successful creation
        setFormData({
          title: '',
          description: '',
          benefits: '',
          availability: '',
          keywords: [],
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
        {isEditMode ? 'Edit Service' : 'Create New Service'}
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
              label="Service Title"
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
          
          <Grid item xs={12}>
            <TextField
              name="benefits"
              label="Benefits (comma separated)"
              fullWidth
              multiline
              rows={2}
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder="e.g., Tailored solutions, Scalable architecture, Modern technologies"
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel id="availability-label">Availability</InputLabel>
              <Select
                labelId="availability-label"
                name="availability"
                value={formData.availability}
                label="Availability"
                onChange={handleInputChange}
              >
                <MenuItem value="">Not specified</MenuItem>
                {availabilityOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
            <Typography variant="subtitle1" gutterBottom>
              Keywords
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {formData.keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                  disabled={isLoading}
                />
              ))}
            </Box>
            
            {formErrors.keywords && (
              <FormHelperText error>{formErrors.keywords}</FormHelperText>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
              <TextField
                label="Add Keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                disabled={isLoading}
                fullWidth
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button 
                onClick={handleAddKeyword} 
                variant="contained" 
                sx={{ ml: 2 }}
                disabled={!newKeyword.trim() || isLoading}
              >
                Add
              </Button>
            </Box>
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
                {isLoading ? 'Saving...' : isEditMode ? 'Update Service' : 'Create Service'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      <AlertMessage
        open={showSuccessAlert}
        message={isEditMode ? "Service updated successfully!" : "Service created successfully!"}
        severity="success"
        onClose={() => setShowSuccessAlert(false)}
      />
    </Paper>
  );
};

export default ServiceForm;