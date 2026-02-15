import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import outletReducer from '../features/outlet/outletSlice';
import userReducer from '../features/user/userSlice';

/**
 * Redux store for KPABK Connect.
 * Uses Redux Toolkit with auth, outlet, and user feature slices.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    outlet: outletReducer,
    user: userReducer,
  },
});
