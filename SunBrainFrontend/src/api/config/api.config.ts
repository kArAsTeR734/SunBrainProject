import axios from 'axios';
import { AuthorizationService } from '../services/AuthorizationService.ts';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const response = await AuthorizationService.refresh();

        localStorage.setItem('access_token', response.accessToken);

        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
