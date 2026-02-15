import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './userService';

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const { role, ...rest } = params ?? {};
      if (role) {
        return await api.fetchUsersByRoleApi(role, rest);
      }
      return await api.fetchUsersApi(rest);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch users'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      return await api.fetchUserByIdApi(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'User not found'
      );
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (body, { rejectWithValue }) => {
    try {
      return await api.createUserApi(body);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Failed to create user';
      return rejectWithValue(msg);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, body }, { rejectWithValue }) => {
    try {
      return await api.updateUserApi(id, body);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Failed to update user';
      return rejectWithValue(msg);
    }
  }
);

export const setUserEnabled = createAsyncThunk(
  'user/setUserEnabled',
  async ({ id, enabled }, { rejectWithValue }) => {
    try {
      await api.setUserEnabledApi(id, enabled);
      return { id, enabled };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update user'
      );
    }
  }
);

const initialState = {
  users: [],
  listPagination: { page: 0, size: 20, totalElements: 0, totalPages: 0 },
  selectedUser: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload.content ?? [];
        state.listPagination = {
          page: payload.page ?? 0,
          size: payload.size ?? 20,
          totalElements: payload.totalElements ?? 0,
          totalPages: payload.totalPages ?? 0,
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedUser = payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      .addCase(createUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedUser = payload;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedUser = payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      .addCase(setUserEnabled.fulfilled, (state, { payload }) => {
        const user = state.users.find((u) => u.id === payload.id);
        if (user) user.enabled = payload.enabled;
        if (state.selectedUser?.id === payload.id) {
          state.selectedUser = { ...state.selectedUser, enabled: payload.enabled };
        }
      });
  },
});

export const { clearError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
