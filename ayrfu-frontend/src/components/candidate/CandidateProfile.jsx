import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Divider,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadCandidateCV,
  updateProfileWithCV,
  clearError,
  resetSuccess
} from '../../redux/slices/candidatesSlice';

const CandidateProfile = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { currentCandidate, isLoading, error, success, uploadSuccess } = useSelector(
    (state) => state.candidates
  );
  
  // Editing state
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
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
  
  // CV file upload
  const [cvFile, setCvFile] = useState(null);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
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
  
  // Fetch candidate profile on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getCandidateProfile(user.id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearError());
      dispatch(resetSuccess());
    };
  }, [dispatch, user]);
  
  // Update local state when profile data is loaded
  useEffect(() => {
    if (currentCandidate) {
      setProfileData({
        fullName: currentCandidate.fullName || '',
        email: currentCandidate.email || '',
        phoneNumber: currentCandidate.phoneNumber || '',
        address: currentCandidate.address || '',
        dateOfBirth: currentCandidate.dateOfBirth || '',
        gender: currentCandidate.gender || '',
        technologies: currentCandidate.technologies || [],
        languages: currentCandidate.languages || [],
        experienceLevel: currentCandidate.experienceLevel || '',
        preferredLocation: currentCandidate.preferredLocation || '',
        preferredWorkModel: currentCandidate.preferredWorkModel || ''
      });
    }
  }, [currentCandidate]);
  
  // Handle success and show notifications
  useEffect(() => {
    if (success) {
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      setEditing(false);
      setCvFile(null);
      dispatch(resetSuccess());
    }
    
    if (uploadSuccess) {
      setNotification({
        open: true,
        message: 'CV uploaded successfully',
        severity: 'success'
      });
      setCvFile(null);
      dispatch(resetSuccess());
    }
  }, [success, uploadSuccess, dispatch]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle multi-select changes (technologies and languages)
  const handleMultiSelectChange = (name, value) => {
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };
  
  // Handle CV upload
  const handleUploadCV = () => {
    if (cvFile && user?.id) {
      dispatch(uploadCandidateCV({ id: user.id, file: cvFile }));
    }
  };
  
  // Start editing mode
  const handleStartEditing = () => {
    setEditing(true);
  };
  
  // Cancel editing
  const handleCancelEditing = () => {
    // Reset form data to current profile data
    if (currentCandidate) {
      setProfileData({
        fullName: currentCandidate.fullName || '',
        email: currentCandidate.email || '',
        phoneNumber: currentCandidate.phoneNumber || '',
        address: currentCandidate.address || '',
        dateOfBirth: currentCandidate.dateOfBirth || '',
        gender: currentCandidate.gender || '',
        technologies: currentCandidate.technologies || [],
        languages: currentCandidate.languages || [],
        experienceLevel: currentCandidate.experienceLevel || '',
        preferredLocation: currentCandidate.preferredLocation || '',
        preferredWorkModel: currentCandidate.preferredWorkModel || ''
      });
    }
    setEditing(false);
    setCvFile(null);
  };
  
  // Save profile changes
  const handleSaveProfile = () => {
    if (user?.id) {
      if (cvFile) {
        // If CV is also being updated, use combined endpoint
        dispatch(updateProfileWithCV({
          id: user.id,
          profileData,
          file: cvFile
        }));
      } else {
        // Just update profile without CV
        dispatch(updateCandidateProfile({
          id: user.id,
          profileData
        }));
      }
    }
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading && !currentCandidate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header section with avatar and basic info */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: '2rem',
              bgcolor: 'primary.main',
              mb: { xs: 2, sm: 0 },
              mr: { sm: 4 }
            }}
          >
            {getInitials(currentCandidate?.fullName)}
          </Avatar>
          
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" gutterBottom>
              {editing ? (
                <TextField
                  name="fullName"
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                  sx={{ maxWidth: 400 }}
                />
              ) : (
                currentCandidate?.fullName || 'Candidate Profile'
              )}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {currentCandidate?.email}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              {currentCandidate?.experienceLevel && (
                <Chip
                  icon={<WorkIcon />}
                  label={currentCandidate.experienceLevel}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              
              {currentCandidate?.preferredLocation && (
                <Chip
                  icon={<LocationIcon />}
                  label={currentCandidate.preferredLocation}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              
              {currentCandidate?.preferredWorkModel && (
                <Chip
                  icon={<BusinessIcon />}
                  label={currentCandidate.preferredWorkModel}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            {editing ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEditing}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleStartEditing}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  {editing ? (
                    <TextField
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      fullWidth
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.phoneNumber || 'Not provided'}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  {editing ? (
                    <TextField
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      fullWidth
                      margin="dense"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.address || 'Not provided'}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  {editing ? (
                    <TextField
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      fullWidth
                      margin="dense"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.dateOfBirth ? formatDate(currentCandidate.dateOfBirth) : 'Not provided'}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gender
                  </Typography>
                  {editing ? (
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={profileData.gender}
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
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.gender || 'Not provided'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          {/* Professional Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <CodeIcon fontSize="small" sx={{ mr: 1 }} />
                    Technologies
                  </Typography>
                  {editing ? (
                    <Autocomplete
                      multiple
                      options={commonTechnologies}
                      value={profileData.technologies}
                      onChange={(e, value) => handleMultiSelectChange('technologies', value)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select technologies"
                          size="small"
                        />
                      )}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {currentCandidate?.technologies && currentCandidate.technologies.length > 0 ? (
                        currentCandidate.technologies.map((tech) => (
                          <Chip key={tech} label={tech} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No technologies specified
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon fontSize="small" sx={{ mr: 1 }} />
                    Languages
                  </Typography>
                  {editing ? (
                    <Autocomplete
                      multiple
                      options={commonLanguages}
                      value={profileData.languages}
                      onChange={(e, value) => handleMultiSelectChange('languages', value)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select languages"
                          size="small"
                        />
                      )}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {currentCandidate?.languages && currentCandidate.languages.length > 0 ? (
                        currentCandidate.languages.map((lang) => (
                          <Chip key={lang} label={lang} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No languages specified
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Experience Level
                  </Typography>
                  {editing ? (
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>Experience Level</InputLabel>
                      <Select
                        name="experienceLevel"
                        value={profileData.experienceLevel}
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
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.experienceLevel || 'Not specified'}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Preferred Location
                  </Typography>
                  {editing ? (
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>Preferred Location</InputLabel>
                      <Select
                        name="preferredLocation"
                        value={profileData.preferredLocation}
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
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.preferredLocation || 'Not specified'}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Preferred Work Model
                  </Typography>
                  {editing ? (
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>Preferred Work Model</InputLabel>
                      <Select
                        name="preferredWorkModel"
                        value={profileData.preferredWorkModel}
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
                  ) : (
                    <Typography variant="body1">
                      {currentCandidate?.preferredWorkModel || 'Not specified'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          {/* CV Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6">Curriculum Vitae</Typography>
              
              {editing && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    accept=".pdf,.doc,.docx"
                    id="cv-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="cv-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      size="small"
                    >
                      Select File
                    </Button>
                  </label>
                  
                  {cvFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {cvFile.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setCvFile(null)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            
            <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              {currentCandidate?.cvPath ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    CV uploaded: {currentCandidate.cvPath}
                  </Typography>
                  
                  {!editing && (
                    <Button
                      variant="outlined"
                      size="small"
                      component="a"
                      href={`/api/candidates/${currentCandidate.id}/cv/download`}
                      target="_blank"
                      download
                    >
                      Download CV
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  {editing ? 'Select a CV file to upload' : 'No CV uploaded yet. Click Edit Profile to upload your CV.'}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CandidateProfile;