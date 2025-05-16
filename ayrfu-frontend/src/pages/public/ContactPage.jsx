import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useState } from 'react';
import ContactForm from '../../components/common/ContactForm';

const ContactPage = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom align="center">
        Contact Us
      </Typography>
      
      <Typography variant="body1" paragraph align="center" color="textSecondary" sx={{ mb: 6 }}>
        Get in touch with our team. We're here to help with any questions you may have.
      </Typography>
      
      <Grid container spacing={6}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="contact tabs"
            >
              <Tab icon={<PersonIcon />} label="For Candidates" />
              <Tab icon={<BusinessIcon />} label="For Clients" />
            </Tabs>
          </Paper>
          
          {tabValue === 0 ? (
            <ContactForm 
              type="CANDIDATE"
              title="Contact Our Recruitment Team"
              subtitle="Have questions about our open positions or application process? Get in touch with our recruitment team."
            />
          ) : (
            <ContactForm 
              type="CLIENT"
              title="Contact Our Sales Team"
              subtitle="Interested in our services? Contact our sales team to discuss your business needs."
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Office Location
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', mb: 2 }}>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  123 Business Street<br />
                  Tech City, 12345<br />
                  Country
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', mb: 2 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  +1 (123) 456-7890
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="body1">
                  contact@UDDAN.com
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Business Hours
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Saturday:</strong> 10:00 AM - 2:00 PM
              </Typography>
              <Typography variant="body1">
                <strong>Sunday:</strong> Closed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;