import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './cartService';
import * as cartApi from '../../services/cartApi';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.getCart();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to load cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue, dispatch }) => {
    try {
      const item = await api.addToCartApi({ productId, quantity });
      await dispatch(fetchCart());
      return item;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to add to cart'
      );
    }
  }
);

/** Update quantity for a cart item. Min quantity 1. */
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const updated = await cartApi.updateCartItem({
        productId,
        quantity: Math.max(1, Number(quantity) || 1),
      });
      return updated;
    } catch (err) {
      return rejectWithValue({
        productId,
        message: err.response?.data?.message || err.message || 'Failed to update quantity',
      });
    }
  }
);

/** Remove item by cart item id (backend uses cartItemId). */
export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (cartItemId, { rejectWithValue }) => {
    try {
      await cartApi.deleteCartItem(cartItemId);
      return cartItemId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to remove item'
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  addLoading: false,
  updatingProductId: null,
  deletingCartItemId: null,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.error = null;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = Array.isArray(payload) ? payload : [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? 'Failed to load cart';
      })
      .addCase(addToCart.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.addLoading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, { payload }) => {
        state.addLoading = false;
        state.error = payload ?? 'Failed to add to cart';
      })
      .addCase(updateCartItem.pending, (state, { meta }) => {
        state.updatingProductId = meta.arg?.productId ?? null;
        state.error = null;
        // Optimistic update: show new quantity immediately
        const productId = meta.arg?.productId;
        const quantity = Math.max(1, Number(meta.arg?.quantity) || 1);
        if (productId != null) {
          const idx = state.items.findIndex((i) => i.productId === productId);
          if (idx !== -1) state.items[idx].quantity = quantity;
        }
      })
      .addCase(updateCartItem.fulfilled, (state, { payload }) => {
        state.updatingProductId = null;
        if (payload?.id != null) {
          const idx = state.items.findIndex((i) => i.id === payload.id);
          if (idx !== -1) state.items[idx] = { ...state.items[idx], ...payload };
        }
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, { payload }) => {
        state.updatingProductId = null;
        state.error = payload?.message ?? payload ?? 'Failed to update quantity';
        // Optimistic update is reverted by refetch in CartPage or by user retry
      })
      .addCase(deleteCartItem.pending, (state, { meta }) => {
        state.deletingCartItemId = meta.arg ?? null;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, { payload }) => {
        state.deletingCartItemId = null;
        state.items = state.items.filter((i) => i.id !== payload);
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, { payload }) => {
        state.deletingCartItemId = null;
        state.error = payload ?? 'Failed to remove item';
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;

/** Total number of items (sum of quantities) in the cart. */
export const selectCartTotalQuantity = (state) =>
  (state.cart?.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);

export const selectCartItems = (state) => state.cart?.items ?? [];
export const selectCartAddLoading = (state) => state.cart?.addLoading ?? false;
export const selectCartLoading = (state) => state.cart?.loading ?? false;
export const selectCartError = (state) => state.cart?.error ?? null;
export const selectUpdatingProductId = (state) => state.cart?.updatingProductId ?? null;
export const selectDeletingCartItemId = (state) => state.cart?.deletingCartItemId ?? null;

/** Subtotal (sum of price * quantity for each item). */
export const selectCartSubtotal = (state) => {
  const items = state.cart?.items ?? [];
  return items.reduce((sum, i) => sum + (Number(i.basePrice) || 0) * (i.quantity || 0), 0);
};

export default cartSlice.reducer;
