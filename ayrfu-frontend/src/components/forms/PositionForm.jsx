import {
  CheckCircleOutlined as ActiveIcon,
  Add as AddIcon,
  CancelOutlined as CancelIcon,
  Code as CodeIcon,
  Grade as GradeIcon,
  Cancel as InactiveIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  SaveAlt as SaveIcon,
  Translate as TranslateIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, createPosition, updatePosition } from '../../redux/slices/positionsSlice';
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
  const theme = useTheme();
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
        active: currentPosition.active !== undefined ? currentPosition.active : true
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
  
  // Form header component
  const FormHeader = () => (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3, 
        pb: 2, 
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` 
      }}>
        <Box 
          sx={{ 
            width: 8, 
            height: 40, 
            bgcolor: 'primary.main', 
            borderRadius: 1, 
            mr: 2 
          }} 
        />
        <Typography variant="h5" fontWeight="600">
          {isEditMode ? 'Edit Position' : 'Create New Position'}
        </Typography>
      </Box>
      
      {error && (
        <Box 
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: alpha(theme.palette.error.main, 0.1), 
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </>
  );
  
  // Left column - Basic information
  const LeftColumn = () => (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {/* Basic Position Information */}
      <Card sx={{ 
        boxShadow: theme.shadows[1],
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderRadius: 2,
        flex: 1
      }}>
        <CardContent sx={{ height: '100%' }}>
          <Typography variant="h6" component="div" gutterBottom
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
            Basic Position Information
          </Typography>
          
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
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
            }}
            placeholder="e.g. Senior Java Developer"
          />
          
          <TextField
            name="description"
            label="Position Description"
            fullWidth
            multiline
            rows={10}
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 } 
            }}
            placeholder="Describe the role, responsibilities, and requirements"
          />
        </CardContent>
      </Card>
    </Stack>
  );
  
  // Right column - Technical requirements, location, status
  const RightColumn = () => (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {/* Technical Requirements */}
      <Card sx={{ 
        boxShadow: theme.shadows[1],
        bgcolor: alpha(theme.palette.info.main, 0.03),
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom 
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CodeIcon sx={{ mr: 1, color: 'info.main' }} />
            Technical Requirements
          </Typography>
          
          <Grid container spacing={2}>
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
                placeholder="e.g. React, Java, Python"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                InputProps={{
                  startAdornment: <CodeIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.experienceLevel} 
                disabled={isLoading}
              >
                <InputLabel id="experience-label">Experience Level</InputLabel>
                <Select
                  labelId="experience-label"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  label="Experience Level"
                  onChange={handleInputChange}
                  sx={{ borderRadius: 1.5 }}
                  startAdornment={<GradeIcon color="action" sx={{ ml: 1, mr: 1, opacity: 0.6 }} />}
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
                {formErrors.experienceLevel && <FormHelperText>{formErrors.experienceLevel}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Location & Work Model */}
      <Card sx={{ 
        boxShadow: theme.shadows[1],
        bgcolor: alpha(theme.palette.success.main, 0.03),
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom 
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 1, color: 'success.main' }} />
            Location & Work Model
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.location} 
                disabled={isLoading}
              >
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  name="location"
                  value={formData.location}
                  label="Location"
                  onChange={handleInputChange}
                  sx={{ borderRadius: 1.5 }}
                  startAdornment={<LocationIcon color="action" sx={{ ml: 1, mr: 1, opacity: 0.6 }} />}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
                {formErrors.location && <FormHelperText>{formErrors.location}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.workModel} 
                disabled={isLoading}
              >
                <InputLabel id="work-model-label">Work Model</InputLabel>
                <Select
                  labelId="work-model-label"
                  name="workModel"
                  value={formData.workModel}
                  label="Work Model"
                  onChange={handleInputChange}
                  sx={{ borderRadius: 1.5 }}
                  startAdornment={<WorkIcon color="action" sx={{ ml: 1, mr: 1, opacity: 0.6 }} />}
                >
                  {workModels.map((model) => (
                    <MenuItem key={model} value={model}>{model}</MenuItem>
                  ))}
                </Select>
                {formErrors.workModel && <FormHelperText>{formErrors.workModel}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Active Status */}
      <Card sx={{ 
        boxShadow: theme.shadows[1],
        borderRadius: 2
      }}>
        <CardContent sx={{ 
          p: '16px !important', 
          backgroundColor: formData.active ? 
            alpha(theme.palette.success.main, 0.1) : 
            alpha(theme.palette.error.main, 0.1)
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {formData.active ? 
                <ActiveIcon color="success" sx={{ mr: 2 }} /> : 
                <InactiveIcon color="error" sx={{ mr: 2 }} />
              }
              <Typography>
                {formData.active ? "Active & visible to candidates" : "Inactive & hidden from candidates"}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleSwitchChange}
                  name="active"
                  color={formData.active ? "success" : "error"}
                  disabled={isLoading}
                />
              }
              label={formData.active ? "Active" : "Inactive"}
              sx={{ ml: 2 }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
  
  // Bottom section - Languages
  const LanguagesSection = () => (
    <Card sx={{ 
      boxShadow: theme.shadows[1],
      bgcolor: alpha(theme.palette.warning.main, 0.03),
      borderRadius: 2,
      mt: 2
    }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TranslateIcon sx={{ mr: 1, color: 'warning.main' }} />
          Required Languages
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl 
              fullWidth 
              required 
              error={!!formErrors.languages} 
              disabled={isLoading}
            >
              <InputLabel id="languages-label">Languages</InputLabel>
              <Select
                labelId="languages-label"
                multiple
                value={formData.languages}
                onChange={handleLanguageChange}
                input={<OutlinedInput label="Languages" sx={{ borderRadius: 1.5 }} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        color="primary"
                        variant="outlined"
                        onDelete={() => handleDeleteLanguage(value)}
                        onMouseDown={(event) => event.stopPropagation()}
                        sx={{ m: 0.3 }}
                      />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                startAdornment={<LanguageIcon color="action" sx={{ ml: 1, mr: 1, opacity: 0.6 }} />}
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
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.background.paper, 0.7),
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              p: { xs: 1, sm: 2 }
            }}>
              <TextField
                label="Add Custom Language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                disabled={isLoading}
                fullWidth
                placeholder="Type a language name and press Add"
                variant="outlined"
                sx={{ mr: 2 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddLanguage} 
                disabled={!newLanguage.trim() || isLoading}
                color="primary"
                startIcon={<AddIcon />}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '80px', sm: '100px' }
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
  // Form actions component
  const FormActions = () => (
    <>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          disabled={isLoading}
          startIcon={<CancelIcon />}
          onClick={() => onSuccess ? onSuccess() : null}
          sx={{ borderRadius: 2, py: 1.5, px: { xs: 2, sm: 3 } }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{ 
            borderRadius: 2,
            py: 1.5,
            px: { xs: 2, sm: 4 },
            boxShadow: theme.shadows[4],
            '&:hover': {
              boxShadow: theme.shadows[8],
            }
          }}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Position' : 'Create Position'}
        </Button>
      </Box>
    </>
  );
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <FormHeader />
        
        {/* Main content area with two columns */}
        <Grid container spacing={2}>
          {/* Left column - Basic information */}
          <Grid item xs={12} md={6}>
            <LeftColumn />
          </Grid>
          
          {/* Right column - Technical requirements, location, status */}
          <Grid item xs={12} md={6}>
            <RightColumn />
          </Grid>
          
          {/* Bottom section - Languages */}
          <Grid item xs={12}>
            <LanguagesSection />
          </Grid>
          
          {/* Form actions */}
          <Grid item xs={12}>
            <FormActions />
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