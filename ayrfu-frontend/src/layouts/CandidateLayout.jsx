// src/layouts/CandidateLayout.jsx
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
  useTheme,
  Badge,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';

import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

// Import UDDAN logo
import UddanLogo from '../assets/images/uddan-logo.svg';

const CandidateLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Check for unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/messages/unread/candidate', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadMessages(response.data.length);
      } catch (err) {
        console.error('Error fetching unread messages:', err);
      }
    };

    fetchUnreadMessages();
    // Set up a periodic fetch every 2 minutes
    const interval = setInterval(fetchUnreadMessages, 120000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="primary">
        <Container maxWidth="xl">
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
            
            <Box
              component={RouterLink}
              to="/candidate/dashboard"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'white',
                flexGrow: 1
              }}
            >
              <img src={UddanLogo} alt="UDDAN Logo" height="30" />
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Candidate Portal
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex' }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/candidate/dashboard"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/candidate/applications"
                  startIcon={<ListAltIcon />}
                >
                  My Applications
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/positions"
                  startIcon={<WorkIcon />}
                >
                  Browse Jobs
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/candidate/messages"
                  startIcon={
                    <Badge badgeContent={unreadMessages} color="error">
                      <EmailIcon />
                    </Badge>
                  }
                >
                  Messages
                </Button>
                
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
              </Box>
            )}

            {/* User Account Menu */}
            <Menu
              id="account-menu"
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={handleAccountMenuClose}
              PaperProps={{
                elevation: 3,
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
              <MenuItem onClick={() => {
                handleAccountMenuClose();
                navigate('/user/profile');
              }}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={() => {
                handleAccountMenuClose();
                navigate('/');
              }}>
                <ListItemIcon>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Main Website" />
              </MenuItem>
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
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
          }
        }}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <img src={UddanLogo} alt="UDDAN Logo" height="30" />
            <Typography variant="h6" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
              Candidate Portal
            </Typography>
          </Box>
          
          <List>
            <ListItem
              button
              onClick={() => handleNavigation('/candidate/dashboard')}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            
            <ListItem
              button
              onClick={() => handleNavigation('/candidate/applications')}
            >
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="My Applications" />
            </ListItem>
            
            <ListItem
              button
              onClick={() => handleNavigation('/positions')}
            >
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Browse Jobs" />
            </ListItem>
            
            <ListItem
              button
              onClick={() => handleNavigation('/candidate/messages')}
            >
              <ListItemIcon>
                <Badge badgeContent={unreadMessages} color="error">
                  <EmailIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            
            <Divider />
            
            <ListItem
              button
              onClick={() => handleNavigation('/user/profile')}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            
            <ListItem
              button
              onClick={() => handleNavigation('/')}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Main Website" />
            </ListItem>
            
            <ListItem
              button
              onClick={handleLogout}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 8, sm: 10 }, pb: 4 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default CandidateLayout;