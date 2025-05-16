// src/redux/slices/candidatesSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import candidateService from '../../api/services/candidate.service';

/**
 * Create a new candidate
 */
export const createCandidate = createAsyncThunk(
  'candidates/create',
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await candidateService.createCandidate(candidateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create candidate profile');
    }
  }
);

/**
 * Get a candidate by ID
 */
export const getCandidateById = createAsyncThunk(
  'candidates/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await candidateService.getCandidateById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
    }
  }
);

/**
 * Get a candidate by email
 */
export const getCandidateByEmail = createAsyncThunk(
  'candidates/getByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await candidateService.getCandidateByEmail(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
    }
  }
);

/**
 * Update a candidate profile
 */
export const updateCandidate = createAsyncThunk(
  'candidates/update',
  async ({ id, candidateData }, { rejectWithValue }) => {
    try {
      const response = await candidateService.updateCandidate(id, candidateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update candidate profile');
    }
  }
);

/**
 * Upload a CV
 */
export const uploadCandidateCV = createAsyncThunk(
  'candidates/uploadCV',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const response = await candidateService.uploadCV(id, file);
      return { id, cvPath: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload CV');
    }
  }
);

/**
 * Update profile and CV in one request
 */
export const updateProfileWithCV = createAsyncThunk(
  'candidates/updateProfileWithCV',
  async ({ id, candidateData, cvFile }, { rejectWithValue }) => {
    try {
      const response = await candidateService.updateProfileWithCV(id, candidateData, cvFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile with CV');
    }
  }
);

/**
 * Apply for a position
 */
export const applyForPosition = createAsyncThunk(
  'candidates/applyForPosition',
  async ({ id, applicationData }, { rejectWithValue }) => {
    try {
      const response = await candidateService.applyForPosition(id, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);

/**
 * Get applications for a candidate
 */
export const getCandidateApplications = createAsyncThunk(
  'candidates/getApplications',
  async (id, { rejectWithValue }) => {
    try {
      const response = await candidateService.getCandidateApplications(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

/**
 * Get matching jobs for a candidate
 */
export const getMatchingJobs = createAsyncThunk(
  'candidates/getMatchingJobs',
  async (id, { rejectWithValue }) => {
    try {
      const response = await candidateService.getMatchingJobs(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matching jobs');
    }
  }
);

/**
 * Register a new candidate
 */
export const registerCandidate = createAsyncThunk(
  'candidates/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await candidateService.register(registrationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register candidate');
    }
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    currentCandidate: null,
    applications: [],
    matchingJobs: [],
    isLoading: false,
    error: null,
    applicationSuccess: false,
    uploadSuccess: false,
    profileUpdateSuccess: false,
  },
  reducers: {
    clearCurrentCandidate: (state) => {
      state.currentCandidate = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
    clearMatchingJobs: (state) => {
      state.matchingJobs = [];
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
    resetProfileUpdateSuccess: (state) => {
      state.profileUpdateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create candidate
      .addCase(createCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        state.profileUpdateSuccess = true;
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

      // Update candidate
      .addCase(updateCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.profileUpdateSuccess = false;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        state.profileUpdateSuccess = true;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.profileUpdateSuccess = false;
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

      // Update profile with CV
      .addCase(updateProfileWithCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.profileUpdateSuccess = false;
        state.uploadSuccess = false;
      })
      .addCase(updateProfileWithCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        state.profileUpdateSuccess = true;
        state.uploadSuccess = true;
      })
      .addCase(updateProfileWithCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.profileUpdateSuccess = false;
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
      .addCase(getCandidateApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCandidateApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(getCandidateApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get matching jobs
      .addCase(getMatchingJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMatchingJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchingJobs = action.payload;
      })
      .addCase(getMatchingJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register candidate
      .addCase(registerCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
        // Don't set application or profile success flags for registration
      })
      .addCase(registerCandidate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentCandidate,
  clearApplications,
  clearMatchingJobs,
  clearError,
  resetApplicationSuccess,
  resetUploadSuccess,
  resetProfileUpdateSuccess,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;