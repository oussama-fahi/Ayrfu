import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import ConversationList from '../../components/messaging/ConversationList';
import ConversationDetail from '../../components/messaging/ConversationDetail';
import { fetchConversations } from '../../redux/slices/conversationsSlice';

const ClientMessagesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useAuth();
  const { conversations, isLoading, error } = useSelector((state) => state.conversations);
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  useEffect(() => {
    // Fetch conversations when component mounts
    dispatch(fetchConversations());
  }, [dispatch]);
  
  // If a specific message is selected through state navigation
  useEffect(() => {
    if (location.state?.selectedConversation) {
      const conversationId = location.state.selectedConversation;
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [location, conversations]);
  
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowMobileDetail(true);
    }
  };
  
  const handleBackToList = () => {
    setShowMobileDetail(false);
  };
  
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your messages.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Messages</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: { xs: 'calc(100vh - 180px)', md: 700 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#fff'
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Conversation List - Hide on mobile when viewing a conversation */}
          {(!isMobile || !showMobileDetail) && (
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <ConversationList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </Grid>
          )}
          
          {/* Conversation Detail - Full width on mobile, hide when showing list */}
          {(!isMobile || showMobileDetail) && (
            <Grid
              item
              xs={12}
              md={8}
              sx={{ height: '100%' }}
            >
              <ConversationDetail 
                conversationId={selectedConversation?.id} 
                onBack={isMobile ? handleBackToList : undefined}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ClientMessagesPage;