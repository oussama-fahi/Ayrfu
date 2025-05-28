import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';

// Import UDDAN logo
import UddanLogo from '../assets/images/uddan-logo.svg';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Main navigation items
  const mainNavItems = [
    { text: 'For Candidates', icon: <PersonIcon />, path: '/positions' },
    { text: 'For Clients', icon: <BusinessIcon />, path: '/clients' },
    { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' }
  ];

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleAccountMenuClose();
    navigate('/');
  };

  const isAdmin = user && hasRole && (hasRole('ROLE_ADMIN'));
  const isSuperUser = user && hasRole && (hasRole('ROLE_SUPER_USER'));
  const isCandidate = user && hasRole && (hasRole('ROLE_CANDIDATE'));
  const isClient = user && hasRole && (hasRole('ROLE_CLIENT'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          transition: 'all 0.3s ease',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: 1
              }}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <img src={UddanLogo} alt="UDDAN Logo" height="40" />
              <Typography
                variant="h5"
                component="span"
                sx={{
                  ml: 1,
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #0066CC, #4D94E0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                UDDAN
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex' }} data-aos="fade-down" data-aos-delay="200">
                {mainNavItems.map((item, index) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      mx: 1,
                      fontWeight: 500,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '70%',
                      }
                    }}
                    data-aos="fade-down"
                    data-aos-delay={200 + (index * 50)}
                  >
                    {item.text}
                  </Button>
                ))}

                {/* Login/Register/Logout buttons */}
                {!isAuthenticated ? (
                  <>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/login"
                      startIcon={<LoginIcon />}
                      sx={{ ml: 1 }}
                      data-aos="fade-left"
                      data-aos-delay="400"
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/register"
                      startIcon={<AppRegistrationIcon />}
                      sx={{ ml: 1, boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)' }}
                      data-aos="fade-left"
                      data-aos-delay="450"
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      onClick={handleAccountMenuOpen}
                      endIcon={<KeyboardArrowDownIcon />}
                      startIcon={
                        <Avatar
                          sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}
                        >
                          {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                        </Avatar>
                      }
                      data-aos="fade-left"
                      data-aos-delay="400"
                    >
                      My Account
                    </Button>
                  </>
                )}
              </Box>
            )}

            {/* User Account Menu when authenticated */}
            <Menu
              id="account-menu"
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={handleAccountMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))',
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => {
                  handleAccountMenuClose();
                  navigate('/user/profile');
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>

              {isCandidate && (
                <MenuItem
                  onClick={() => {
                    handleAccountMenuClose();
                    navigate('/candidate/dashboard');
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Candidate Dashboard" />
                </MenuItem>
              )}

              {isClient && (
                <MenuItem
                  onClick={() => {
                    handleAccountMenuClose();
                    navigate('/client/dashboard');
                  }}
                >
                  <ListItemIcon>
                    <BusinessIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Client Dashboard" />
                </MenuItem>
              )}

              {/* Show Admin Dashboard only for Admin and SuperUser */}
              {(isAdmin || isSuperUser) && (
                <MenuItem
                  onClick={() => {
                    handleAccountMenuClose();
                    navigate('/admin/dashboard');
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </MenuItem>
              )}

              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile menu drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: '0 16px 16px 0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <img src={UddanLogo} alt="UDDAN Logo" height="36" />
            <Typography variant="h6" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
              UDDAN
            </Typography>
          </Box>

          <List sx={{ pt: 2 }}>
            <ListItem button onClick={() => handleNavigation('/')} sx={{ py: 1.5 }}>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>

            {mainNavItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItem>
            ))}

            <Divider sx={{ my: 2 }} />

            {isAuthenticated ? (
              <>
                <ListItem
                  button
                  onClick={() => handleNavigation('/user/profile')}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItem>

                {isCandidate && (
                  <ListItem
                    button
                    onClick={() => handleNavigation('/candidate/dashboard')}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Candidate Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
                  </ListItem>
                )}

                {isClient && (
                  <ListItem
                    button
                    onClick={() => handleNavigation('/client/dashboard')}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Client Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
                  </ListItem>
                )}

                {/* Only show for Admin and SuperUser */}
                {(isAdmin || isSuperUser) && (
                  <ListItem
                    button
                    onClick={() => handleNavigation('/admin/dashboard')}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
                  </ListItem>
                )}

                <Divider sx={{ my: 2 }} />

                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500, color: 'error.main' }} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem
                  button
                  onClick={() => handleNavigation('/login')}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItem>

                <ListItem
                  button
                  onClick={() => handleNavigation('/register')}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <AppRegistrationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;