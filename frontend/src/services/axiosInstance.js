import axios from 'axios';

// In dev, use '/api' so Vite proxy forwards to backend; override with VITE_API_BASE_URL if needed.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:8080/api');

const TOKEN_KEY = 'kpabk_auth_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

// Global loading: track pending API requests and notify UI (one place for all API calls).
let pendingCount = 0;
const LOADING_EVENT = 'api-loading';

const notifyLoading = () => {
  window.dispatchEvent(new CustomEvent(LOADING_EVENT, { detail: { pending: pendingCount } }));
};

/**
 * Axios instance for API calls. Base URL points to Spring Boot backend.
 * Request interceptor: attach JWT from localStorage; increment pending count.
 * Response interceptor: decrement pending count; on 401, clear auth and redirect to /login.
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    pendingCount += 1;
    notifyLoading();
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    pendingCount = Math.max(0, pendingCount - 1);
    notifyLoading();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    pendingCount = Math.max(0, pendingCount - 1);
    notifyLoading();
    return response;
  },
  (error) => {
    pendingCount = Math.max(0, pendingCount - 1);
    notifyLoading();
    if (error.response?.status === 401) {
      setStoredToken(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { LOADING_EVENT };
