import { ArrowBack as ArrowBackIcon, AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConversationDetails,
  fetchConversationMessages,
  markAllMessagesAsRead,
  sendMessage
} from '../../redux/slices/conversationsSlice';

const ConversationDetail = ({ conversationId, onBack }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    currentConversation, 
    currentMessages, 
    isLoading, 
    error 
  } = useSelector(state => state.conversations);
  
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationDetails(conversationId));
      dispatch(fetchConversationMessages(conversationId));
      
      // Mark messages as read when opening the conversation
      dispatch(markAllMessagesAsRead(conversationId));
    }
  }, [dispatch, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('message', message);
      if (file) {
        formData.append('attachment', file);
      }

      await dispatch(sendMessage({ conversationId, formData })).unwrap();
      setMessage('');
      setFile(null);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  if (!conversationId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        p: 3 
      }}>
        <Typography variant="body1" color="text.secondary">
          Select a conversation to view messages
        </Typography>
      </Box>
    );
  }

  if (isLoading && !currentMessages.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        p: 3 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%' 
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        {onBack && (
          <IconButton 
            color="inherit" 
            onClick={onBack} 
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6">
          {currentConversation?.subject || 'Conversation'}
        </Typography>
      </Box>

      {/* Messages container */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {currentMessages.map((msg) => {
          const isCurrentUser = msg.senderId === user?.id;
          
          return (
            <Box 
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box sx={{
                maxWidth: '70%',
                p: 2,
                borderRadius: 2,
                bgcolor: isCurrentUser ? 'primary.light' : 'grey.100',
                color: isCurrentUser ? 'white' : 'inherit'
              }}>
                {!isCurrentUser && (
                  <Typography variant="subtitle2" gutterBottom>
                    {msg.senderName}
                  </Typography>
                )}
                <Typography variant="body1">
                  {msg.content}
                </Typography>
                {msg.attachment && (
                  <Box 
                    component="a"
                    href={msg.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
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
                  >
                    <AttachFileIcon fontSize="small" />
                    <Typography variant="body2">
                      {msg.attachment.fileName || 'Attachment'}
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
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message input */}
      <Box 
        component="form"
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderTop: 1, 
          borderColor: 'divider'
        }}
      >
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
              <AttachFileIcon fontSize="small" />
              <Typography variant="body2" sx={{
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {file.name}
              </Typography>
            </Box>
            <Button 
              size="small" 
              color="error" 
              onClick={handleRemoveFile}
            >
              Remove
            </Button>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<AttachFileIcon />}
          >
            Attach
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            size="small"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            multiline
            maxRows={4}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={isSending || (!message.trim() && !file)}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationDetail;