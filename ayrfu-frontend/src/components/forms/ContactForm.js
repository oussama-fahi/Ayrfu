// src/components/forms/ContactForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { createMessage, resetMessageSent } from '../../redux/slices/messagesSlice';
import AlertMessage from '../common/AlertMessage';

const ContactForm = ({ type = 'CANDIDATE', title, subtitle }) => {
  const dispatch = useDispatch();
  const { isLoading, error, messageSent } = useSelector((state) => state.messages);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const messageData = {
      type,
      senderName: formData.name,
      senderEmail: formData.email,
      senderPhone: formData.phone,
      content: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}`,
    };
    
    try {
      await dispatch(createMessage(messageData)).unwrap();
      setShowSuccessAlert(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      // Error is handled in the slice
    }
  };
  
  const handleCloseAlert = () => {
    setShowSuccessAlert(false);
    dispatch(resetMessageSent());
  };
  
  if (messageSent) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
        
        <Typography variant="body1" paragraph>
          Thank you for contacting us. Our team will review your message and respond as soon as possible.
        </Typography>
        
        <Button 
          variant="outlined" 
          onClick={() => dispatch(resetMessageSent())}
          sx={{ mt: 2 }}
        >
          Send Another Message
        </Button>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title || (type === 'CANDIDATE' ? 'Contact Our Recruitment Team' : 'Contact Our Sales Team')}
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        {subtitle || (type === 'CANDIDATE' 
          ? 'Have questions about our open positions or application process? Get in touch with our recruitment team.' 
          : 'Interested in our services? Contact our sales team to discuss your business needs.')}
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="phone"
              label="Phone Number (Optional)"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="subject"
              label="Subject"
              fullWidth
              value={formData.subject}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="message"
              label="Message"
              fullWidth
              required
              multiline
              rows={5}
              value={formData.message}
              onChange={handleChange}
              error={!!formErrors.message}
              helperText={formErrors.message}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color={type === 'CANDIDATE' ? 'primary' : 'secondary'}
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      <AlertMessage
        open={showSuccessAlert}
        message="Your message has been sent successfully!"
        severity="success"
        onClose={handleCloseAlert}
      />
    </Paper>
  );
};

export default ContactForm;