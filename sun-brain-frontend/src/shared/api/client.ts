import axios from 'axios';

import { request } from './api-client';

const getDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || getDefaultApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

export const SESSION_EXPIRED_EVENT = 'sunbrain:session-expired';
let refreshPromise: Promise<{ accessToken: string }> | null = null;

const expireSession = () => {
  localStorage.removeItem('access_token');
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

export const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = request<{ accessToken: string }>(authApi.post('/api/auth/refresh'))
      .then((session) => {
        localStorage.setItem('access_token', session.accessToken);
        return session;
      })
      .catch((error) => {
        expireSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  config.headers.set('Authorization', token ? `Bearer ${token}` : undefined);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      expireSession();
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // A late 401 may belong to the token another request has already replaced.
    const token = localStorage.getItem('access_token');
    if (!token && originalRequest.headers.has('Authorization')) {
      return Promise.reject(error);
    }
    if (token && originalRequest.headers.get('Authorization') !== `Bearer ${token}`) {
      return api(originalRequest);
    }
    try {
      await refreshSession();
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
