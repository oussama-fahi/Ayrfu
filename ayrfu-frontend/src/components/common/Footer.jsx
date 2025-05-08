// src/components/common/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider, Button, IconButton, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import UddanLogo from '../../assets/images/uddan-logo.svg';

// Import social media icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main', 
        color: '#D3D3D3',
        pt: 8,
        pb: 4,
        mt: 'auto',
        position: 'relative',
        backgroundImage: 'linear-gradient(90deg, rgba(1, 232, 200, .8) 0, rgba(41, 0, 255, .8) 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundImage: 'linear-gradient(90deg, rgba(1, 232, 200, .8) 0, rgba(41, 0, 255, .8) 100%)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} data-aos="fade-right" data-aos-delay="100">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <img src={UddanLogo} alt="UDDAN Logo" height="40" />
              <Typography variant="h5" color="white" sx={{ ml: 1, fontWeight: 'bold' }}>
                UDDAN
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
              UDDAN is a leading IT consulting firm providing innovative technology solutions to transform businesses. 
              Our expert team delivers tailored services across digital transformation, cloud migration, 
              application development, and data analytics.
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    transform: 'translateY(-3px)' 
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    transform: 'translateY(-3px)' 
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    transform: 'translateY(-3px)' 
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    transform: 'translateY(-3px)' 
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={2} data-aos="fade-up" data-aos-delay="200">
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Link 
              component={RouterLink} 
              to="/" 
              color="inherit" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Home
            </Link>
            <Link 
              component={RouterLink} 
              to="/applicants" 
              color="inherit" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Careers
            </Link>
            <Link 
              component={RouterLink} 
              to="/clients" 
              color="inherit" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Services
            </Link>
            <Link 
              component={RouterLink} 
              to="/contact" 
              color="inherit" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Contact
            </Link>
          </Grid>
          
          <Grid item xs={12} md={3} data-aos="fade-up" data-aos-delay="300">
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              Our Services
            </Typography>
            <Link 
              color="inherit" 
              href="#" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Software Development
            </Link>
            <Link 
              color="inherit" 
              href="#" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              IT Consulting
            </Link>
            <Link 
              color="inherit" 
              href="#" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Cloud Migration
            </Link>
            <Link 
              color="inherit" 
              href="#" 
              sx={{ 
                display: 'block', 
                mb: 1.5,
                opacity: 0.8,
                '&:hover': { opacity: 1 },
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4D94E0',
                  pl: 0.5
                }
              }}
            >
              Data Analytics
            </Link>
          </Grid>
          
          <Grid item xs={12} md={3} data-aos="fade-left" data-aos-delay="400">
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              opacity: 0.8,
              '&:hover': { opacity: 1 },
              transition: 'all 0.2s ease',
            }}>
              <LocationOnIcon sx={{ mr: 1, color: 'white' }} />
              <Typography variant="body2">
                123 Technology Park, Business District, Paris, France
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              opacity: 0.8,
              '&:hover': { opacity: 1 },
              transition: 'all 0.2s ease',
            }}>
              <EmailIcon sx={{ mr: 1, color: 'white' }} />
              <Typography variant="body2">
                contact@uddan.com
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 2,
              opacity: 0.8,
              '&:hover': { opacity: 1 },
              transition: 'all 0.2s ease',
            }}>
              <PhoneIcon sx={{ mr: 1, color: 'white' }} />
              <Typography variant="body2">
                +33 (1) 234-5678
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              component={RouterLink}
              to="/contact"
              sx={{ 
                mt: 2,
                background: 'linear-gradient(45deg, #0066CC, #4D94E0)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #004C99, #0066CC)',
                }
              }}
            >
              Get In Touch
            </Button>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Typography variant="body2" sx={{ opacity: 0.6, textAlign: { xs: 'center', md: 'left' } }}>
            &copy; {currentYear} UDDAN. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', mt: { xs: 2, md: 0 } }}>
            <Link color="inherit" href="#" sx={{ mx: 1, opacity: 0.6, '&:hover': { opacity: 1 }, textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link color="inherit" href="#" sx={{ mx: 1, opacity: 0.6, '&:hover': { opacity: 1 }, textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link color="inherit" href="#" sx={{ mx: 1, opacity: 0.6, '&:hover': { opacity: 1 }, textDecoration: 'none' }}>
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;