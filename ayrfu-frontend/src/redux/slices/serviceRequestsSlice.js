//src/redux/slices/serviceRequestsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceRequestService from '../../api/services/serviceRequest.service';

export const createServiceRequest = createAsyncThunk(
  'serviceRequests/create',
  async (requestData, { rejectWithValue, getState }) => {
    try {
      const { clients } = getState();
      const clientId = clients.currentClient?.id;
      
      const finalRequestData = {
        ...requestData,
        clientId: requestData.clientId || clientId
      };
      
      const response = await serviceRequestService.createServiceRequest(finalRequestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service request');
    }
  }
);

export const getServiceRequestById = createAsyncThunk(
  'serviceRequests/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await serviceRequestService.getServiceRequestById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service request');
    }
  }
);

export const getServiceRequestsByClient = createAsyncThunk(
  'serviceRequests/getByClient',
  async ({ clientId, page = 0, size = 20 }, { rejectWithValue, getState }) => {
    try {
      let effectiveClientId = clientId;
      if (!effectiveClientId) {
        const { clients, auth } = getState();
        effectiveClientId = clients.currentClient?.id || auth.user?.id;
      }
      
      if (!effectiveClientId) {
        return rejectWithValue('Client ID not found');
      }
      
      const response = await serviceRequestService.getServiceRequestsByClient(effectiveClientId, page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client service requests');
    }
  }
);

export const getCurrentClientServiceRequests = createAsyncThunk(
  'serviceRequests/getCurrentClient',
  async ({ page = 0, size = 20 }, { rejectWithValue, getState }) => {
    try {
      const { clients, auth } = getState();
      const clientId = clients.currentClient?.id || auth.user?.id;
      
      if (!clientId) {
        return rejectWithValue('Client not authenticated');
      }
      
      const response = await serviceRequestService.getCurrentClientServiceRequests(page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your service requests');
    }
  }
);

export const getServiceRequestsByStatus = createAsyncThunk(
  'serviceRequests/getByStatus',
  async ({ status, page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const response = await serviceRequestService.getServiceRequestsByStatus(status, page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service requests by status');
    }
  }
);

export const updateServiceRequestStatus = createAsyncThunk(
  'serviceRequests/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await serviceRequestService.updateServiceRequestStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service request status');
    }
  }
);

export const deleteServiceRequest = createAsyncThunk(
  'serviceRequests/delete',
  async (id, { rejectWithValue }) => {
    try {
      await serviceRequestService.deleteServiceRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service request');
    }
  }
);

const serviceRequestsSlice = createSlice({
  name: 'serviceRequests',
  initialState: {
    requests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
    success: false
  },
  reducers: {
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    clearRequestsError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.unshift(action.payload);
        state.currentRequest = action.payload;
        state.success = true;
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getServiceRequestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServiceRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRequest = action.payload;
      })
      .addCase(getServiceRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getServiceRequestsByClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServiceRequestsByClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(getServiceRequestsByClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentClientServiceRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentClientServiceRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.requests = action.payload;
        } else {
          state.requests = [];
        }
      })
      .addCase(getCurrentClientServiceRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getServiceRequestsByStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getServiceRequestsByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(getServiceRequestsByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateServiceRequestStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateServiceRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest && state.currentRequest.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateServiceRequestStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteServiceRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = state.requests.filter(req => req.id !== action.payload);
        if (state.currentRequest && state.currentRequest.id === action.payload) {
          state.currentRequest = null;
        }
      })
      .addCase(deleteServiceRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentRequest, clearRequestsError, resetSuccess } = serviceRequestsSlice.actions;
export default serviceRequestsSlice.reducer;