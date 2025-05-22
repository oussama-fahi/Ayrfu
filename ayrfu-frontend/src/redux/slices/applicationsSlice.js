// src/redux/slices/applicationsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import applicationService from '../../api/services/application.service';


export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getMyApplications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);


export const fetchCandidateApplications = createAsyncThunk(
  'applications/fetchForCandidate',
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await applicationService.getCandidateApplications(candidateId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);


export const fetchApplicationById = createAsyncThunk(
  'applications/fetchById',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await applicationService.getApplicationById(applicationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application details');
    }
  }
);


export const applyForPosition = createAsyncThunk(
  'applications/apply',
  async ({ candidateId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await applicationService.applyForPosition(candidateId, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);


export const applyWithCV = createAsyncThunk(
  'applications/applyWithCV',
  async ({ candidateId, formData }, { rejectWithValue }) => {
    try {
      const response = await applicationService.applyWithCV(candidateId, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application with CV');
    }
  }
);


export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ candidateId, applicationId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateApplication(candidateId, applicationId, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application');
    }
  }
);


export const withdrawApplication = createAsyncThunk(
  'applications/withdraw',
  async ({ candidateId, applicationId }, { rejectWithValue }) => {
    try {
      await applicationService.withdrawApplication(candidateId, applicationId);
      return applicationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw application');
    }
  }
);


export const addApplicationMessage = createAsyncThunk(
  'applications/addMessage',
  async ({ applicationId, messageData }, { rejectWithValue }) => {
    try {
      const response = await applicationService.addApplicationMessage(applicationId, messageData);
      return { applicationId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add message');
    }
  }
);


export const fetchRecommendedPositions = createAsyncThunk(
  'applications/fetchRecommended',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getRecommendedPositions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommended positions');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    myApplications: [],
    currentApplication: null,
    recommendedPositions: [],
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch candidate applications
      .addCase(fetchCandidateApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchCandidateApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Apply for position
      .addCase(applyForPosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyForPosition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.myApplications.unshift(action.payload);
        state.currentApplication = action.payload;
      })
      .addCase(applyForPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Apply with CV
      .addCase(applyWithCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyWithCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.myApplications.unshift(action.payload);
        state.currentApplication = action.payload;
      })
      .addCase(applyWithCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update application
      .addCase(updateApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        
        // Update in applications list
        const index = state.myApplications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.myApplications[index] = action.payload;
        }
        
        // Update current application if it matches
        if (state.currentApplication && state.currentApplication.id === action.payload.id) {
          state.currentApplication = action.payload;
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Withdraw application
      .addCase(withdrawApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        
        // Remove from applications list
        state.myApplications = state.myApplications.filter(app => app.id !== action.payload);
        
        // Clear current application if it matches
        if (state.currentApplication && state.currentApplication.id === action.payload) {
          state.currentApplication = null;
        }
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Add application message
      .addCase(addApplicationMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addApplicationMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Add message to current application if it matches
        if (state.currentApplication && state.currentApplication.id === action.payload.applicationId) {
          state.currentApplication.messages = state.currentApplication.messages || [];
          state.currentApplication.messages.push(action.payload.message);
        }
      })
      .addCase(addApplicationMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch recommended positions
      .addCase(fetchRecommendedPositions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedPositions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendedPositions = action.payload;
      })
      .addCase(fetchRecommendedPositions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentApplication, resetSuccess, clearError } = applicationsSlice.actions;

export default applicationsSlice.reducer;