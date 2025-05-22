// src/redux/slices/documentsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import documentService from '../../api/services/document.service';

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async ({ clientId, formData }, { rejectWithValue }) => {
    try {
      const response = await documentService.uploadClientDocument(clientId, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const fetchClientDocuments = createAsyncThunk(
  'documents/fetchClientDocuments',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await documentService.getClientDocuments(clientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const fetchRecentDocuments = createAsyncThunk(
  'documents/fetchRecent',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const clientId = auth.user?.id;
      
      if (!clientId) {
        return rejectWithValue('User not authenticated');
      }
      
      const response = await documentService.getClientDocuments(clientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent documents');
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  'documents/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await documentService.getDocumentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch document details');
    }
  }
);

export const downloadDocument = createAsyncThunk(
  'documents/download',
  async (id, { rejectWithValue }) => {
    try {
      const response = await documentService.downloadDocument(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Get filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a temporary link and click it to start download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      return { id, success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id, { rejectWithValue }) => {
    try {
      await documentService.deleteDocument(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    documents: [],
    currentDocument: null,
    isLoading: false,
    error: null,
    uploadSuccess: false,
    downloadSuccess: false,
  },
  reducers: {
    clearDocuments: (state) => {
      state.documents = [];
      state.currentDocument = null;
    },
    clearDocumentStatus: (state) => {
      state.uploadSuccess = false;
      state.downloadSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.unshift(action.payload);
        state.uploadSuccess = true;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
      })
      
      // Fetch client documents
      .addCase(fetchClientDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchClientDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch recent documents
      .addCase(fetchRecentDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchRecentDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch document by ID
      .addCase(fetchDocumentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Download document
      .addCase(downloadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.downloadSuccess = false;
      })
      .addCase(downloadDocument.fulfilled, (state) => {
        state.isLoading = false;
        state.downloadSuccess = true;
      })
      .addCase(downloadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.downloadSuccess = false;
      })
      
      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
        if (state.currentDocument && state.currentDocument.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDocuments, clearDocumentStatus } = documentsSlice.actions;

export default documentsSlice.reducer;