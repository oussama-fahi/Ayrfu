import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Drafts as DraftsIcon,
  Email as EmailIcon,
  Reply as ReplyIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { 
  fetchAllMessages, 
  fetchMessagesByType,
  deleteMessage, 
  markMessageAsRead,
  resetMessageSent
} from '../../redux/slices/messagesSlice';
import { createConversation } from '../../redux/slices/conversationsSlice';

const AdminMessagesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [tabValue, setTabValue] = useState(0);
  const [messageType, setMessageType] = useState('CANDIDATE');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  
  const { isLoading, messages, error } = useSelector(state => state.messages);
  
  // Fetch messages when component mounts or message type changes
  useEffect(() => {
    dispatch(fetchMessagesByType(messageType));
  }, [dispatch, messageType]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessageType(newValue === 0 ? 'CANDIDATE' : 'CLIENT');
  };
  
  const handleMarkAsRead = (id) => {
    dispatch(markMessageAsRead(id));
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
  
  const handleOpenDeleteDialog = (message) => {
    setSelectedMessage(message);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedMessage(null);
  };
  
  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };
  
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    setSending(true);
    try {
      // Create a new conversation with the sender as recipient
      await dispatch(createConversation({
        subject: `Re: Message from ${selectedMessage.senderName}`,
        recipientId: selectedMessage.senderId,
        initialMessage: replyText
      })).unwrap();
      
      // Mark the original message as read
      await dispatch(markMessageAsRead(selectedMessage.id)).unwrap();
      
      handleCloseReplyDialog();
      dispatch(resetMessageSent());
      
      // Show success notification
      // You could add a notification system here
    } catch (error) {
      console.error('Error sending reply:', error);
      // Show error notification
    } finally {
      setSending(false);
    }
  };
  
  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    
    try {
      await dispatch(deleteMessage(selectedMessage.id)).unwrap();
      handleCloseDeleteDialog();
      
      // Show success notification
    } catch (error) {
      console.error('Error deleting message:', error);
      // Show error notification
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton sx={{ mr: 2 }} onClick={() => navigate('/admin/dashboard')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {messageType === 'CANDIDATE' ? 'Candidate Messages' : 'Client Messages'}
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Candidate Messages" />
          <Tab label="Client Messages" />
        </Tabs>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress color={messageType === 'CANDIDATE' ? 'primary' : 'secondary'} />
          </Box>
        ) : messages && messages.length > 0 ? (
          <List>
            {messages.map((message, index) => (
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
                        color={messageType === 'CANDIDATE' ? 'primary' : 'secondary'}
                      >
                        <ReplyIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleOpenDeleteDialog(message)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    bgcolor: message.read ? 'transparent' : 
                      messageType === 'CANDIDATE' 
                        ? 'rgba(25, 118, 210, 0.08)' 
                        : 'rgba(46, 125, 50, 0.08)',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: messageType === 'CANDIDATE' ? 'primary.main' : 'secondary.main' }}>
                      {messageType === 'CANDIDATE' ? <PersonIcon /> : <BusinessIcon />}
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
                            color={messageType === 'CANDIDATE' ? 'primary' : 'secondary'} 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {message.senderEmail}
                          {message.senderPhone && ` • ${message.senderPhone}`}
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
              {messageType === 'CANDIDATE' 
                ? 'There are no candidate messages yet.' 
                : 'There are no client messages yet.'}
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog} maxWidth="md" fullWidth>
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
          <Button onClick={handleCloseReplyDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            variant="contained"
            color={messageType === 'CANDIDATE' ? 'primary' : 'secondary'}
            disabled={!replyText.trim() || sending}
            startIcon={sending ? <CircularProgress size={20} /> : <ReplyIcon />}
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message from {selectedMessage?.senderName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button onClick={handleDeleteMessage} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMessagesPage;