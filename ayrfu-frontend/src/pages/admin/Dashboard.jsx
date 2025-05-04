import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Work as WorkIcon, 
  MiscellaneousServices as ServiceIcon, 
  Email as EmailIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchActivePositions } from '../../redux/slices/positionsSlice';
import { fetchActiveServices } from '../../redux/slices/servicesSlice';
import { fetchUnreadMessagesByType } from '../../redux/slices/messagesSlice';

const StatCard = ({ icon, title, value, color, loading, onClick }) => (
  <Card 
    sx={{ 
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': onClick ? { transform: 'translateY(-5px)' } : {}
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            borderRadius: '50%',
            p: 1,
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h3" component="div" align="center" sx={{ my: 2 }}>
        {loading ? <CircularProgress size={40} /> : value}
      </Typography>
    </CardContent>
  </Card>
);

const ActionCard = ({ icon, title, description, buttonText, path, color }) => {
  const navigate = useNavigate();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              p: 1,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button 
          variant="contained" 
          color={color}
          startIcon={<AddIcon />}
          fullWidth
          onClick={() => navigate(path)}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { positions, isLoading: positionsLoading } = useSelector((state) => state.positions);
  const { services, isLoading: servicesLoading } = useSelector((state) => state.services);
  const { unreadMessages, isLoading: messagesLoading } = useSelector((state) => state.messages);
  
  // Calculate counts
  const activePositionsCount = positions.filter(p => p.active).length;
  const activeServicesCount = services.filter(s => s.active).length;
  const unreadCandidateMessagesCount = unreadMessages.filter(m => m.type === 'CANDIDATE').length;
  const unreadClientMessagesCount = unreadMessages.filter(m => m.type === 'CLIENT').length;
  
  useEffect(() => {
    // Fetch dashboard data
    dispatch(fetchActivePositions());
    dispatch(fetchActiveServices());
    dispatch(fetchUnreadMessagesByType('CANDIDATE'));
    dispatch(fetchUnreadMessagesByType('CLIENT'));
  }, [dispatch]);
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.fullName || 'User'}! Here's what's happening today.
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<WorkIcon />}
            title="Active Positions"
            value={activePositionsCount}
            color="primary"
            loading={positionsLoading}
            onClick={() => navigate('/admin/positions')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ServiceIcon />}
            title="Active Services"
            value={activeServicesCount}
            color="secondary"
            loading={servicesLoading}
            onClick={() => navigate('/admin/services')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PersonIcon />}
            title="Candidate Messages"
            value={unreadCandidateMessagesCount}
            color="success"
            loading={messagesLoading}
            onClick={() => navigate('/admin/messages/candidates')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BusinessIcon />}
            title="Client Messages"
            value={unreadClientMessagesCount}
            color="warning"
            loading={messagesLoading}
            onClick={() => navigate('/admin/messages/clients')}
          />
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            icon={<WorkIcon />}
            title="Position Management"
            description="Create a new job position, update existing ones, or manage their status."
            buttonText="Create New Position"
            path="/admin/positions/create"
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            icon={<ServiceIcon />}
            title="Service Management"
            description="Add a new service, update existing services, or manage their availability."
            buttonText="Create New Service"
            path="/admin/services/create"
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            icon={<EmailIcon />}
            title="Message Management"
            description="Check and respond to messages from candidates and clients."
            buttonText="View Messages"
            path="/admin/messages/candidates"
            color="info"
          />
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          System Overview
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">System Status</Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  bgcolor: 'success.light', 
                  color: 'success.dark',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                Operational
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Database Status</Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  bgcolor: 'success.light', 
                  color: 'success.dark',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                Connected
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Last Update</Typography>
              <Typography variant="body2">
                {new Date().toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">System Version</Typography>
              <Typography variant="body2">1.0.0</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;