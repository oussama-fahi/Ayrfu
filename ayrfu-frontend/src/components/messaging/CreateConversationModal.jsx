import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { startConversation } from '../../redux/slices/conversationsSlice';

const CreateConversationModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.conversations);
  const [recipients, setRecipients] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    recipientId: '',
    initialMessage: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setRecipients([
          { id: 1, fullName: 'John Doe', userType: 'ADMIN' },
          { id: 2, fullName: 'Jane Smith', userType: 'ADMIN' },
          { id: 3, fullName: 'Mark Wilson', userType: 'RECRUITER' }
        ]);
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };
    
    if (open) {
      fetchRecipients();
    }
  }, [open]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!formData.recipientId) {
      errors.recipientId = 'Recipient is required';
    }
    if (!formData.initialMessage.trim()) {
      errors.initialMessage = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(startConversation(formData)).unwrap();
      handleClose(true);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleClose = (success = false) => {
    setFormData({
      subject: '',
      recipientId: '',
      initialMessage: ''
    });
    setFormErrors({});
    onClose(success);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => handleClose()} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Start New Conversation</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <FormControl 
              fullWidth
              error={!!formErrors.recipientId}
            >
              <InputLabel id="recipient-label">Recipient</InputLabel>
              <Select
                labelId="recipient-label"
                name="recipientId"
                value={formData.recipientId}
                label="Recipient"
                onChange={handleChange}
              >
                <MenuItem value="">Select a recipient</MenuItem>
                {recipients.map((recipient) => (
                  <MenuItem key={recipient.id} value={recipient.id}>
                    {recipient.fullName} ({recipient.userType})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.recipientId && (
                <FormHelperText>{formErrors.recipientId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="subject"
              label="Subject"
              fullWidth
              value={formData.subject}
              onChange={handleChange}
              error={!!formErrors.subject}
              helperText={formErrors.subject}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="initialMessage"
              label="Message"
              multiline
              rows={4}
              fullWidth
              value={formData.initialMessage}
              onChange={handleChange}
              error={!!formErrors.initialMessage}
              helperText={formErrors.initialMessage}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Sending...' : 'Start Conversation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateConversationModal;