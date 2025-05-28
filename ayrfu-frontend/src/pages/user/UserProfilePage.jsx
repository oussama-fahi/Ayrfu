// src/pages/user/UserProfilePage.jsx
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, hasRole, getCurrentUser } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // User profile data
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    roles: []
  });
  
  // Candidate profile data
  const [candidateData, setCandidateData] = useState({
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
    preferredWorkModel: '',
    cvPath: ''
  });
  
  // Client profile data
  const [clientData, setClientData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    requirements: ''
  });
  
  const isCandidate = user && hasRole && hasRole('ROLE_CANDIDATE');
  const isClient = user && hasRole && hasRole('ROLE_CLIENT');
  const isAdmin = user && hasRole && hasRole('ROLE_ADMIN');
  const isSuperUser = user && hasRole && hasRole('ROLE_SUPER_USER');

  // Load user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Fetch basic user profile
        const userResponse = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUserData({
          fullName: userResponse.data.fullName || '',
          email: userResponse.data.email || '',
          roles: userResponse.data.roles || []
        });
        
        // If user has candidate role, fetch candidate profile
        if (hasRole('ROLE_CANDIDATE')) {
          try {
            const candidateResponse = await axios.get('/api/users/profile/candidate', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            setCandidateData({
              fullName: candidateResponse.data.fullName || '',
              email: candidateResponse.data.email || '',
              phoneNumber: candidateResponse.data.phoneNumber || '',
              address: candidateResponse.data.address || '',
              dateOfBirth: candidateResponse.data.dateOfBirth || null,
              gender: candidateResponse.data.gender || '',
              technologies: candidateResponse.data.technologies || [],
              languages: candidateResponse.data.languages || [],
              experienceLevel: candidateResponse.data.experienceLevel || '',
              preferredLocation: candidateResponse.data.preferredLocation || '',
              preferredWorkModel: candidateResponse.data.preferredWorkModel || '',
              cvPath: candidateResponse.data.cvPath || ''
            });
          } catch (err) {
            console.error('Error fetching candidate profile:', err);
            // It's okay if candidate profile doesn't exist yet
          }
        }
        
        // If user has client role, fetch client profile
        if (hasRole('ROLE_CLIENT')) {
          try {
            const clientResponse = await axios.get('/api/users/profile/client', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            setClientData({
              companyName: clientResponse.data.companyName || '',
              contactPerson: clientResponse.data.contactPerson || '',
              email: clientResponse.data.email || '',
              phoneNumber: clientResponse.data.phoneNumber || '',
              industry: clientResponse.data.industry || '',
              companySize: clientResponse.data.companySize || '',
              requirements: clientResponse.data.requirements || ''
            });
          } catch (err) {
            console.error('Error fetching client profile:', err);
            // It's okay if client profile doesn't exist yet
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        if (err.response?.status === 401) {
          // localStorage.removeItem('token');
          // navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, hasRole]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateInputChange = (e) => {
    const { name, value } = e.target;
    setCandidateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Update user profile
      await axios.put('/api/auth/profile', {
        fullName: userData.fullName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update candidate profile if user has candidate role
      if (hasRole('ROLE_CANDIDATE')) {
        await axios.put('/api/users/profile/candidate', {
          fullName: candidateData.fullName,
          phoneNumber: candidateData.phoneNumber,
          address: candidateData.address,
          dateOfBirth: candidateData.dateOfBirth,
          gender: candidateData.gender,
          technologies: candidateData.technologies,
          languages: candidateData.languages,
          experienceLevel: candidateData.experienceLevel,
          preferredLocation: candidateData.preferredLocation,
          preferredWorkModel: candidateData.preferredWorkModel
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Update client profile if user has client role
      if (hasRole('ROLE_CLIENT')) {
        await axios.put('/api/users/profile/client', {
          companyName: clientData.companyName,
          contactPerson: clientData.contactPerson,
          phoneNumber: clientData.phoneNumber,
          industry: clientData.industry,
          companySize: clientData.companySize,
          requirements: clientData.requirements
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Show success message
      setSuccess(true);
      setEditing(false);
      
      // Refresh user data
      getCurrentUser();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };
  
  const handleCloseSuccessMessage = () => {
    setSuccess(false);
  };

  // Function to render role chips
  const renderRoleChip = (roleName) => {
    if (roleName === 'ROLE_ADMIN') {
      return <Chip icon={<AdminPanelSettingsIcon />} label="Admin" color="error" sx={{ mr: 1, mb: 1 }} />;
    } else if (roleName === 'ROLE_SUPER_USER') {
      return <Chip icon={<SupervisorAccountIcon />} label="Super User" color="warning" sx={{ mr: 1, mb: 1 }} />;
    } else if (roleName === 'ROLE_CANDIDATE') {
      return <Chip icon={<PersonIcon />} label="Candidate" color="primary" sx={{ mr: 1, mb: 1 }} />;
    } else if (roleName === 'ROLE_CLIENT') {
      return <Chip icon={<BusinessIcon />} label="Client" color="success" sx={{ mr: 1, mb: 1 }} />;
    } else {
      return <Chip label={roleName} sx={{ mr: 1, mb: 1 }} />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3
            }}
          >
            {userData?.fullName ? userData.fullName[0].toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {userData?.fullName || 'User Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userData?.email || 'No email available'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
              {userData.roles?.map(role => (
                renderRoleChip(typeof role === 'string' ? role : role.name)
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="General" />
          {isCandidate && <Tab label="Candidate Profile" />}
          {isClient && <Tab label="Client Profile" />}
        </Tabs>
        
        <form onSubmit={handleSubmit}>
          {/* General Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="fullName"
                  label="Full Name"
                  value={userData.fullName}
                  onChange={handleUserInputChange}
                  fullWidth
                  disabled={!editing || saving}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  value={userData.email}
                  fullWidth
                  disabled={true} // Email should not be editable
                  helperText="Email cannot be changed"
                />
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Candidate Profile Tab */}
          {isCandidate && (
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    value={candidateData.phoneNumber}
                    onChange={handleCandidateInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="address"
                    label="Address"
                    value={candidateData.address}
                    onChange={handleCandidateInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="experienceLevel"
                    label="Experience Level"
                    value={candidateData.experienceLevel}
                    onChange={handleCandidateInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="preferredLocation"
                    label="Preferred Location"
                    value={candidateData.preferredLocation}
                    onChange={handleCandidateInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="preferredWorkModel"
                    label="Preferred Work Model"
                    value={candidateData.preferredWorkModel}
                    onChange={handleCandidateInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    CV/Resume
                  </Typography>
                  <Typography variant="body1">
                    {candidateData.cvPath 
                      ? `CV Uploaded: ${candidateData.cvPath}` 
                      : 'No CV uploaded yet'}
                  </Typography>
                  {/* Upload CV button would go here */}
                </Grid>
              </Grid>
            </TabPanel>
          )}
          
          {/* Client Profile Tab */}
          {isClient && (
            <TabPanel value={tabValue} index={isCandidate ? 2 : 1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="companyName"
                    label="Company Name"
                    value={clientData.companyName}
                    onChange={handleClientInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="contactPerson"
                    label="Contact Person"
                    value={clientData.contactPerson}
                    onChange={handleClientInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    value={clientData.phoneNumber}
                    onChange={handleClientInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="industry"
                    label="Industry"
                    value={clientData.industry}
                    onChange={handleClientInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="companySize"
                    label="Company Size"
                    value={clientData.companySize}
                    onChange={handleClientInputChange}
                    fullWidth
                    disabled={!editing || saving}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="requirements"
                    label="Requirements"
                    value={clientData.requirements}
                    onChange={handleClientInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!editing || saving}
                  />
                </Grid>
              </Grid>
            </TabPanel>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editing ? (
              <>
                <Button 
                  variant="outlined" 
                  onClick={() => setEditing(false)}
                  startIcon={<CancelIcon />}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        message="Profile updated successfully"
      />
    </Container>
  );
};

export default UserProfilePage;