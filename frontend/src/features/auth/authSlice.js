import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStoredToken, setStoredToken } from '../../services/axiosInstance';
import * as authService from './authService';

/** Login with email and password. Stores token and user in state. */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      const token = response.accessToken;
      if (!token) return rejectWithValue({ message: 'No token in response' });
      setStoredToken(token);
      return {
        token,
        user: {
          email: response.email,
          role: response.role,
          outletId: response.outletId,
          id: response.id ?? null,
          firstName: response.firstName ?? null,
          lastName: response.lastName ?? null,
          displayName: response.displayName ?? null,
        },
      };
    } catch (err) {
      const message =
        err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue({ message });
    }
  }
);

/** Logout: clear state and localStorage. */
export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  authService.logout();
});

/** Fetch current user profile (GET /me). Use after login or on app load. */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await authService.fetchMe();
      return data;
    } catch (err) {
      setStoredToken(null);
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch user' });
    }
  }
);

const initialState = {
  user: null,
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.message || 'Login failed';
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
