import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../api/services/message.service';

export const fetchAllMessages = createAsyncThunk(
  'messages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageService.getAllMessages();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const fetchMessagesByType = createAsyncThunk(
  'messages/fetchByType',
  async (type, { rejectWithValue }) => {
    try {
      const response = await messageService.getMessagesByType(type);
      return { type, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages by type');
    }
  }
);

export const fetchUnreadMessages = createAsyncThunk(
  'messages/fetchUnread',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageService.getUnreadMessages();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread messages');
    }
  }
);

export const fetchUnreadMessagesByType = createAsyncThunk(
  'messages/fetchUnreadByType',
  async (type, { rejectWithValue }) => {
    try {
      const response = await messageService.getUnreadMessagesByType(type);
      return { type, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread messages by type');
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/create',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messageService.createMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await messageService.markMessageAsRead(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark message as read');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await messageService.deleteMessage(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    candidateMessages: [],
    clientMessages: [],
    unreadMessages: [],
    isLoading: false,
    error: null,
    messageSent: false,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.candidateMessages = [];
      state.clientMessages = [];
      state.unreadMessages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetMessageSent: (state) => {
      state.messageSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all messages
      .addCase(fetchAllMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAllMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch messages by type
      .addCase(fetchMessagesByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.type === 'CANDIDATE') {
          state.candidateMessages = action.payload.messages;
        } else if (action.payload.type === 'CLIENT') {
          state.clientMessages = action.payload.messages;
        }
      })
      .addCase(fetchMessagesByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch unread messages
      .addCase(fetchUnreadMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadMessages = action.payload;
      })
      .addCase(fetchUnreadMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch unread messages by type
      .addCase(fetchUnreadMessagesByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadMessagesByType.fulfilled, (state, action) => {
        state.isLoading = false;
        const currentUnread = state.unreadMessages.filter(
          msg => msg.type !== action.payload.type
        );
        state.unreadMessages = [...currentUnread, ...action.payload.messages];
      })
      .addCase(fetchUnreadMessagesByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create message
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.messageSent = false;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messageSent = true;
        if (action.payload.type === 'CANDIDATE') {
          state.candidateMessages.push(action.payload);
        } else if (action.payload.type === 'CLIENT') {
          state.clientMessages.push(action.payload);
        }
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.messageSent = false;
      })
      
      // Mark message as read
      .addCase(markMessageAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in all message lists
        const updateMessageInList = (list) => {
          const index = list.findIndex(m => m.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        
        updateMessageInList(state.messages);
        updateMessageInList(state.candidateMessages);
        updateMessageInList(state.clientMessages);
        
        // Remove from unread messages
        state.unreadMessages = state.unreadMessages.filter(m => m.id !== action.payload.id);
      })
      .addCase(markMessageAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete message
      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = state.messages.filter(m => m.id !== action.payload);
        state.candidateMessages = state.candidateMessages.filter(m => m.id !== action.payload);
        state.clientMessages = state.clientMessages.filter(m => m.id !== action.payload);
        state.unreadMessages = state.unreadMessages.filter(m => m.id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearMessages, 
  clearError,
  resetMessageSent
} = messagesSlice.actions;

export default messagesSlice.reducer;