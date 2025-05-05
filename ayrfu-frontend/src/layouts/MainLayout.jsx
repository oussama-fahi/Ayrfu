// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Menu, 
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication on page load and location change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);
  
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
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Close menu
    handleAccountMenuClose();
    // Update authentication state
    setIsAuthenticated(false);
    // Redirect to home
    navigate('/');
  };
  
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
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            AYRFU
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {mainNavItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ mx: 1 }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
              
              {/* Always show profile or login button */}
              {isAuthenticated ? (
                <Button 
                  color="inherit"
                  startIcon={<AccountCircleIcon />}
                  onClick={handleAccountMenuOpen}
                  sx={{ ml: 2 }}
                >
                  My Profile
                </Button>
              ) : (
                <Button 
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
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
            
            <MenuItem onClick={() => { 
              handleAccountMenuClose(); 
              navigate('/user/applications'); 
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Applications" />
            </MenuItem>
            
            <MenuItem onClick={() => { 
              handleAccountMenuClose(); 
              navigate('/admin/dashboard'); 
            }}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </MenuItem>
            
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
                
                <ListItem button onClick={() => handleNavigation('/user/applications')}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Applications" />
                </ListItem>
                
                <ListItem button onClick={() => handleNavigation('/admin/dashboard')}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
                
                <Divider />
                
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <ListItem button onClick={() => handleNavigation('/login')}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
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