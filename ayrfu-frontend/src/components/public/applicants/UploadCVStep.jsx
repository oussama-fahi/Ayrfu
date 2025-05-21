// src/components/public/applicants/UploadCVStep.jsx
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import { useState } from 'react';

const UploadCVStep = ({ file, onChange, existingCV }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get file icon based on file extension
  const getFileIcon = (filename) => {
    if (!filename) return <DescriptionIcon fontSize="large" />;
    
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon fontSize="large" color="error" />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon fontSize="large" color="primary" />;
      default:
        return <DescriptionIcon fontSize="large" />;
    }
  };
  
  // Extract filename from path
  const getFilenameFromPath = (path) => {
    if (!path) return '';
    return path.split('/').pop();
  };
  
  // Handle file upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    // Simulate upload delay for better UX
    setTimeout(() => {
      onChange(selectedFile);
      setIsUploading(false);
    }, 1000);
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    onChange(null);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Your CV/Resume
      </Typography>
      
      <Typography variant="body1" paragraph>
        Please upload your CV or resume. Acceptable formats: PDF, DOC, DOCX. Maximum file size: 5MB.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {isUploading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <CircularProgress size={24} />
          <Typography>Uploading file...</Typography>
        </Box>
      ) : (
        <>
          {existingCV && !file && (
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    {getFileIcon(existingCV)}
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">
                      Current CV: {getFilenameFromPath(existingCV)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You already have a CV uploaded. You can use it or upload a new one.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          {file && (
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    {getFileIcon(file.name)}
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">
                      Selected: {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveFile}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {file ? 'Choose Another File' : existingCV ? 'Upload New CV' : 'Upload CV'}
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Button>
        </>
      )}
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Your CV should include your educational background, work experience, skills, and any relevant certifications.
      </Typography>
    </Box>
  );
};

export default UploadCVStep;