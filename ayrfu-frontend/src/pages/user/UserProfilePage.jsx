// src/pages/user/UserProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const UserProfilePage = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

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
        const response = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(response.data);
        setProfileData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || ''
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Get token for authorization
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Make API call to update user profile
      if (!user || !user.id) {
        throw new Error('User ID not found');
      }
      
      const userId = user.id;
      
      // Update user profile
      await axios.put(`/api/users/${userId}`, {
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Show success message
      setSuccess(true);
      setEditing(false);
      
      // Refresh user data
      const updatedUserResponse = await axios.get('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(updatedUserResponse.data);
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
            {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.fullName || 'User Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email || 'No email available'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {editing ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="fullName"
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={saving}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={true} // Email should not be editable
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phoneNumber"
                  label="Phone Number"
                  value={profileData.phoneNumber}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={saving}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="address"
                  label="Address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={saving}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {profileData.fullName || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {profileData.email || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {profileData.phoneNumber || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {profileData.address || 'Not provided'}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </Box>
          </>
        )}
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