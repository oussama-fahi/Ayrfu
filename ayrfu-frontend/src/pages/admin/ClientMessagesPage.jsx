import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import DraftsIcon from '@mui/icons-material/Drafts';
import ReplyIcon from '@mui/icons-material/Reply';
import BusinessIcon from '@mui/icons-material/Business';

const ClientMessagesPage = () => {
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  useEffect(() => {
    // Simulate API call to get client messages
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          type: 'CLIENT',
          senderName: 'Sarah Davis',
          senderEmail: 'sarah.davis@company.com',
          senderPhone: '+1234567890',
          content: 'We are looking for a custom software solution for our inventory management. Can someone from your team get in touch with me to discuss the requirements?',
          sentAt: '2023-11-15T14:20:00',
          read: false
        },
        {
          id: 2,
          type: 'CLIENT',
          senderName: 'Robert Johnson',
          senderEmail: 'robert.johnson@enterprise.com',
          senderPhone: '+9876543210',
          content: 'We are interested in your IT consulting services. Our company is planning to migrate to the cloud, and we need expert advice.',
          sentAt: '2023-11-14T11:30:00',
          read: true
        },
        {
          id: 3,
          type: 'CLIENT',
          senderName: 'Emily Wilson',
          senderEmail: 'emily.wilson@startup.com',
          senderPhone: '+5551234567',
          content: 'I would like to know more about your mobile app development services. We have a startup and want to launch a mobile app for our service.',
          sentAt: '2023-11-12T16:45:00',
          read: false
        }
      ];
      
      setMessages(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const filteredMessages = tabValue === 0 
    ? messages 
    : tabValue === 1 
      ? messages.filter(message => !message.read)
      : messages.filter(message => message.read);
  
  const handleMarkAsRead = (id) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id ? { ...message, read: true } : message
      )
    );
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prevMessages => 
        prevMessages.filter(message => message.id !== id)
      );
    }
  };
  
  const handleOpenReplyDialog = (message) => {
    setSelectedMessage(message);
    setReplyDialogOpen(true);
  };
  
  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setReplyText('');
    setSelectedMessage(null);
  };
  
  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };
  
  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    setSendingReply(true);
    
    // Simulate sending reply
    setTimeout(() => {
      setSendingReply(false);
      handleCloseReplyDialog();
      // Show success notification or toast here
    }, 1500);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          sx={{ mr: 2 }} 
          onClick={() => navigate('/admin/dashboard')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Client Messages
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="All Messages" />
          <Tab 
            label={
              <>
                Unread 
                <Chip 
                  size="small" 
                  label={messages.filter(message => !message.read).length} 
                  sx={{ ml: 1 }}
                  color="secondary"
                />
              </>
            } 
          />
          <Tab label="Read" />
        </Tabs>
      </Paper>
      
      <Paper>
        {filteredMessages.length > 0 ? (
          <List>
            {filteredMessages.map((message, index) => (
              <React.Fragment key={message.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      {!message.read && (
                        <IconButton 
                          edge="end" 
                          aria-label="mark as read"
                          onClick={() => handleMarkAsRead(message.id)}
                          sx={{ mr: 1 }}
                        >
                          <DraftsIcon />
                        </IconButton>
                      )}
                      <IconButton 
                        edge="end" 
                        aria-label="reply"
                        onClick={() => handleOpenReplyDialog(message)}
                        sx={{ mr: 1 }}
                        color="secondary"
                      >
                        <ReplyIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDelete(message.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    bgcolor: message.read ? 'transparent' : 'rgba(46, 125, 50, 0.08)',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <BusinessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span" fontWeight="bold">
                          {message.senderName}
                        </Typography>
                        {!message.read && (
                          <Chip 
                            size="small" 
                            label="New" 
                            color="secondary" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {message.senderEmail} {message.senderPhone && `• ${message.senderPhone}`}
                        </Typography>
                        <Typography component="p" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {formatDate(message.sentAt)}
                        </Typography>
                        <Typography component="p" variant="body1" sx={{ mt: 1 }}>
                          {message.content}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <EmailIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No messages found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tabValue === 0 
                ? 'There are no client messages yet.' 
                : tabValue === 1 
                  ? 'You have no unread messages.' 
                  : 'You have no read messages.'}
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog}>
        <DialogTitle>
          Reply to {selectedMessage?.senderName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Original message: "{selectedMessage?.content}"
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={6}
            label="Your Reply"
            fullWidth
            variant="outlined"
            value={replyText}
            onChange={handleReplyTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>Cancel</Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained"
            color="secondary"
            disabled={!replyText.trim() || sendingReply}
            startIcon={sendingReply && <CircularProgress size={20} />}
          >
            {sendingReply ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientMessagesPage;