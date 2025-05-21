import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread messages');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to create message');
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

export const markMultipleAsRead = createAsyncThunk(
  'messages/markMultipleAsRead',
  async (messageIds, { rejectWithValue }) => {
    try {
      const response = await messageService.markMultipleAsRead(messageIds);
      return {
        messageIds,
        count: response.data.count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
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

export const searchMessages = createAsyncThunk(
  'messages/search',
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await messageService.searchMessages(searchText);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search messages');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    unreadMessages: [],
    searchResults: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    messageSent: false
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.unreadMessages = [];
      state.searchResults = [];
    },
    resetMessageState: (state) => {
      state.error = null;
      state.messageSent = false;
    }
  },
  extraReducers: (builder) => {
    builder
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
      
      .addCase(fetchMessagesByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
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
      
      .addCase(fetchUnreadMessagesByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadMessagesByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadMessages = action.payload;
      })
      .addCase(fetchUnreadMessagesByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
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
      })
      
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const updatedMessage = action.payload;
        
        state.messages = state.messages.map(message => 
          message.id === updatedMessage.id ? updatedMessage : message
        );
        
        state.unreadMessages = state.unreadMessages.filter(message => 
          message.id !== updatedMessage.id
        );
        
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      
      .addCase(markMultipleAsRead.fulfilled, (state, action) => {
        const { messageIds, count } = action.payload;
        
        state.messages = state.messages.map(message => 
          messageIds.includes(message.id) 
            ? { ...message, read: true, readAt: new Date().toISOString() }
            : message
        );
        
        state.unreadMessages = state.unreadMessages.filter(message => 
          !messageIds.includes(message.id)
        );
        
        state.unreadCount = Math.max(0, state.unreadCount - count);
      })
      
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        
        state.messages = state.messages.filter(message => 
          message.id !== messageId
        );
        
        state.unreadMessages = state.unreadMessages.filter(message => 
          message.id !== messageId
        );
      })
      
      .addCase(searchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMessages, resetMessageState } = messagesSlice.actions;

export default messagesSlice.reducer;