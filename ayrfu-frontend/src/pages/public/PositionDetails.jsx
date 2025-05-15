import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Code as CodeIcon,
  Translate as TranslateIcon,
  CheckCircleOutline as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { fetchPositionById } from '../../redux/slices/positionsSlice';
import { applyForPosition } from '../../redux/slices/candidatesSlice';

const PositionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentPosition, isLoading: positionLoading, error: positionError } = useSelector((state) => state.positions);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: applicationLoading, applicationSuccess, error: applicationError } = useSelector(
    (state) => state.candidates
  );

  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterError, setCoverLetterError] = useState('');

  // Fetch position details on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchPositionById(id));
    }
  }, [dispatch, id]);

  // Prefill application data from user profile
  useEffect(() => {
    if (user && currentPosition) {
      // Auto-generate a cover letter template based on the user's skills and the position
      const coverLetterTemplate = `Dear Hiring Manager,

I am writing to express my interest in the ${currentPosition.title} position at your company. With ${user.experienceLevel} experience in ${user.technologies?.join(', ')}, I believe I would be a strong candidate for this role.

My background in ${user.technologies?.filter(tech => tech === currentPosition.technology || tech.includes(currentPosition.technology.split(' ')[0])).join(', ') || user.technologies?.[0]} aligns well with the requirements of this position. I am particularly drawn to this opportunity because it matches my preferred ${user.preferredWorkModel?.toLowerCase() || ''} work model and my ${user.languages?.join(', ')} language skills would be valuable for your team.

I look forward to discussing how my skills and experience can contribute to your team's success.

Sincerely,
${user.fullName}`;

      setCoverLetter(coverLetterTemplate);
    }
  }, [user, currentPosition]);

  // Handle application submission
  const handleApply = () => {
    // Validate cover letter
    if (!coverLetter.trim()) {
      setCoverLetterError('Cover letter is required');
      return;
    }

    // Clear any previous errors
    setCoverLetterError('');

    // Submit application
    dispatch(
      applyForPosition({
        id: user.id,
        applicationData: {
          positionId: parseInt(id),
          coverLetter: coverLetter,
        },
      })
    );
  };

  // Redirect on successful application
  useEffect(() => {
    if (applicationSuccess) {
      navigate('/candidate/applications', { 
        state: { 
          message: 'Application submitted successfully!',
          type: 'success'
        } 
      });
    }
  }, [applicationSuccess, navigate]);

  // Render loading state
  if (positionLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading position details...</Typography>
      </Container>
    );
  }

  // Render error state
  if (positionError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>{positionError}</Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/positions')}>
          Back to Positions
        </Button>
      </Container>
    );
  }

  // If no position data is available
  if (!currentPosition) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>Position not found or has been removed.</Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/positions')}>
          Back to Positions
        </Button>
      </Container>
    );
  }

  // Sample responsibilities and requirements (could come from backend, but for now mocked)
  const responsibilities = [
    `Design and develop high-quality applications using ${currentPosition.technology}`,
    "Write clean, maintainable code with proper testing",
    "Collaborate with cross-functional teams",
    "Participate in code reviews",
    "Troubleshoot production issues"
  ];

  const requirements = [
    `${currentPosition.experienceLevel} level experience in ${currentPosition.technology}`,
    "Strong problem-solving skills",
    "Excellent communication and teamwork abilities",
    "Proactive attitude and willingness to learn",
    "Ability to work in a fast-paced environment"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/positions')}
        sx={{ mb: 4 }}
      >
        Back to Positions
      </Button>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>{currentPosition.title}</Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip icon={<CodeIcon />} label={currentPosition.technology} />
          <Chip icon={<LocationIcon />} label={currentPosition.location} />
          <Chip icon={<WorkIcon />} label={currentPosition.workModel} />
          <Chip label={`Experience: ${currentPosition.experienceLevel}`} />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>Job Description</Typography>
        <Typography variant="body1" paragraph>
          {currentPosition.description || 'No description provided.'}
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Responsibilities</Typography>
            <List>
              {responsibilities.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Requirements</Typography>
            <List>
              {requirements.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            <TranslateIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
            <strong>Languages:</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {currentPosition.languages && currentPosition.languages.map((language, index) => (
              <Chip key={index} label={language} />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Application Form */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Apply for this Position</Typography>
        
        {applicationError && <Alert severity="error" sx={{ mb: 3 }}>{applicationError}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Cover Letter"
              multiline
              rows={6}
              fullWidth
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              error={!!coverLetterError}
              helperText={coverLetterError}
              disabled={applicationLoading}
              placeholder="Explain why you're interested in this position and what makes you a good fit..."
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleApply}
                disabled={applicationLoading}
                sx={{ minWidth: 150 }}
              >
                {applicationLoading ? <CircularProgress size={24} /> : 'Submit Application'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PositionDetails;