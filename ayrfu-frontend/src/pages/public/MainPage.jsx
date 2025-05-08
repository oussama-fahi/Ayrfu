import React, { useState, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Stack,
  Divider,
  IconButton,
  Link as MuiLink,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  VerifiedUser as VerifiedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Language as LanguageIcon,
  Business as IndustryIcon,
  People as CompanySizeIcon,
  Group as MembersIcon,
  DateRange as FoundedIcon,
  Star as SpecializationsIcon,
  Article as NewsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

/**
 * Enhanced MainPage component with improved layout
 * @returns {JSX.Element} The rendered component
 */
const MainPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, hasRole } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Refs for scrolling
  const servicesRef = useRef(null);
  const candidatesRef = useRef(null);
  const newsRef = useRef(null);
  const companyInfoRef = useRef(null);

  const handleCandidateClick = () => {
    navigate('/positions');
  };

  const handleClientClick = () => {
    navigate('/clients');
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if user has specific roles
  const isAdmin = isAuthenticated && hasRole && hasRole('ROLE_ADMIN');
  const isSuperUser = isAuthenticated && hasRole && hasRole('ROLE_SUPER_USER');
  const isCandidate = isAuthenticated && hasRole && hasRole('ROLE_CANDIDATE');
  const isClient = isAuthenticated && hasRole && hasRole('ROLE_CLIENT');

  // Carousel images
  const carouselImages = [
    {
      src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      alt: 'OutSystems Solutions',
      title: 'OutSystems Solutions',
      description: 'Accelerate your digital transformation'
    },
    {
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      alt: 'Software Development',
      title: 'Custom Software Development',
      description: 'Enterprise-grade solutions for your business'
    },
    {
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
      alt: 'IT Consulting',
      title: 'IT Consulting Services',
      description: 'Expert advice to optimize your IT infrastructure'
    }
  ];

  // Navigation function for hero carousel
  const navigateCarousel = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    } else {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
    }
  };

  //Uddan style text
  const gradientTextStyle = {
    fontWeight: 'bold',
    position: 'relative',
    display: 'inline-block',
    pb: 1,
    backgroundImage: 'linear-gradient(90deg, rgba(1, 232, 200, .8) 0, rgba(41, 0, 255, .8) 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',  // Ensures the gradient is visible
    fontSize: { xs: '2rem', md: '3rem' },  // Responsive font size
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '60%',
      height: '4px',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: 0,
      bgcolor: 'primary.main',  // Keep your primary color for the underline
      borderRadius: 2,
    },
  };

  // Sample news data
  const newsItems = [
    {
      title: "UDDAN Expands to New Office in Stockholm",
      date: "May 3, 2025",
      summary: "UDDAN announces the opening of its new office in Stockholm, Sweden, strengthening its Nordic presence."
    },
    {
      title: "New Partnership with Leading Financial Institution",
      date: "April 22, 2025",
      summary: "UDDAN signs a strategic partnership with a major European bank to develop innovative digital solutions."
    },
    {
      title: "UDDAN Recognized as OutSystems Elite Partner",
      date: "April 10, 2025",
      summary: "For the third consecutive year, UDDAN has been recognized as an Elite Partner by OutSystems."
    }
  ];

  return (
    <div>
      {/* Hero Section with carousel only */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 1, md: 1 },
          mb: 1,
          position: 'relative',
          backgroundImage: 'linear-gradient(90deg, rgba(1, 232, 200, .8) 0, rgba(41, 0, 255, .8) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              position: 'relative',
              height: { xs: 900, md: 500 },
              mx: '10%', // ← adds 10% left and right margin inside the container
            }}
          >
            {/* Carousel images */}
            {carouselImages.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  borderRadius: 1,
                }}
              />
            ))}

            {/* Image caption */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 2,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 2,
              }}
            >
              <Typography variant="h6">{carouselImages[currentImageIndex]?.title}</Typography>
              <Typography variant="body2">{carouselImages[currentImageIndex]?.description}</Typography>
            </Box>

            {/* Navigation arrows */}
            <IconButton
              onClick={() => navigateCarousel('prev')}
              sx={{
                position: 'absolute',
                left: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                zIndex: 1,
              }}
            >
              <KeyboardArrowLeftIcon fontSize="large" />
            </IconButton>

            <IconButton
              onClick={() => navigateCarousel('next')}
              sx={{
                position: 'absolute',
                right: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                zIndex: 1,
              }}
            >
              <KeyboardArrowRightIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Scroll indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: 'center',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <IconButton
              color="inherit"
              onClick={() => scrollToSection(candidatesRef)}
              sx={{
                animation: 'bounce 2s infinite',
                bgcolor: 'rgba(255,255,255,0.3)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
              }}
            >
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
          </Box>
        </Container>
      </Box>


      {/* Two main path cards side by side - Candidate (left) and Client (right) */}
      <Container maxWidth="lg" sx={{ mb: 10 }} ref={candidatesRef}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography sx={gradientTextStyle}
          >Choose Your Path</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* For Candidates Card - Left Side */}
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={handleCandidateClick}
            >
              <Box sx={{ bgcolor: 'primary.main', py: 2, display: 'flex', alignItems: 'center', px: 2 }}>
                <PersonIcon sx={{ fontSize: 30, color: 'white', mr: 1 }} />
                <Typography variant="h6" color="white">For Candidates</Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, py: 2 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Looking for a new career opportunity? Explore our open positions and join our team of professionals. We offer competitive salaries, comprehensive benefits, and a collaborative work environment.
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Browse through available positions, filter by technology, experience level, and location to find the perfect match for your skills and career goals.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCandidateClick();
                  }}
                >
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* For Clients Card - Right Side */}
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={handleClientClick}
            >
              <Box sx={{ bgcolor: 'secondary.main', py: 2, display: 'flex', alignItems: 'center', px: 2 }}>
                <BusinessIcon sx={{ fontSize: 30, color: 'secondary', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">For Clients</Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, py: 2 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Discover how UDDAN can help your business grow with specialized solutions tailored to your needs. Our team of experts will work with you to identify the right technologies and strategies.
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  From custom software development to IT consulting, we offer comprehensive services to drive your digital transformation and achieve your business goals.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClientClick();
                  }}
                >
                  Our Services
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* News Section - Full width items with equal sizing */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }} ref={newsRef}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={gradientTextStyle}>Latest News</Typography></Box>
          <Grid container spacing={4}>
            {newsItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <NewsIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="overline" color="text.secondary">{item.date}</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.summary}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="outlined" color="primary">View All News</Button>
          </Box>
        </Container>
      </Box>

      {/* Company Info Section */}
      <Box sx={{ py: 10 }} ref={companyInfoRef}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={gradientTextStyle}
            >
              About UDDAN
            </Typography>
          </Box>





          <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
            {/* Overview Section */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Vue d'ensemble
              </Typography>
              <Typography variant="body1" paragraph>
                UDDAN is an IT Consulting Company, specialized in Outsystems and Low-Code solutions with over 50 employees based in Belgium (Brussels), Portugal (Lisbon & Castelo Branco), the Netherlands (Amsterdam), and Sweden (Stockholm and Malmö). We work closely with clients to deliver challenging OutSystems solutions, with projects across the Benelux, US/Canada, South America, and Portugal.
              </Typography>
              <Typography variant="body1" paragraph>
                We also collaborate with skilled professionals in Java, JavaScript, .NET, security, and more. A part of our operations includes staffing for client teams. Our priorities are client satisfaction, employee happiness, and business innovation—helping organizations embrace a Continuous NEXT digital transformation journey.
              </Typography>
            </Box>

            {/* Company Info Grid */}
            <Grid container spacing={4}>
              {[
                {
                  icon: <LanguageIcon color="primary" />,
                  label: 'Site web',
                  value: (
                    <MuiLink href="https://uddanit.com" target="_blank" rel="noopener noreferrer">
                      uddanit.com
                    </MuiLink>
                  ),
                },
                {
                  icon: <IndustryIcon color="primary" />,
                  label: 'Secteur',
                  value: 'Développement de logiciels',
                },
                {
                  icon: <CompanySizeIcon color="primary" />,
                  label: "Taille de l'entreprise",
                  value: '201–500 employés',
                },
                {
                  icon: <MembersIcon color="primary" />,
                  label: 'Membres LinkedIn',
                  value: (
                    <>
                      118 membres associés
                      <Typography variant="caption" color="text.secondary" display="block">
                        Membres LinkedIn ayant indiqué UDDAN comme leur lieu de travail.
                      </Typography>
                    </>
                  ),
                },
                {
                  icon: <FoundedIcon color="primary" />,
                  label: 'Fondée en',
                  value: '2015',
                },
                {
                  icon: <SpecializationsIcon color="primary" />,
                  label: 'Spécialisations',
                  value: 'Outsystems et Software Development',
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    {item.icon}
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>


      {/* Why Choose section - with three items in same line */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={gradientTextStyle}>Why Choose UDDAN?</Typography></Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Fast Delivery - Left */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <SpeedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Fast Delivery</Typography>
              <Typography variant="body2" color="text.secondary">
                Quickly implement solutions that drive immediate business value.
              </Typography>
            </Box>

            {/* Expert Team - Center */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Expert Team</Typography>
              <Typography variant="body2" color="text.secondary">
                Skilled professionals with deep industry knowledge and experience.
              </Typography>
            </Box>

            {/* Quality Assured - Right */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <VerifiedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Quality Assured</Typography>
              <Typography variant="body2" color="text.secondary">
                Rigorous quality control to ensure reliable and robust solutions.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Quick access section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Divider sx={{ mb: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {isAuthenticated ? 'Quick Access' : 'Get Started'}
            </Typography>
          </Divider>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            {isAuthenticated ? (
              <>
                {isCandidate && (
                  <Button variant="outlined" component={RouterLink} to="/user/applications">
                    My Applications
                  </Button>
                )}
                {isClient && (
                  <Button variant="outlined" component={RouterLink} to="/client/dashboard">
                    Client Dashboard
                  </Button>
                )}
                {(isAdmin || isSuperUser) && (
                  <Button variant="outlined" component={RouterLink} to="/admin/dashboard">
                    Admin Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outlined" component={RouterLink} to="/login">
                  Sign In
                </Button>
                <Button variant="contained" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Container>

      {/* Custom CSS for animations */}
      <style jsx="true">{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
        @keyframes pulse {
          0% {transform: translateY(-50%) scale(1); opacity: 1;}
          50% {transform: translateY(-50%) scale(1.1); opacity: 0.8;}
          100% {transform: translateY(-50%) scale(1); opacity: 1;}
        }
      `}</style>
    </div>
  );
};

export default MainPage;