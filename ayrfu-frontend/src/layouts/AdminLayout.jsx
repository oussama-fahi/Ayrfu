// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Divider,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  
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
        const response = await axios.get('/ayrfu/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserData(response.data);
        
        // Check if user has admin or super_user role
        const hasAdminRole = response.data.roles && response.data.roles.some(role => {
          const roleName = typeof role === 'string' ? role : role.name;
          return roleName === 'ADMIN' || roleName === 'SUPER_USER';
        });
        
        if (!hasAdminRole) {
          // Redirect to home if not admin
          navigate('/');
          return;
        }
        
        // Fetch unread messages count
        try {
          // Fetch unread candidate messages
          const candidateResponse = await axios.get('/ayrfu/api/messages/unread/type/CANDIDATE', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUnreadCandidateMessages(candidateResponse.data.length);
        } catch (err) {
          console.error('Error fetching candidate messages:', err);
          setUnreadCandidateMessages(0);
        }
        
        try {
          // Fetch unread client messages
          const clientResponse = await axios.get('/ayrfu/api/messages/unread/type/CLIENT', {
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
  }, [navigate]);
  
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
    localStorage.removeItem('token');
    navigate('/');
  };
  
  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        py: 2
      }}>
        <Typography variant="h6" noWrap component="div">
          AYRFU Admin
        </Typography>
        {userData && (
          <Typography variant="body2" color="text.secondary">
            {userData.fullName || userData.email}
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List>
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
      <List>
        <ListItem button onClick={() => handleNavigation('/admin/messages/candidates')}>
          <ListItemIcon>
            <Badge badgeContent={unreadCandidateMessages} color="error">
              <EmailIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Candidate Messages" />
        </ListItem>
        
        <ListItem button onClick={() => handleNavigation('/admin/messages/clients')}>
          <ListItemIcon>
            <Badge badgeContent={unreadClientMessages} color="error">
              <BusinessIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Client Messages" />
        </ListItem>
      </List>
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
            AYRFU Admin Panel
          </Typography>
          
          <IconButton
            color="inherit"
            onClick={handleAccountMenuOpen}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'secondary.main',
                fontSize: '0.875rem'
              }}
            >
              {userData?.fullName ? userData.fullName[0].toUpperCase() : 'A'}
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