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
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import DraftsIcon from '@mui/icons-material/Drafts';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const AdminCandidateMessagesPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch candidate messages
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/messages/type/CANDIDATE', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
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
    // Mark message as read
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id ? { ...message, read: true } : message
      )
    );

    // API call to update message read status
    const token = localStorage.getItem('token');
    axios.post('/api/messages/mark-read', 
      { messageIds: [id] },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(err => {
      console.error('Error marking message as read:', err);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      // API call to delete message
      const token = localStorage.getItem('token');
      axios.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setMessages(prevMessages => 
            prevMessages.filter(message => message.id !== id)
          );
        })
        .catch(err => {
          console.error('Error deleting message:', err);
          alert('Failed to delete message. Please try again.');
        });
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

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    
    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/messages/reply', {
        to: selectedMessage.senderEmail,
        subject: `Re: Candidate Message from ${selectedMessage.senderName}`,
        content: replyText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      handleCloseReplyDialog();
      // Show success toast or notification here
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
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
        <IconButton sx={{ mr: 2 }} onClick={() => navigate('/admin/dashboard')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Candidate Messages
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
                  color="primary"
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
                        color="primary"
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
                    bgcolor: message.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span" fontWeight="bold">
                          {message.senderName}
                        </Typography>
                        {!message.read && (
                          <Chip size="small" label="New" color="primary" sx={{ ml: 1 }} />
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
                ? 'There are no candidate messages yet.' 
                : tabValue === 1 
                  ? 'You have no unread messages.' 
                  : 'You have no read messages.'
              }
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Reply Dialog */}
      <Dialog 
        open={replyDialogOpen} 
        onClose={handleCloseReplyDialog}
      >
        <DialogTitle>Reply to {selectedMessage?.senderName}</DialogTitle>
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
          <Button onClick={handleCloseReplyDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained"
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

export default AdminCandidateMessagesPage;