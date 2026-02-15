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
