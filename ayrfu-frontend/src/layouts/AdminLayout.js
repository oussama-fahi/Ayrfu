import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Badge 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../redux/slices/authSlice';
import { fetchUnreadMessagesByType } from '../redux/slices/messagesSlice';

const drawerWidth = 240;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadMessages } = useSelector((state) => state.messages);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Count unread messages by type
  const unreadCandidateMessages = unreadMessages.filter(msg => msg.type === 'CANDIDATE').length;
  const unreadClientMessages = unreadMessages.filter(msg => msg.type === 'CLIENT').length;
  
  React.useEffect(() => {
    // Fetch unread messages when component mounts
    dispatch(fetchUnreadMessagesByType('CANDIDATE'));
    dispatch(fetchUnreadMessagesByType('CLIENT'));
    
    // Set up polling for new messages
    const interval = setInterval(() => {
      dispatch(fetchUnreadMessagesByType('CANDIDATE'));
      dispatch(fetchUnreadMessagesByType('CLIENT'));
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
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
          UDDAN Admin
        </Typography>
        {user && (
          <Typography variant="body2" color="text.secondary">
            {user.fullName}
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
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
  
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
          <Typography variant="h6" noWrap component="div">
            AYRFU Admin Panel
          </Typography>
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