import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  SupervisorAccount as AdminIcon, 
  Speed as SpeedIcon, 
  People as PeopleIcon, 
  VerifiedUser as VerifiedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Language as LanguageIcon,
  Business as IndustryIcon,
  People as CompanySizeIcon,
  Group as MembersIcon,
  DateRange as FoundedIcon,
  Star as SpecializationsIcon,
  Article as NewsIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ArrowBackIos as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

/**
 * Enhanced Main Page component with horizontal scroll
 * @returns {JSX.Element} The rendered component
 */
const MainPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, hasRole } = useAuth();
  
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

  const handleAdminClick = () => {
    navigate('/admin/login');
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
      src: 'https://via.placeholder.com/600x400?text=OutSystems+Solutions',
      alt: 'OutSystems Solutions',
      title: 'OutSystems Solutions',
      description: 'Accelerate your digital transformation'
    },
    {
      src: 'https://via.placeholder.com/600x400?text=Software+Development',
      alt: 'Software Development',
      title: 'Custom Software Development',
      description: 'Enterprise-grade solutions for your business'
    },
    {
      src: 'https://via.placeholder.com/600x400?text=IT+Consulting',
      alt: 'IT Consulting',
      title: 'IT Consulting Services',
      description: 'Expert advice to optimize your IT infrastructure'
    }
  ];

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
      {/* Hero Section with horizontal scroll */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: { xs: 4, md: 6 }, 
        mb: 4,
        position: 'relative',
        backgroundImage: 'linear-gradient(45deg, rgba(94, 53, 177, 0.9), rgba(94, 53, 177, 0.7))',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            {/* Main title section */}
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, py: 4 }}>
                <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>AYRFU</Typography>
                <Typography variant="h4" sx={{ mb: 3 }}>Are You Ready For UDDAN?</Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Connect with UDDAN for job opportunities and innovative business solutions.
                </Typography>
                
                {/* Admin Dashboard button for admin users */}
                {isAuthenticated && (isAdmin || isSuperUser) && (
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="large" 
                    component={Link} 
                    to="/admin/dashboard"
                    sx={{ px: 4, py: 1.5, mt: 2 }}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </Box>
            </Grid>
            
            {/* Horizontal image carousel */}
            <Grid item xs={12} md={7}>
              <Box sx={{ 
                position: 'relative', 
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                display: 'flex',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}>
                {carouselImages.map((image, index) => (
                  <Box 
                    key={index}
                    sx={{
                      minWidth: { xs: '100%', md: '85%' },
                      height: { xs: 220, sm: 300, md: 350 },
                      scrollSnapAlign: 'start',
                      position: 'relative',
                      mr: 2,
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 3
                    }}
                  >
                    <Box 
                      component="img"
                      src={image.src}
                      alt={image.alt}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 2,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white'
                    }}>
                      <Typography variant="h6">{image.title}</Typography>
                      <Typography variant="body2">{image.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          
          {/* Scroll indicator */}
          <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
            <IconButton 
              color="inherit" 
              onClick={() => scrollToSection(candidatesRef)} 
              sx={{ animation: 'bounce 2s infinite' }}
            >
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Three main path cards in one line */}
      <Container maxWidth="lg" sx={{ mb: 10 }} ref={candidatesRef}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 5 }}>
          Choose Your Path
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* For Candidates Card */}
          <Grid item xs={12} sm={4}>
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
              <Box sx={{ 
                bgcolor: 'primary.main', 
                py: 2, 
                display: 'flex', 
                alignItems: 'center',
                px: 2
              }}>
                <PersonIcon sx={{ fontSize: 30, color: 'white', mr: 1 }} />
                <Typography variant="h6" color="white">
                  For Candidates
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, py: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Explore our open positions and join our team of professionals.
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
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
          </Grid>

          {/* For Clients Card */}
          <Grid item xs={12} sm={4}>
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
              <Box sx={{ 
                bgcolor: 'secondary.main', 
                py: 2, 
                display: 'flex', 
                alignItems: 'center',
                px: 2 
              }}>
                <BusinessIcon sx={{ fontSize: 30, color: 'white', mr: 1 }} />
                <Typography variant="h6" color="white">
                  For Clients
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, py: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Discover how UDDAN can help your business grow with specialized solutions.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small"
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
          </Grid>

          {/* UDDAN Team Card */}
          <Grid item xs={12} sm={4}>
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
              onClick={handleAdminClick}
            >
              <Box sx={{ 
                bgcolor: '#5c6bc0', 
                py: 2, 
                display: 'flex', 
                alignItems: 'center',
                px: 2
              }}>
                <AdminIcon sx={{ fontSize: 30, color: 'white', mr: 1 }} />
                <Typography variant="h6" color="white">
                  UDDAN Team
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1, py: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Authorized personnel only. Access the back office to manage services.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#5c6bc0', '&:hover': { bgcolor: '#3f51b5' } }}
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdminClick();
                  }}
                >
                  Team Login
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* News Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }} ref={newsRef}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 5 }}>
            Latest News
          </Typography>

          <Grid container spacing={4}>
            {newsItems.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <NewsIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="overline" color="text.secondary">
                        {item.date}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.summary}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="outlined" color="primary">
              View All News
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Company Info Section */}
      <Box sx={{ py: 8 }} ref={companyInfoRef}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 5 }}>
            About UDDAN
          </Typography>

          <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
              Vue d'ensemble
            </Typography>
            <Typography variant="body1" paragraph>
              UDDAN is an IT Consulting Company, specialized in Outsystems and Low-Code solutions with over 50 employees based in Belgium (Brussels), Portugal (Lisbon & Castelo Branco), the Netherlands (Amsterdam) and Sweden (Stockholm and Malmö). Working closely with several customers and partners implementing challenging OutSystems solutions, our projects are currently and mainly in the Benelux, US/Canada, South America and Portugal.
            </Typography>
            <Typography variant="body1" paragraph>
              We also work with a group of highly talented and skilled professionals on a variety of technologies such as Java, JavaScript, .net, security and others. Other part of our working effort consists in staffing our client's teams. Our focus is on client satisfaction, employee happiness and business innovation, making sure that companies adopt a ContinuousNEXT approach to digital transformation as UDDAN is. If you need our support, say something to UDDAN.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LanguageIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6">Site web</Typography>
                </Box>
                <Typography variant="body1">
                  <MuiLink href="https://uddanit.com" target="_blank" rel="noopener noreferrer">
                    https://uddanit.com
                  </MuiLink>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IndustryIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6">Secteur</Typography>
                </Box>
                <Typography variant="body1">
                  Développement de logiciels
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CompanySizeIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6">Taille de l'entreprise</Typography>
                </Box>
                <Typography variant="body1">
                  201-500 employés
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MembersIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6">Membres LinkedIn</Typography>
                </Box>
                <Typography variant="body1">
                  118 membres associés
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Membres LinkedIn ayant indiqué UDDAN comme étant leur lieu de travail actuel sur leur profil.
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FoundedIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6">Fondée en</Typography>
                </Box>
                <Typography variant="body1">
                  2015
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SpecializationsIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h6">Spécialisations</Typography>
                </Box>
                <Typography variant="body1">
                  Outsystems et Software development
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Why Choose section */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
            Why Choose UDDAN?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <SpeedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quickly implement solutions that drive immediate business value.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Expert Team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Skilled professionals with deep industry knowledge and experience.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <VerifiedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Quality Assured
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rigorous quality control to ensure reliable and robust solutions.
                </Typography>
              </Box>
            </Grid>
          </Grid>
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
                  <Button variant="outlined" component={Link} to="/user/applications">
                    My Applications
                  </Button>
                )}
                {(isAdmin || isSuperUser) && (
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/admin/dashboard" 
                    startIcon={<AdminIcon />}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/admin/login" 
                  startIcon={<AdminIcon />}
                >
                  Admin Login
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Container>

      {/* Custom CSS for animations */}
      <style jsx="true">{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default MainPage;