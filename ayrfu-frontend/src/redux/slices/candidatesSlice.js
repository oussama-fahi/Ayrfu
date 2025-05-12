// src/redux/slices/candidatesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

/**
 * Fetch the current user's candidate profile
 */
export const fetchCandidateProfile = createAsyncThunk(
  'candidates/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/profile/candidate');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
    }
  }
);

/**
 * Create candidate
 */
export const createCandidate = createAsyncThunk(
  'candidates/create',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/candidates', candidateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create candidate profile');
    }
  }
);

/**
 * Get candidate by ID
 */
export const getCandidateById = createAsyncThunk(
  'candidates/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/candidates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
    }
  }
);

/**
 * Get candidate by email
 */
export const getCandidateByEmail = createAsyncThunk(
  'candidates/getByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/candidates/email/${email}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
    }
  }
);

/**
 * Upload candidate CV
 */
export const uploadCandidateCV = createAsyncThunk(
  'candidates/uploadCV',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`/api/candidates/${id}/cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { id, cvPath: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload CV');
    }
  }
);

/**
 * Apply for position
 */
export const applyForPosition = createAsyncThunk(
  'candidates/applyForPosition',
  async ({ id, applicationData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/candidates/${id}/applications`, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);

/**
 * Get candidate applications
 */
export const fetchCandidateApplications = createAsyncThunk(
  'candidates/fetchApplications',
  async (id, { rejectWithValue }) => {
    try {
      // First, try the dedicated endpoint that might be available in the API
      try {
        const response = await axios.get('/api/applications/my-applications');
        return response.data;
      } catch (e) {
        // If that fails, fall back to the candidate-specific endpoint
        const response = await axios.get(`/api/candidates/${id}/applications`);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

/**
 * Update candidate profile
 */
export const updateCandidateProfile = createAsyncThunk(
  'candidates/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/users/profile/candidate', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update candidate profile');
    }
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    currentCandidate: null,
    applications: [],
    isLoading: false,
    error: null,
    applicationSuccess: false,
    uploadSuccess: false,
    profileCompleted: false,
  },
  reducers: {
    clearCurrentCandidate: (state) => {
      state.currentCandidate = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetApplicationSuccess: (state) => {
      state.applicationSuccess = false;
    },
    resetUploadSuccess: (state) => {
      state.uploadSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch candidate profile
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        state.profileCompleted = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.profileCompleted = false;
      })
      
      // Create candidate
      .addCase(createCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        state.profileCompleted = true;
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get candidate by ID
      .addCase(getCandidateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCandidateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
      })
      .addCase(getCandidateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get candidate by email
      .addCase(getCandidateByEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCandidateByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
      })
      .addCase(getCandidateByEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Upload CV
      .addCase(uploadCandidateCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadCandidateCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadSuccess = true;
        if (state.currentCandidate && state.currentCandidate.id === action.payload.id) {
          state.currentCandidate.cvPath = action.payload.cvPath;
        }
      })
      .addCase(uploadCandidateCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
      })
      
      // Apply for position
      .addCase(applyForPosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.applicationSuccess = false;
      })
      .addCase(applyForPosition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload);
        state.applicationSuccess = true;
      })
      .addCase(applyForPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.applicationSuccess = false;
      })
      
      // Get candidate applications
      .addCase(fetchCandidateApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchCandidateApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Don't empty applications array on error - keep any existing data
      })
      
      // Update candidate profile
      .addCase(updateCandidateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        state.profileCompleted = true;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentCandidate,
  clearApplications,
  clearError,
  resetApplicationSuccess,
  resetUploadSuccess,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;