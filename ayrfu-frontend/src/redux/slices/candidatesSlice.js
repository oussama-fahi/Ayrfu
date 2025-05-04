import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateService from '../../api/services/candidate.service';

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

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    currentCandidate: null,
    applications: [],
    isLoading: false,
    error: null,
    applicationSuccess: false,
    uploadSuccess: false,
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
      // Create candidate
      .addCase(createCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCandidate = action.payload;
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
      });
  },
});

export const { 
  clearCurrentCandidate, 
  clearApplications, 
  clearError,
  resetApplicationSuccess,
  resetUploadSuccess
} = candidatesSlice.actions;

export default candidatesSlice.reducer;