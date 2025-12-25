import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageAPI } from '../storage';

const API_URL = 'http://localhost:3000/api/spaces';

import { Space } from '../types/models';

export interface SpacesState {
  items: Space[];
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  performanceMetrics: {
    lastApiTime: number | null;
    lastCacheTime: number | null;
    apiCallCount: number;
    cacheHitCount: number;
  };
}

const initialState: SpacesState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
  performanceMetrics: {
    lastApiTime: null,
    lastCacheTime: null,
    apiCallCount: 0,
    cacheHitCount: 0,
  },
};

// Async thunk to fetch spaces from API and cache to storage
export const fetchSpaces = createAsyncThunk(
  'spaces/fetchSpaces',
  async (_, { rejectWithValue }) => {
    const startTime = performance.now();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch spaces');
      }
      const result = await response.json();
      const spaces = result.data;

      // Save to storage (IndexedDB or SQLite)
      await storageAPI.saveSpaces(spaces);

      const endTime = performance.now();
      const duration = endTime - startTime;
      return { spaces, duration };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to load spaces from storage cache
export const loadSpacesFromCache = createAsyncThunk(
  'spaces/loadSpacesFromCache',
  async (_, { rejectWithValue }) => {
    const startTime = performance.now();
    try {
      const spaces = await storageAPI.getSpaces();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return { spaces, duration };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to clear spaces
export const clearSpacesCache = createAsyncThunk(
  'spaces/clearCache',
  async (_, { rejectWithValue }) => {
    try {
      await storageAPI.clearSpaces();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch spaces from API
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.spaces;
        state.lastFetched = new Date().toISOString();
        state.performanceMetrics.lastApiTime = action.payload.duration;
        state.performanceMetrics.apiCallCount += 1;
      })
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load spaces from cache
    builder
      .addCase(loadSpacesFromCache.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSpacesFromCache.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.spaces;
        state.performanceMetrics.lastCacheTime = action.payload.duration;
        state.performanceMetrics.cacheHitCount += 1;
      })
      .addCase(loadSpacesFromCache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Clear cache
    builder
      .addCase(clearSpacesCache.fulfilled, (state) => {
        state.items = [];
        state.lastFetched = null;
      });
  },
});

export default spacesSlice.reducer;
