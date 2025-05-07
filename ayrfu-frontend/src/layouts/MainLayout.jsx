// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  
  const mainNavItems = [
    { text: 'For Candidates', icon: <PersonIcon />, path: '/applicants' },
    { text: 'For Clients', icon: <BusinessIcon />, path: '/clients' },
    { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' }
  ];
  
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
      <AppBar position="static">
        <Toolbar>
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
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold',
              flexGrow: 1
            }}
          >
            AYRFU
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', mr: 2 }}>
              {mainNavItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {/* Login/Profile section now on the right side */}
          {isAuthenticated ? (
            <Button 
              color="inherit"
              onClick={handleAccountMenuOpen}
              startIcon={
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    fontSize: '0.75rem',
                    bgcolor: 'primary.dark'
                  }}
                >
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </Avatar>
              }
            >
              Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex' }}>
              <Button 
                color="inherit"
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{ ml: 1 }}
              >
                Login
              </Button>
              <Button 
                color="inherit"
                component={RouterLink}
                to="/register"
                startIcon={<AppRegistrationIcon />}
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </Box>
          )}
          
          {/* User Account Menu when authenticated */}
          <Menu
            id="account-menu"
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={handleAccountMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 180,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { 
              handleAccountMenuClose(); 
              navigate('/user/profile'); 
            }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            
            {isCandidate && (
              <MenuItem onClick={() => { 
                handleAccountMenuClose(); 
                navigate('/user/applications'); 
              }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Applications" />
              </MenuItem>
            )}
            
            {(isAdmin || isSuperUser) && (
              <MenuItem onClick={() => { 
                handleAccountMenuClose(); 
                navigate('/admin/dashboard'); 
              }}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </MenuItem>
            )}
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Mobile menu drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            <ListItem>
              <Typography variant="h6" color="primary">AYRFU</Typography>
            </ListItem>
            <Divider />
            
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemText primary="Home" />
            </ListItem>
            
            {mainNavItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            <Divider />
            
            {isAuthenticated ? (
              <>
                <ListItem button onClick={() => handleNavigation('/user/profile')}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItem>
                
                {isCandidate && (
                  <ListItem button onClick={() => handleNavigation('/user/applications')}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Applications" />
                  </ListItem>
                )}
                
                {(isAdmin || isSuperUser) && (
                  <ListItem button onClick={() => handleNavigation('/admin/dashboard')}>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin Dashboard" />
                  </ListItem>
                )}
                
                <Divider />
                
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button onClick={() => handleNavigation('/login')}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                
                <ListItem button onClick={() => handleNavigation('/register')}>
                  <ListItemIcon>
                    <AppRegistrationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;