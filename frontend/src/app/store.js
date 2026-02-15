import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import outletReducer from '../features/outlet/outletSlice';

/**
 * Redux store for KPABK Connect.
 * Uses Redux Toolkit with auth and outlet feature slices.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    outlet: outletReducer,
  },
});
