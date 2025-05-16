// src/pages/client/ClientMessagesPage.jsx
import {
  AttachFile as AttachFileIcon,
  Clear as ClearIcon,
  InsertDriveFile as FileIcon,
  Search as SearchIcon,
  Send as SendIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ClientMessagesPage = () => {
  const location = useLocation();
  const theme = useTheme();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchConversations();
  }, []);
  
  useEffect(() => {
    if (location.state?.selectedMessage) {
      const messageId = location.state.selectedMessage;
      // Trouver la conversation contenant ce message
      fetchMessageDetails(messageId);
    }
  }, [location]);
  
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/conversations/client', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConversations(response.data);
      
      // Sélectionner la première conversation si aucune n'est sélectionnée
      if (response.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des conversations:', err);
      setError('Impossible de charger les conversations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMessageDetails = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.conversationId) {
        // Trouver ou charger la conversation
        await fetchConversationById(response.data.conversationId);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails du message:', err);
    }
  };
  
  const fetchConversationById = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        // Mettre à jour les conversations si nécessaire
        const exists = conversations.some(conv => conv.id === response.data.id);
        if (!exists) {
          setConversations([...conversations, response.data]);
        }
        
        // Sélectionner cette conversation
        setSelectedConversation(response.data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de la conversation:', err);
    }
  };
  
  const fetchMessages = async (conversationId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(response.data);
      
      // Marquer les messages non lus comme lus
      const unreadMessages = response.data.filter(msg => 
        !msg.read && msg.senderId !== user.id
      );
      
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages.map(msg => msg.id));
        // Mettre à jour le compteur de messages non lus dans la liste des conversations
        updateConversationUnreadCount(conversationId);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
      setError('Impossible de charger les messages. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const markMessagesAsRead = async (messageIds) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/messages/mark-read', { messageIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Erreur lors du marquage des messages comme lus:', err);
    }
  };
  
  const updateConversationUnreadCount = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
  };
  
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };
  
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !attachedFile) || !selectedConversation) return;
    
    setSendingMessage(true);
    
    try {
      const token = localStorage.getItem('token');
      
      let response;
      
      if (attachedFile) {
        // Si un fichier est attaché, utiliser FormData
        const formData = new FormData();
        formData.append('content', newMessage);
        formData.append('conversationId', selectedConversation.id);
        formData.append('file', attachedFile);
        
        response = await axios.post('/api/messages/send-with-attachment', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Sinon, envoyer un message normal
        response = await axios.post('/api/messages/send', {
          content: newMessage,
          conversationId: selectedConversation.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Ajouter le nouveau message à la liste
      setMessages([...messages, response.data]);
      setNewMessage('');
      setAttachedFile(null);
      
      // Mettre à jour la liste des conversations (placer cette conversation en haut)
      updateConversationOrder(selectedConversation.id, response.data);
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const updateConversationOrder = (conversationId, newMessage) => {
    setConversations(prevConversations => {
      // Trouver et mettre à jour la conversation
      const updatedConversations = prevConversations.filter(conv => conv.id !== conversationId);
      const conversationToUpdate = prevConversations.find(conv => conv.id === conversationId);
      
      if (conversationToUpdate) {
        const updatedConversation = {
          ...conversationToUpdate,
          lastMessage: newMessage.content,
          lastMessageDate: newMessage.sentAt
        };
        
        // Placer la conversation mise à jour en haut
        return [updatedConversation, ...updatedConversations];
      }
      
      return prevConversations;
    });
  };
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAttachedFile(event.target.files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    setAttachedFile(null);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
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
  
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;
    
    return (
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Messages</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2}>
        <Grid container>
          {/* Liste des conversations */}
          <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher..."
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
            </Box>
            
            <Divider />
            
            {loading && !selectedConversation ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress color="secondary" />
              </Box>
            ) : filteredConversations.length > 0 ? (
              <List sx={{ height: '70vh', overflow: 'auto' }}>
                {filteredConversations.map((conversation) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem
                      button
                      selected={selectedConversation?.id === conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      sx={{
                        bgcolor: conversation.unreadCount > 0 ? 'rgba(46, 125, 50, 0.08)' : 'transparent',
                        '&.Mui-selected': {
                          bgcolor: 'rgba(46, 125, 50, 0.16) !important',
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="secondary"
                          badgeContent={conversation.unreadCount}
                          invisible={conversation.unreadCount === 0}
                        >
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {conversation.title[0].toUpperCase()}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={conversation.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                display: 'inline',
                                color: conversation.unreadCount > 0 ? 'secondary.main' : 'text.secondary'
                              }}
                            >
                              {conversation.lastMessage && conversation.lastMessage.length > 30
                                ? `${conversation.lastMessage.substring(0, 30)}...`
                                : conversation.lastMessage}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {conversation.lastMessageDate && formatDate(conversation.lastMessageDate)}
                            </Typography>
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
                  {searchQuery
                    ? 'Aucune conversation trouvée'
                    : 'Aucune conversation disponible'}
                </Typography>
              </Box>
            )}
          </Grid>
          
          {/* Fenêtre de messages */}
          <Grid item xs={12} md={8}>
            {selectedConversation ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
                {/* En-tête de la conversation */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'secondary.light',
                    color: 'white'
                  }}
                >
                  <Typography variant="h6">{selectedConversation.title}</Typography>
                </Box>
                
                {/* Corps des messages */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress color="secondary" />
                    </Box>
                  ) : messages.length > 0 ? (
                    <Box>
                      {messages.map((message, index) => {
                        const isCurrentUser = message.senderId === user.id;
                        const showDate = index === 0 || new Date(message.sentAt).toDateString() !== new Date(messages[index - 1].sentAt).toDateString();
                        
                        return (
                          <Box key={message.id}>
                            {showDate && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  my: 2
                                }}
                              >
                                <Chip
                                  label={new Date(message.sentAt).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                  color="secondary"
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
                                  bgcolor: isCurrentUser ? 'secondary.light' : 'grey.100',
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
                                      textDecoration: 'none',
                                      color: 'inherit'
                                    }}
                                    component="a"
                                    href={message.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FileIcon fontSize="small" />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                      {message.attachmentName || 'Pièce jointe'}
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
                                  {new Date(message.sentAt).toLocaleTimeString(undefined, {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      <Typography color="text.secondary">
                        Aucun message dans cette conversation. Commencez à discuter !
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Zone de saisie */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                  }}
                >
                  {attachedFile && (
                    <Box
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileIcon fontSize="small" />
                        <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {attachedFile.name}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={handleRemoveFile} color="error">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Button
                        component="label"
                        sx={{ minWidth: 'unset' }}
                      >
                        <AttachFileIcon />
                        <input type="file" hidden onChange={handleFileChange} />
                      </Button>
                    </Grid>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Tapez votre message..."
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
                        color="secondary"
                        endIcon={<SendIcon />}
                        onClick={handleSendMessage}
                        disabled={sendingMessage || (!newMessage.trim() && !attachedFile)}
                      >
                        Envoyer
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80vh',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Sélectionnez une conversation pour afficher les messages
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ClientMessagesPage;