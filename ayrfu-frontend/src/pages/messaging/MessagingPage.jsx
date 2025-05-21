import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import ConversationList from '../../components/messaging/ConversationList';
import ConversationDetail from '../../components/messaging/ConversationDetail';

const MessagingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowMobileDetail(true);
    }
  };
  
  const handleBackToList = () => {
    setShowMobileDetail(false);
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      
      <Paper
        elevation={3}
        sx={{
          height: { xs: 'calc(100vh - 180px)', md: 700 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
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
              {/* Mobile back button */}
              {isMobile && showMobileDetail && (
                <Box
                  sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <IconButton onClick={handleBackToList}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Back to Messages
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ height: isMobile && showMobileDetail ? 'calc(100% - 48px)' : '100%' }}>
                <ConversationDetail conversationId={selectedConversation?.id} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default MessagingPage;