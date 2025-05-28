import {
  Add as AddIcon,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../redux/slices/conversationsSlice';
import CreateConversationModal from './CreateConversationModal';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const dispatch = useDispatch();
  const { conversations, isLoading, error } = useSelector((state) => state.conversations);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Fixed: Pass the conversation ID instead of the whole object
  const handleSelectConversation = (conversation) => {
    onSelectConversation(conversation.id);
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    dispatch(fetchConversations());
  };

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
      });
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      conversation.subject?.toLowerCase().includes(searchLower) ||
      conversation.recipient?.fullName?.toLowerCase().includes(searchLower) ||
      conversation.initiator?.fullName?.toLowerCase().includes(searchLower) ||
      conversation.lastMessage?.content?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          fullWidth
        >
          New Conversation
        </Button>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      </Box>

      <Divider />

      {isLoading && conversations.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            onClick={() => dispatch(fetchConversations())}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Box>
      ) : filteredConversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {searchTerm
              ? 'No conversations match your search'
              : 'No conversations found'}
          </Typography>
          {searchTerm && (
            <Button
              onClick={handleClearSearch}
              sx={{ mt: 1 }}
            >
              Clear Search
            </Button>
          )}
        </Box>
      ) : (
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {filteredConversations.map((conversation) => (
            <React.Fragment key={conversation.id}>
              <ListItem
                button
                selected={selectedConversationId === conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                sx={{
                  bgcolor: conversation.unreadCount > 0
                    ? 'rgba(25,118,210,0.08)'
                    : 'transparent',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25,118,210,0.16)!important',
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    badgeContent={conversation.unreadCount}
                    invisible={conversation.unreadCount === 0}
                  >
                    <Avatar>
                      {conversation.recipient?.fullName?.[0]?.toUpperCase() ||
                        conversation.initiator?.fullName?.[0]?.toUpperCase() ||
                        'U'}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        color: conversation.unreadCount > 0 ? 'primary.main' : 'inherit'
                      }}
                    >
                      {conversation.subject || 'No Subject'}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'block',
                          color: conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: conversation.unreadCount > 0 ? 'medium' : 'normal'
                        }}
                      >
                        {conversation.lastMessage?.content && conversation.lastMessage.content.length > 30
                          ? `${conversation.lastMessage.content.substring(0, 30)}...`
                          : conversation.lastMessage?.content || 'No messages yet'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {conversation.updatedAt && formatDate(conversation.updatedAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <CreateConversationModal
        open={createModalOpen}
        onClose={(success) => {
          setCreateModalOpen(false);
          if (success) handleCreateSuccess();
        }}
      />
    </Box>
  );
};

export default ConversationList;