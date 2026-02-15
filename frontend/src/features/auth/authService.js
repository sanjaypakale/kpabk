import { axiosInstance, setStoredToken } from '../../services/axiosInstance';

const AUTH_BASE = '/auth';
const USERS_BASE = '/users';

/**
 * Login with email and password. Returns login response; caller stores token.
 */
export const login = async (email, password) => {
  const { data } = await axiosInstance.post(`${AUTH_BASE}/login`, { email, password });
  return data;
};

/**
 * Register a new user. Returns created user info; does not log in.
 * Public registration uses role CUSTOMER.
 */
export const register = async (payload) => {
  const { data } = await axiosInstance.post(`${AUTH_BASE}/register`, {
    firstName: payload.firstName?.trim() || null,
    lastName: payload.lastName?.trim() || null,
    email: payload.email?.trim()?.toLowerCase() || '',
    password: payload.password,
    role: payload.role ?? 'CUSTOMER',
    outletId: payload.outletId ?? null,
  });
  return data;
};

/**
 * Logout is client-side only (JWT is stateless). Clears stored token.
 */
export const logout = () => {
  setStoredToken(null);
};

/**
 * Fetch current user profile (GET /api/users/me). Requires valid JWT.
 */
export const fetchMe = async () => {
  const { data } = await axiosInstance.get(`${USERS_BASE}/me`);
  return data;
};
