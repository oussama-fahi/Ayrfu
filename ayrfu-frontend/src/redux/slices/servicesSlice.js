import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceService from '../../api/services/service.service';

export const fetchAllServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceService.getAllServices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchActiveServices = createAsyncThunk(
  'services/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceService.getAllActiveServices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await serviceService.getServiceById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service details');
    }
  }
);

export const searchServicesByPrompt = createAsyncThunk(
  'services/searchByPrompt',
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await serviceService.searchServicesByPrompt(prompt);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search services');
    }
  }
);

export const searchServicesByKeywords = createAsyncThunk(
  'services/searchByKeywords',
  async (keywords, { rejectWithValue }) => {
    try {
      const response = await serviceService.searchServicesByKeywords(keywords);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search services by keywords');
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await serviceService.createService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      const response = await serviceService.updateService(id, serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  'services/toggleStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      let response;
      if (active) {
        response = await serviceService.deactivateService(id);
      } else {
        response = await serviceService.activateService(id);
      }
      return { id, active: !active };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle service status');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id, { rejectWithValue }) => {
    try {
      await serviceService.deleteService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    currentService: null,
    searchResults: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearServiceResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all services
      .addCase(fetchAllServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch active services
      .addCase(fetchActiveServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchActiveServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search services by prompt
      .addCase(searchServicesByPrompt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchServicesByPrompt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchServicesByPrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search services by keywords
      .addCase(searchServicesByKeywords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchServicesByKeywords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchServicesByKeywords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create service
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update service
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        state.currentService = action.payload;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Toggle service status
      .addCase(toggleServiceStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, active } = action.payload;
        const index = state.services.findIndex(s => s.id === id);
        if (index !== -1) {
          state.services[index].active = active;
        }
        if (state.currentService && state.currentService.id === id) {
          state.currentService.active = active;
        }
      })
      .addCase(toggleServiceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = state.services.filter(s => s.id !== action.payload);
        if (state.currentService && state.currentService.id === action.payload) {
          state.currentService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentService, clearServiceResults, clearError } = servicesSlice.actions;

export default servicesSlice.reducer;