import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Divider,
  Box,
  Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';

const MatchingPositions = ({ positions = [] }) => {
  const navigate = useNavigate();
  
  if (positions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="h6">No matching positions found</Typography>
        <Typography variant="body1">
          We couldn't find any positions matching your criteria. Try adjusting your preferences or check back later.
        </Typography>
      </Alert>
    );
  }
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Matching Positions
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Based on your preferences, we've found {positions.length} position{positions.length !== 1 ? 's' : ''} that might be a good fit for you.
      </Typography>
      
      <Grid container spacing={3}>
        {positions.map((position) => (
          <Grid item xs={12} key={position.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {position.title}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip icon={<CodeIcon />} label={position.technology} />
                  <Chip icon={<LocationOnIcon />} label={position.location} />
                  <Chip icon={<WorkIcon />} label={position.workModel} />
                </Stack>
                
                <Typography variant="body1" paragraph>
                  {position.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Experience Required:</strong> {position.experienceLevel}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    <TranslateIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    <strong>Languages:</strong>
                  </Typography>
                  
                  <Stack direction="row" spacing={1}>
                    {position.languages.map((language, index) => (
                      <Chip key={index} size="small" label={language} />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/positions/${position.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(`/apply/${position.id}`)}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MatchingPositions;