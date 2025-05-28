import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import conversationService from '../../api/services/conversation.service';

export const fetchConversations = createAsyncThunk(
  'conversations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await conversationService.getAllConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchConversationDetails = createAsyncThunk(
  'conversations/fetchDetails',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await conversationService.getConversationDetails(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation details');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'conversations/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await conversationService.getConversationMessages(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const startConversation = createAsyncThunk(
  'conversations/start',
  async (conversationData, { rejectWithValue }) => {
    try {
      const response = await conversationService.startConversation(conversationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async ({ conversationId, formData }, { rejectWithValue }) => {
    try {
      const response = await conversationService.sendMessage(conversationId, formData);
      return {
        conversationId,
        message: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markAllMessagesAsRead = createAsyncThunk(
  'conversations/markAllRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await conversationService.markAllAsRead(conversationId);
      return {
        conversationId,
        data: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'conversations/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await conversationService.getUnreadCount();
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversations: [],
    currentConversation: null,
    currentMessages: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.currentMessages = [];
    },
    resetConversationsState: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.currentMessages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      
      .addCase(fetchConversationMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMessages = action.payload;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(startConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.unshift(action.payload);
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (state.currentConversation?.id === action.payload.conversationId) {
          state.currentMessages.push(action.payload.message);
        }
        
        const conversationIndex = state.conversations.findIndex(c => c.id === action.payload.conversationId);
        if (conversationIndex !== -1) {
          const updatedConversation = { 
            ...state.conversations[conversationIndex],
            lastMessage: action.payload.message.content,
            updatedAt: action.payload.message.sentAt
          };
          
          state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(updatedConversation);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(markAllMessagesAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload.conversationId;
        
        const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unreadCount = 0;
        }
        
        if (state.currentConversation?.id === conversationId) {
          state.currentMessages = state.currentMessages.map(message => ({
            ...message,
            read: true
          }));
        }
        
        state.unreadCount = Math.max(0, state.unreadCount - action.payload.data.marked);
      })
      
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  }
});

export const { clearCurrentConversation, resetConversationsState } = conversationsSlice.actions;

export default conversationsSlice.reducer;