//src/redux/slices/clientsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clientService from '../../api/services/client.service';

export const fetchAllClients = createAsyncThunk(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.getAllClients();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await clientService.getClientById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
    }
  }
);

export const fetchClientByEmail = createAsyncThunk(
  'clients/fetchByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await clientService.getClientByEmail(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/create',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await clientService.createClient(clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create client');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/update',
  async ({ id, clientData }, { rejectWithValue }) => {
    try {
      const response = await clientService.updateClient(id, clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update client');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
    }
  }
);

export const fetchCurrentClient = createAsyncThunk(
  'clients/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Making API call to fetch current client');
      const response = await clientService.getCurrentClient();
      console.log('Current client response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current client:', error);
      if (error.response?.status === 404) {
        return rejectWithValue('Client profile not found. Please complete your profile setup.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current client');
    }
  }
);

export const updateCurrentClient = createAsyncThunk(
  'clients/updateCurrent',
  async (clientData, { rejectWithValue, getState }) => {
    try {
      const { clients } = getState();
      const clientId = clients.currentClient?.id;
      
      if (!clientId) {
        return rejectWithValue('Client ID not found');
      }

      const response = await clientService.updateClient(clientId, clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update current client');
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    currentClient: null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchClientById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchClientByEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientByEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients.push(action.payload);
        state.currentClient = action.payload;
        state.success = true;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient && state.currentClient.id === action.payload.id) {
          state.currentClient = action.payload;
        }
        state.success = true;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = state.clients.filter(c => c.id !== action.payload);
        if (state.currentClient && state.currentClient.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchCurrentClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCurrentClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCurrentClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClient = action.payload;
        state.success = true;
      })
      .addCase(updateCurrentClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCurrentClient, clearError, resetSuccess } = clientsSlice.actions;
export default clientsSlice.reducer;