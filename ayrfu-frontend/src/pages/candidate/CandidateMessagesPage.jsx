import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { 
  Box, Container, Grid, Paper, Typography, 
  useMediaQuery, useTheme 
} from '@mui/material';
import ConversationList from '../../components/messaging/ConversationList';
import ConversationDetail from '../../components/messaging/ConversationDetail';
import CreateConversationModal from '../../components/messaging/CreateConversationModal';
import { 
  fetchConversations,
  fetchUnreadCount 
} from '../../redux/slices/conversationsSlice';

const CandidateMessagesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(!isMobile);
  
  const { isLoading, error } = useSelector(state => state.conversations);

  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
    
    // Set up periodic refresh for unread count
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    // Handle selected message from navigation state
    if (location.state?.selectedConversationId) {
      setSelectedConversationId(location.state.selectedConversationId);
      setShowDetail(true);
    }
  }, [location]);

  useEffect(() => {
    // When on mobile, show either list or detail
    if (isMobile) {
      setShowDetail(!!selectedConversationId);
    } else {
      setShowDetail(true);
    }
  }, [isMobile, selectedConversationId]);

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowDetail(false);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateSuccess = (newConversationId) => {
    setModalOpen(false);
    setSelectedConversationId(newConversationId);
    setShowDetail(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      
      <Paper elevation={2} sx={{ height: '80vh', overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Conversation List */}
          {(!isMobile || !showDetail) && (
            <Grid item xs={12} md={4} sx={{ 
              height: '100%',
              borderRight: 1,
              borderColor: 'divider'
            }}>
              <ConversationList 
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleOpenModal}
              />
            </Grid>
          )}
          
          {/* Conversation Detail */}
          {(!isMobile || showDetail) && (
            <Grid item xs={12} md={8} sx={{ height: '100%' }}>
              <ConversationDetail 
                conversationId={selectedConversationId}
                onBack={isMobile ? handleBackToList : undefined}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Create Conversation Modal */}
      <CreateConversationModal 
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCreateSuccess}
      />
    </Container>
  );
};

export default CandidateMessagesPage;