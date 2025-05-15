// src/redux/slices/positionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import positionService from '../../api/services/position.service';

// Fetch all positions
export const fetchAllPositions = createAsyncThunk(
  'positions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await positionService.getAllPositions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch positions');
    }
  }
);

// Fetch position by ID
export const fetchPositionById = createAsyncThunk(
  'positions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await positionService.getPositionById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch position details');
    }
  }
);

// Create position
export const createPosition = createAsyncThunk(
  'positions/create',
  async (positionData, { rejectWithValue }) => {
    try {
      const response = await positionService.createPosition(positionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create position');
    }
  }
);

// Update position
export const updatePosition = createAsyncThunk(
  'positions/update',
  async ({ id, positionData }, { rejectWithValue }) => {
    try {
      const response = await positionService.updatePosition(id, positionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update position');
    }
  }
);

// Toggle position status (activate/deactivate)
export const togglePositionStatus = createAsyncThunk(
  'positions/toggleStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      let response;
      if (active) {
        response = await positionService.deactivatePosition(id);
      } else {
        response = await positionService.activatePosition(id);
      }
      return { id, active: !active };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle position status');
    }
  }
);

// Delete position
export const deletePosition = createAsyncThunk(
  'positions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await positionService.deletePosition(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete position');
    }
  }
);

// Positions slice
const positionsSlice = createSlice({
  name: 'positions',
  initialState: {
    positions: [],
    currentPosition: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentPosition: (state) => {
      state.currentPosition = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all positions
      .addCase(fetchAllPositions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPositions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.positions = action.payload;
      })
      .addCase(fetchAllPositions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch position by ID
      .addCase(fetchPositionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPositionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPosition = action.payload;
      })
      .addCase(fetchPositionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create position
      .addCase(createPosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.positions.push(action.payload);
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update position
      .addCase(updatePosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.positions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
        state.currentPosition = action.payload;
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Toggle position status
      .addCase(togglePositionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(togglePositionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, active } = action.payload;
        const index = state.positions.findIndex(p => p.id === id);
        if (index !== -1) {
          state.positions[index].active = active;
        }
        if (state.currentPosition && state.currentPosition.id === id) {
          state.currentPosition.active = active;
        }
      })
      .addCase(togglePositionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete position
      .addCase(deletePosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.positions = state.positions.filter(p => p.id !== action.payload);
        if (state.currentPosition && state.currentPosition.id === action.payload) {
          state.currentPosition = null;
        }
      })
      .addCase(deletePosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { clearCurrentPosition, clearError } = positionsSlice.actions;

export default positionsSlice.reducer;