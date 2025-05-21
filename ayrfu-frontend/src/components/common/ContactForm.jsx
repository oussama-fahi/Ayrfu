import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Box 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { createMessage, resetMessageState } from '../../redux/slices/messagesSlice';

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

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const messageData = {
        type,
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone,
        content: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}`,
      };
      dispatch(createMessage(messageData));
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setFormErrors({});
    dispatch(resetMessageState());
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {title || (type === 'CANDIDATE' ? 'Contact Our Recruitment Team' : 'Contact Our Sales Team')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {subtitle || (type === 'CANDIDATE' 
          ? 'Have questions about our open positions or application process? Get in touch with our recruitment team.' 
          : 'Interested in our services? Contact our sales team to discuss your business needs.')}
      </Typography>
      
      {messageSent ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Your message has been sent successfully! We'll get back to you soon.
          </Alert>
          <Button variant="outlined" onClick={handleReset}>
            Send Another Message
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone Number (Optional)"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="subject"
                label="Subject"
                fullWidth
                value={formData.subject}
                onChange={handleChange}
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
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color={type === 'CANDIDATE' ? 'primary' : 'secondary'}
                size="large"
                endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
};

export default ContactForm;