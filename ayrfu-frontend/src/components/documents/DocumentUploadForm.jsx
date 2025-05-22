// src/components/documents/DocumentUploadForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadDocument, clearDocumentStatus } from '../../redux/slices/documentsSlice';

const DocumentUploadForm = ({ open, onClose, clientId }) => {
  const dispatch = useDispatch();
  const { isLoading, error, uploadSuccess } = useSelector((state) => state.documents);
  
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const documentTypes = [
    'COMPANY_PROFILE',
    'FINANCIAL_REPORT',
    'PORTFOLIO',
    'CONTRACT',
    'PROPOSAL',
    'INVOICE',
    'MESSAGE_ATTACHMENT',
    'OTHER'
  ];
  
  const documentTypeLabels = {
    'COMPANY_PROFILE': 'Company Profile',
    'FINANCIAL_REPORT': 'Financial Report',
    'PORTFOLIO': 'Portfolio',
    'CONTRACT': 'Contract',
    'PROPOSAL': 'Proposal',
    'INVOICE': 'Invoice',
    'MESSAGE_ATTACHMENT': 'Message Attachment',
    'OTHER': 'Other'
  };
  
  useEffect(() => {
    if (uploadSuccess) {
      setNotification({
        open: true,
        message: 'Document uploaded successfully',
        severity: 'success'
      });
      handleClose(true);
    }
  }, [uploadSuccess]);
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentType) {
      setNotification({
        open: true,
        message: 'Please select a file and document type',
        severity: 'error'
      });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      if (description) {
        formData.append('description', description);
      }
      
      await dispatch(uploadDocument({ clientId, formData })).unwrap();
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };
  
  const handleClose = (success = false) => {
    setFile(null);
    setDocumentType('');
    setDescription('');
    dispatch(clearDocumentStatus());
    onClose(success);
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  return (
    <>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please select a file to upload and specify the document type.
          </DialogContentText>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ py: 1.5 }}
              >
                Select a file
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  label="Document Type"
                >
                  <MenuItem value="">Select a type</MenuItem>
                  {documentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {documentTypeLabels[type]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={!file || !documentType || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </>
  );
};

export default DocumentUploadForm;