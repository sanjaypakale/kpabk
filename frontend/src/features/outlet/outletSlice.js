import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './outletService';

export const fetchOutlets = createAsyncThunk(
  'outlet/fetchOutlets',
  async (params, { rejectWithValue }) => {
    try {
      return await api.fetchOutletsApi(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch outlets');
    }
  }
);

export const fetchOutletById = createAsyncThunk(
  'outlet/fetchOutletById',
  async (id, { rejectWithValue }) => {
    try {
      return await api.fetchOutletByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Outlet not found');
    }
  }
);

export const createOutlet = createAsyncThunk(
  'outlet/createOutlet',
  async (body, { rejectWithValue }) => {
    try {
      return await api.createOutletApi(body);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Failed to create outlet';
      return rejectWithValue(msg);
    }
  }
);

export const updateOutlet = createAsyncThunk(
  'outlet/updateOutlet',
  async ({ id, body }, { rejectWithValue }) => {
    try {
      return await api.updateOutletApi(id, body);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Failed to update outlet';
      return rejectWithValue(msg);
    }
  }
);

export const deleteOutlet = createAsyncThunk(
  'outlet/deleteOutlet',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteOutletApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to delete outlet'
      );
    }
  }
);

export const fetchOutletProducts = createAsyncThunk(
  'outlet/fetchOutletProducts',
  async (outletId, { rejectWithValue }) => {
    try {
      const data = await api.fetchOutletProductsApi(outletId);
      return Array.isArray(data) ? data : data?.content ?? [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch products'
      );
    }
  }
);

export const updateOutletProducts = createAsyncThunk(
  'outlet/updateOutletProducts',
  async ({ outletId, body }, { rejectWithValue }) => {
    try {
      return await api.updateOutletProductsApi(outletId, body);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update product'
      );
    }
  }
);

export const toggleProductAvailability = createAsyncThunk(
  'outlet/toggleProductAvailability',
  async ({ outletId, productId, available }, { rejectWithValue }) => {
    try {
      await api.toggleProductAvailabilityApi(outletId, productId, available);
      return { productId, available };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update availability'
      );
    }
  }
);

export const fetchOutletProductById = createAsyncThunk(
  'outlet/fetchOutletProductById',
  async ({ outletId, productId }, { rejectWithValue }) => {
    try {
      return await api.fetchOutletProductByIdApi(outletId, productId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Product not found'
      );
    }
  }
);

const initialState = {
  outlets: [],
  listPagination: { page: 0, size: 20, totalElements: 0, totalPages: 0 },
  selectedOutlet: null,
  outletProducts: [],
  selectedProduct: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const outletSlice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOutlet: (state) => {
      state.selectedOutlet = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOutlets
      .addCase(fetchOutlets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutlets.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.outlets = payload.content ?? [];
        state.listPagination = {
          page: payload.page ?? 0,
          size: payload.size ?? 20,
          totalElements: payload.totalElements ?? 0,
          totalPages: payload.totalPages ?? 0,
        };
        state.error = null;
      })
      .addCase(fetchOutlets.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // fetchOutletById
      .addCase(fetchOutletById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchOutletById.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedOutlet = payload;
        state.error = null;
      })
      .addCase(fetchOutletById.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      // createOutlet
      .addCase(createOutlet.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createOutlet.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedOutlet = payload;
        state.error = null;
      })
      .addCase(createOutlet.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      // updateOutlet
      .addCase(updateOutlet.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateOutlet.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedOutlet = payload;
        state.error = null;
      })
      .addCase(updateOutlet.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      // deleteOutlet
      .addCase(deleteOutlet.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteOutlet.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.outlets = state.outlets.filter((o) => o.id !== payload);
        if (state.selectedOutlet?.id === payload) state.selectedOutlet = null;
        state.error = null;
      })
      .addCase(deleteOutlet.rejected, (state, { payload }) => {
        state.actionLoading = false;
        state.error = payload;
      })
      // fetchOutletProducts
      .addCase(fetchOutletProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutletProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.outletProducts = Array.isArray(payload) ? payload : [];
        state.error = null;
      })
      .addCase(fetchOutletProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // updateOutletProducts
      .addCase(updateOutletProducts.fulfilled, (state, { payload }) => {
        if (payload && state.outletProducts.length) {
          const idx = state.outletProducts.findIndex(
            (p) => p.productId === payload.productId || p.id === payload.id
          );
          if (idx !== -1) state.outletProducts[idx] = { ...state.outletProducts[idx], ...payload };
          else state.outletProducts = [payload, ...state.outletProducts];
        }
      })
      // toggleProductAvailability
      .addCase(toggleProductAvailability.fulfilled, (state, { payload }) => {
        const id = payload.productId;
        const item = state.outletProducts.find(
          (p) => p.productId === id || String(p.productId) === String(id)
        );
        if (item) item.isAvailable = payload.available;
      })
      // fetchOutletProductById
      .addCase(fetchOutletProductById.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(fetchOutletProductById.fulfilled, (state, { payload }) => {
        state.actionLoading = false;
        state.selectedProduct = payload;
      })
      .addCase(fetchOutletProductById.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export const { clearError, clearSelectedOutlet, clearSelectedProduct } = outletSlice.actions;
export default outletSlice.reducer;
