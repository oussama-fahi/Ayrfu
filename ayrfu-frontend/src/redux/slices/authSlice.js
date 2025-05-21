// src/redux/slices/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for candidate registration
export const registerCandidate = createAsyncThunk(
  'auth/registerCandidate',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register/candidate', candidateData);
      
      // If registration also returns a token, store it
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  }
);

// Async thunk for client registration
export const registerClient = createAsyncThunk(
  'auth/registerClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register/client', clientData);
      
      // If registration also returns a token, store it
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    }
  }
);

// Async thunk to get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const response = await axios.get('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      // If token is invalid or expired, remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch user profile.'
      );
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Optionally, you can also make an API call to invalidate the token on the server
      // await axios.post('/api/auth/logout');
      
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed.');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
    registrationSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegistrationState: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register candidate
      .addCase(registerCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = !!action.payload.token;
        state.registrationSuccess = true;
      })
      .addCase(registerCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      })
      
      // Register client
      .addCase(registerClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = !!action.payload.token;
        state.registrationSuccess = true;
      })
      .addCase(registerClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRegistrationState } = authSlice.actions;

export default authSlice.reducer;