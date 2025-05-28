// src/layouts/ClientLayout.jsx
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
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
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';

// Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { fetchUnreadCount } from '../redux/slices/conversationsSlice';

// Import UDDAN logo
import UddanLogo from '../assets/images/uddan-logo.svg';

const ClientLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, logout } = useAuth();
  const { unreadCount } = useSelector(state => state.messages);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  
  // Submenu states
  const [servicesOpen, setServicesOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

  // Check for unread messages
  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    // Set up periodic fetch every 2 minutes
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 120000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

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
  
  const toggleServicesMenu = () => {
    setServicesOpen(!servicesOpen);
  };
  
  const toggleDocumentsMenu = () => {
    setDocumentsOpen(!documentsOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="secondary">
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
              to="/client/dashboard"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'white',
                flexGrow: 1
              }}
            >
              <img src={UddanLogo} alt="UDDAN Logo" height="30" />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                Client Portal
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex' }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/client/dashboard"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/client/services"
                  startIcon={<MiscellaneousServicesIcon />}
                >
                  Services
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/client/requests"
                  startIcon={<RequestQuoteIcon />}
                >
                  Requests
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/client/documents"
                  startIcon={<FolderIcon />}
                >
                  Documents
                </Button>
                
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/client/messages"
                  startIcon={
                    <Badge badgeContent={unreadCount} color="error">
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
                        bgcolor: 'secondary.dark'
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
              <MenuItem
                onClick={() => {
                  handleAccountMenuClose();
                  navigate('/user/profile');
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              
              <Divider />
              
              <MenuItem
                onClick={() => {
                  handleAccountMenuClose();
                  navigate('/');
                }}
              >
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
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.08)'
          }}>
            <img src={UddanLogo} alt="UDDAN Logo" height="30" />
            <Typography variant="h6" color="secondary" sx={{ ml: 1, fontWeight: 'bold' }}>
              Client Portal
            </Typography>
          </Box>
          
          <List>
            <ListItem button onClick={() => handleNavigation('/client/dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            
            {/* Services submenu */}
            <ListItem button onClick={toggleServicesMenu}>
              <ListItemIcon>
                <MiscellaneousServicesIcon />
              </ListItemIcon>
              <ListItemText primary="Services" />
              {servicesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            
            <Collapse in={servicesOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigation('/client/services')}>
                  <ListItemText primary="Browse Services" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigation('/client/requests')}>
                  <ListItemIcon>
                    <RequestQuoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Requests" />
                </ListItem>
              </List>
            </Collapse>
            
            {/* Documents submenu */}
            <ListItem button onClick={toggleDocumentsMenu}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Documents" />
              {documentsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            
            <Collapse in={documentsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigation('/client/documents')}>
                  <ListItemText primary="All Documents" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigation('/client/documents/upload')}>
                  <ListItemText primary="Upload Document" />
                </ListItem>
              </List>
            </Collapse>
            
            <ListItem button onClick={() => handleNavigation('/client/messages')}>
              <ListItemIcon>
                <Badge badgeContent={unreadCount} color="error">
                  <EmailIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            
            <Divider />
            
            <ListItem button onClick={() => handleNavigation('/user/profile')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Main Website" />
            </ListItem>
            
            <ListItem button onClick={handleLogout}>
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

export default ClientLayout;