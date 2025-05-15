// src/redux/slices/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../api/services/message.service';

// Fetch all conversations
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageService.getAllConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

// Fetch conversation details
export const fetchConversationDetails = createAsyncThunk(
  'messages/fetchConversationDetails',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await messageService.getConversationDetails(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation details');
    }
  }
);

// Start a new conversation
export const startConversation = createAsyncThunk(
  'messages/startConversation',
  async (conversationData, { rejectWithValue }) => {
    try {
      const response = await messageService.startConversation(conversationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start conversation');
    }
  }
);

// Reply to a conversation
export const replyToConversation = createAsyncThunk(
  'messages/replyToConversation',
  async (replyData, { rejectWithValue }) => {
    try {
      const response = await messageService.replyToConversation(replyData);
      return {
        conversationId: replyData.conversationId,
        message: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reply');
    }
  }
);

// Mark conversation as read
export const markConversationAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await messageService.markConversationAsRead(conversationId);
      return {
        conversationId,
        markedCount: response.data.markedAsRead
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark conversation as read');
    }
  }
);

// Close conversation
export const closeConversation = createAsyncThunk(
  'messages/closeConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await messageService.closeConversation(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close conversation');
    }
  }
);

// Reopen conversation
export const reopenConversation = createAsyncThunk(
  'messages/reopenConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await messageService.reopenConversation(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reopen conversation');
    }
  }
);

// Get unread message count
export const fetchUnreadCount = createAsyncThunk(
  'messages/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageService.getUnreadCount();
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

// Create a new message (for contact form)
export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messageService.createMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    currentConversation: null,
    unreadCount: 0,
    isLoading: false,
    error: null,
    sendSuccess: false,
    messageSent: false,
  },
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSendSuccess: (state) => {
      state.sendSuccess = false;
    },
    resetMessageSent: (state) => {
      state.messageSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch conversation details
      .addCase(fetchConversationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Start conversation
      .addCase(startConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.sendSuccess = false;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
        state.sendSuccess = true;
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.sendSuccess = false;
      })
      
      // Reply to conversation
      .addCase(replyToConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.sendSuccess = false;
      })
      .addCase(replyToConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sendSuccess = true;
        
        // Add message to current conversation if it matches
        if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
          state.currentConversation.messages.push(action.payload.message);
        }
        
        // Update conversation in list if it exists
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.conversationId
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessage = action.payload.message.content;
          state.conversations[conversationIndex].updatedAt = action.payload.message.createdAt;
          
          // Move conversation to the top of the list
          const [updatedConversation] = state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(updatedConversation);
        }
      })
      .addCase(replyToConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.sendSuccess = false;
      })
      
      // Mark conversation as read
      .addCase(markConversationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update unread count
        const oldUnreadCount = state.unreadCount;
        state.unreadCount = Math.max(0, oldUnreadCount - action.payload.markedCount);
        
        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.conversationId
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unreadMessageCount = 0;
        }
        
        // Update messages in current conversation if it matches
        if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
          state.currentConversation.messages.forEach(message => {
            if (!message.read && message.senderId !== state.currentConversation.userId) {
              message.read = true;
            }
          });
          
          state.currentConversation.unreadMessageCount = 0;
        }
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Close conversation
      .addCase(closeConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(closeConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.id
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].closed = true;
        }
        
        // Update current conversation if it matches
        if (state.currentConversation && state.currentConversation.id === action.payload.id) {
          state.currentConversation.closed = true;
        }
      })
      .addCase(closeConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Reopen conversation
      .addCase(reopenConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reopenConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.id
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].closed = false;
        }
        
        // Update current conversation if it matches
        if (state.currentConversation && state.currentConversation.id === action.payload.id) {
          state.currentConversation.closed = false;
        }
      })
      .addCase(reopenConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create message (for contact form)
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.messageSent = false;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messageSent = true;
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.messageSent = false;
      });
  },
});

export const { 
  clearConversations, 
  clearCurrentConversation, 
  clearError, 
  resetSendSuccess,
  resetMessageSent
} = messagesSlice.actions;

export default messagesSlice.reducer;