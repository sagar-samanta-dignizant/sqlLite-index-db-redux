import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageAPI } from '../storage';

const API_URL = 'http://localhost:3000/api/users';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  status?: string;
  joinedAt?: string;
}

interface UsersState {
  items: User[];
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

const initialState: UsersState = {
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

// Async thunk to fetch users from API and cache to storage
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    const startTime = performance.now();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const result = await response.json();
      const users = result.data;

      // Save to storage (IndexedDB or SQLite)
      await storageAPI.saveUsers(users);

      const endTime = performance.now();
      const duration = endTime - startTime;
      return { users, duration };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to load users from storage cache
export const loadUsersFromCache = createAsyncThunk(
  'users/loadUsersFromCache',
  async (_, { rejectWithValue }) => {
    const startTime = performance.now();
    try {
      const users = await storageAPI.getUsers();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return { users, duration };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to clear users
export const clearUsersCache = createAsyncThunk(
  'users/clearCache',
  async (_, { rejectWithValue }) => {
    try {
      await storageAPI.clearUsers();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch users from API
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.lastFetched = new Date().toISOString();
        state.performanceMetrics.lastApiTime = action.payload.duration;
        state.performanceMetrics.apiCallCount += 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load users from cache
    builder
      .addCase(loadUsersFromCache.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsersFromCache.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.performanceMetrics.lastCacheTime = action.payload.duration;
        state.performanceMetrics.cacheHitCount += 1;
      })
      .addCase(loadUsersFromCache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Clear cache
    builder
      .addCase(clearUsersCache.fulfilled, (state) => {
        state.items = [];
        state.lastFetched = null;
      });
  },
});

export default usersSlice.reducer;
