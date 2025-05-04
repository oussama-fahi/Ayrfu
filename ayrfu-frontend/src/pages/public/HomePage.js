import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const CardStyled = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Are You Ready For UDDAN?
              </Typography>
              <Typography variant="h5" paragraph>
                Join our team or discover how we can help your business grow.
              </Typography>
              <Box mt={4} display="flex" gap={2}>
                <Button
                  component={Link}
                  to="/applicants"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<PersonIcon />}
                >
                  I'm a Candidate
                </Button>
                <Button
                  component={Link}
                  to="/clients"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  startIcon={<BusinessIcon />}
                >
                  I'm a Client
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add an illustration or image here */}
              <Box
                component="img"
                src="/assets/images/hero-image.svg"
                alt="UDDAN"
                sx={{ width: '100%', height: 'auto' }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          What We Offer
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
          Discover how UDDAN can help you grow
        </Typography>

        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4}>
            <CardStyled>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <PersonIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    For Candidates
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Explore exciting career opportunities with UDDAN. Our personalized
                    matching algorithm helps you find the perfect position.
                  </Typography>
                  <Button
                    component={Link}
                    to="/applicants"
                    variant="text"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Explore Opportunities
                  </Button>
                </Box>
              </CardContent>
            </CardStyled>
          </Grid>

          <Grid item xs={12} md={4}>
            <CardStyled>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <BusinessIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    For Clients
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Discover how UDDAN's services can help your business thrive.
                    Tell us what you need, and we'll find the perfect solution.
                  </Typography>
                  <Button
                    component={Link}
                    to="/clients"
                    variant="text"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Explore Services
                  </Button>
                </Box>
              </CardContent>
            </CardStyled>
          </Grid>

          <Grid item xs={12} md={4}>
            <CardStyled>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <WorkIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Open Positions
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Browse our current job openings and find a role that matches your
                    skills and career aspirations.
                  </Typography>
                  <Button
                    component={Link}
                    to="/positions"
                    variant="text"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    View Positions
                  </Button>
                </Box>
              </CardContent>
            </CardStyled>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;