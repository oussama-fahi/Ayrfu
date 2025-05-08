import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  CircularProgress,
  useMediaQuery,
  useTheme,
  ListSubheader,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  MiscellaneousServices as MiscellaneousServicesIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as AccountCircleIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Person as PersonIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// Import UDDAN logo
import UddanLogo from '../assets/images/uddan-logo.svg';

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  
  // Expandable menu states
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  
  // Count unread messages by type
  const [unreadCandidateMessages, setUnreadCandidateMessages] = useState(0);
  const [unreadClientMessages, setUnreadClientMessages] = useState(0);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Check if user has admin or super_user role
        const isAdminUser = user && hasRole && (hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_USER'));
        if (!isAdminUser) {
          // Redirect to home if not admin or super user
          navigate('/');
          return;
        }

        // Fetch unread messages count
        try {
          // Fetch unread candidate messages
          const candidateResponse = await axios.get('/api/messages/unread/type/CANDIDATE', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUnreadCandidateMessages(candidateResponse.data.length);
        } catch (err) {
          console.error('Error fetching candidate messages:', err);
          setUnreadCandidateMessages(0);
        }

        try {
          // Fetch unread client messages
          const clientResponse = await axios.get('/api/messages/unread/type/CLIENT', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUnreadClientMessages(clientResponse.data.length);
        } catch (err) {
          console.error('Error fetching client messages:', err);
          setUnreadClientMessages(0);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // If 401 unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, user, hasRole]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMessages = () => {
    setMessagesOpen(!messagesOpen);
  };

  const toggleUsers = () => {
    setUsersOpen(!usersOpen);
  };

  const isAdmin = user && hasRole && hasRole('ROLE_ADMIN');
  const isSuperUser = user && hasRole && hasRole('ROLE_SUPER_USER');

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <img src={UddanLogo} alt="UDDAN Logo" height="30" />
          <Typography variant="h6" noWrap component="div" sx={{ ml: 1, fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
        </Box>
        {user && (
          <Typography variant="body2" color="text.secondary">
            {user.fullName || user.email}
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItem button onClick={() => handleNavigation('/admin/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem button onClick={() => handleNavigation('/admin/positions')}>
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Positions" />
        </ListItem>
        
        <ListItem button onClick={() => handleNavigation('/admin/services')}>
          <ListItemIcon>
            <MiscellaneousServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItem>
      </List>
      
      <Divider />
      
      {/* Messages section with dropdown */}
      <List component="nav">
        <ListItem button onClick={toggleMessages}>
          <ListItemIcon>
            <Badge badgeContent={unreadCandidateMessages + unreadClientMessages} color="error">
              <EmailIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Messages" />
          {messagesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={messagesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              onClick={() => handleNavigation('/admin/messages/candidates')}
            >
              <ListItemIcon>
                <Badge badgeContent={unreadCandidateMessages} color="error">
                  <PersonIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Candidate Messages" />
            </ListItem>
            
            <ListItem 
              button 
              sx={{ pl: 4 }} 
              onClick={() => handleNavigation('/admin/messages/clients')}
            >
              <ListItemIcon>
                <Badge badgeContent={unreadClientMessages} color="error">
                  <BusinessIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Client Messages" />
            </ListItem>
          </List>
        </Collapse>
      </List>
      
      {/* User Management section - only for admins */}
      {(isAdmin || isSuperUser) && (
        <>
          <Divider />
          <List component="nav">
            <ListItem button onClick={toggleUsers}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
              {usersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem 
                  button 
                  sx={{ pl: 4 }} 
                  onClick={() => handleNavigation('/admin/users')}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
                
                {/* Only Super Users can manage admin users */}
                {isSuperUser && (
                  <ListItem 
                    button 
                    sx={{ pl: 4 }} 
                    onClick={() => handleNavigation('/admin/admins')}
                  >
                    <ListItemIcon>
                      <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Administrators" />
                  </ListItem>
                )}
              </List>
            </Collapse>
          </List>
        </>
      )}
      
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Back to Site" />
        </ListItem>
        
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            UDDAN Admin Panel
          </Typography>
          
          <IconButton color="inherit" onClick={handleAccountMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </Avatar>
          </IconButton>
          
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
            
            <Divider />
            
            <MenuItem onClick={() => {
              handleAccountMenuClose();
              navigate('/');
            }}>
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Back to Site" />
            </MenuItem>
            
            <MenuItem onClick={() => {
              handleAccountMenuClose();
              handleLogout();
            }}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* This is for spacing below the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;