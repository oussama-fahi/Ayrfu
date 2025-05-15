import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  Chip,
  Badge,
  CircularProgress,
  Alert,
  InputAdornment,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { 
  fetchConversations, 
  fetchConversationDetails, 
  replyToConversation, 
  startNewConversation,
  markConversationAsRead
} from '../../redux/slices/messagesSlice';

const CandidateMessages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  
  const { 
    conversations, 
    currentConversation, 
    isLoading, 
    error,
    sendingMessage 
  } = useSelector((state) => state.messages);
  
  const { user } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;
    
    return (
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Load conversations on component mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Check if a specific conversation was requested in the location state
  useEffect(() => {
    if (location.state?.conversationId) {
      dispatch(fetchConversationDetails(location.state.conversationId));
    } else if (conversations.length > 0 && !currentConversation) {
      // Select the first conversation by default
      dispatch(fetchConversationDetails(conversations[0].id));
    }
  }, [dispatch, location.state, conversations, currentConversation]);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation]);

  // Mark current conversation as read when selected
  useEffect(() => {
    if (currentConversation?.id && currentConversation.unreadMessageCount > 0) {
      dispatch(markConversationAsRead(currentConversation.id));
    }
  }, [dispatch, currentConversation]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId) => {
    dispatch(fetchConversationDetails(conversationId));
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append('conversationId', currentConversation.id);
    formData.append('content', newMessage);
    
    if (file) {
      formData.append('file', file);
    }

    dispatch(replyToConversation(formData));
    setNewMessage('');
    setFile(null);
  };

  // Handle creating a new conversation
  const handleStartNewConversation = () => {
    if (!newConversationSubject.trim() || !newMessage.trim()) return;

    dispatch(startNewConversation({
      subject: newConversationSubject,
      initialMessage: newMessage
    }));

    setNewConversationSubject('');
    setNewMessage('');
    setShowNewConversation(false);
  };

  // Handle file attachment
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Handle removing attached file
  const handleRemoveFile = () => {
    setFile(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Messages</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper elevation={2}>
        <Grid container>
          {/* Conversation List Panel */}
          <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
                size="small"
                sx={{ mb: 2 }}
              />
              
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => setShowNewConversation(true)}
                sx={{ mb: 2 }}
              >
                New Conversation
              </Button>
            </Box>
            
            <Divider />
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="All" />
              <Tab label="Unread" />
              <Tab label="Closed" />
            </Tabs>
            
            {isLoading && !currentConversation ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : filteredConversations.length > 0 ? (
              <List sx={{ height: '60vh', overflow: 'auto' }}>
                {filteredConversations
                  .filter(conv => {
                    if (tabValue === 0) return true;
                    if (tabValue === 1) return conv.unreadMessageCount > 0;
                    if (tabValue === 2) return conv.closed;
                    return true;
                  })
                  .map((conversation) => (
                    <React.Fragment key={conversation.id}>
                      <ListItem
                        button
                        selected={currentConversation?.id === conversation.id}
                        onClick={() => handleSelectConversation(conversation.id)}
                        sx={{
                          bgcolor: conversation.unreadMessageCount > 0 ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                          '&.Mui-selected': {
                            bgcolor: 'rgba(25, 118, 210, 0.16) !important',
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="primary"
                            badgeContent={conversation.unreadMessageCount}
                            invisible={conversation.unreadMessageCount === 0}
                          >
                            <Avatar
                              alt={conversation.adminName || "Admin"}
                              sx={{ bgcolor: 'primary.main' }}
                            >
                              {conversation.adminName ? conversation.adminName[0].toUpperCase() : 'A'}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              noWrap 
                              fontWeight={conversation.unreadMessageCount > 0 ? 'bold' : 'normal'}
                            >
                              {conversation.subject}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                noWrap
                                sx={{
                                  display: 'inline-block',
                                  width: '100%',
                                  color: conversation.unreadMessageCount > 0 ? 'primary.main' : 'text.secondary'
                                }}
                              >
                                {conversation.messages && conversation.messages.length > 0 
                                  ? conversation.messages[conversation.messages.length - 1].content.substring(0, 30) + '...'
                                  : 'No messages yet'
                                }
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                <Typography component="span" variant="caption" color="text.secondary">
                                  {conversation.updatedAt && formatDate(conversation.updatedAt)}
                                </Typography>
                                {conversation.closed && (
                                  <Chip label="Closed" size="small" variant="outlined" sx={{ height: 20 }} />
                                )}
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {searchQuery ? 'No conversations found' : 'No conversations available'}
                </Typography>
              </Box>
            )}
          </Grid>
          
          {/* Message Content Panel */}
          <Grid item xs={12} md={8}>
            {showNewConversation ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">New Conversation</Typography>
                </Box>
                
                <Box sx={{ p: 2 }}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={newConversationSubject}
                    onChange={(e) => setNewConversationSubject(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={6}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </Box>
                
                <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    sx={{ mr: 2 }} 
                    onClick={() => setShowNewConversation(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!newConversationSubject.trim() || !newMessage.trim() || sendingMessage}
                    onClick={handleStartNewConversation}
                  >
                    {sendingMessage ? <CircularProgress size={24} color="inherit" /> : 'Send'}
                  </Button>
                </Box>
              </Box>
            ) : currentConversation ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
                {/* Conversation Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h6">{currentConversation.subject}</Typography>
                  {currentConversation.closed && (
                    <Chip label="Closed" size="small" sx={{ mt: 1 }} />
                  )}
                </Box>
                
                {/* Message List */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress color="primary" />
                    </Box>
                  ) : currentConversation.messages && currentConversation.messages.length > 0 ? (
                    <Box>
                      {currentConversation.messages.map((message, index) => {
                        const isCurrentUser = message.senderId === user.id;
                        const showDate = index === 0 || new Date(message.createdAt).toDateString() !== 
                          new Date(currentConversation.messages[index - 1].createdAt).toDateString();
                        
                        return (
                          <Box key={message.id}>
                            {showDate && (
                              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <Chip 
                                  label={new Date(message.createdAt).toLocaleDateString(undefined, {
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric'
                                  })} 
                                  color="primary" 
                                  variant="outlined" 
                                  size="small" 
                                />
                              </Box>
                            )}
                            
                            <Box 
                              sx={{ 
                                display: 'flex',
                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                mb: 2
                              }}
                            >
                              <Box 
                                sx={{ 
                                  maxWidth: '70%',
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
                                  color: isCurrentUser ? 'white' : 'inherit'
                                }}
                              >
                                <Typography variant="body1">{message.content}</Typography>
                                
                                {message.attachmentUrl && (
                                  <Box 
                                    sx={{ 
                                      mt: 1,
                                      p: 1,
                                      borderRadius: 1,
                                      bgcolor: isCurrentUser ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      cursor: 'pointer'
                                    }}
                                    component="a"
                                    href={message.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FileIcon fontSize="small" />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                      {message.attachmentName || 'Attachment'}
                                    </Typography>
                                  </Box>
                                )}
                                
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: 'block', 
                                    textAlign: 'right',
                                    mt: 0.5,
                                    opacity: 0.8
                                  }}
                                >
                                  {formatDate(message.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      <div ref={messageEndRef} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography color="text.secondary">No messages in this conversation. Start chatting!</Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Message Input */}
                {!currentConversation.closed && (
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    {file && (
                      <Box sx={{ 
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FileIcon fontSize="small" />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={handleRemoveFile} color="error">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Button component="label" sx={{ minWidth: 'unset' }}>
                          <AttachFileIcon />
                          <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                      </Grid>
                      
                      <Grid item xs>
                        <TextField
                          fullWidth
                          placeholder="Type your message..."
                          variant="outlined"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          multiline
                          maxRows={4}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<SendIcon />}
                          onClick={handleSendMessage}
                          disabled={sendingMessage || (!newMessage.trim() && !file)}
                        >
                          Send
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '70vh', 
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <EmailIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation to view messages
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowNewConversation(true)}
                    sx={{ mt: 2 }}
                  >
                    Start a New Conversation
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CandidateMessages;