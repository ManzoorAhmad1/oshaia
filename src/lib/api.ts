import axios from 'axios';
import { store } from '@/store/store';
import { setTokens, clearAuth } from '@/store/authSlice';

const _rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.oshaia.com/api';
const BASE_URL = _rawApiUrl.startsWith('http') ? _rawApiUrl : `https://${_rawApiUrl}`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach access token to every request ───────────────────────────────────
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-refresh access token on 401 ─────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = store.getState().auth.refreshToken;

      if (!refreshToken) {
        isRefreshing = false;
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const newAccess = data.accessToken;
        const newRefresh = data.refreshToken;

        store.dispatch(setTokens({ accessToken: newAccess, refreshToken: newRefresh }));

        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearAuth());
        if (typeof window !== 'undefined') window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
