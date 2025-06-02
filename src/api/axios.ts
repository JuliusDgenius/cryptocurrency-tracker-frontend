import axios from "axios";
import { authApi } from "./auth";
import { getGlobalShowError } from './errorHandlerRef';
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../utils/errorHandler";

// Create an Axios instance with default settings
export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Add request interceptors for auth headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  if (config.url?.includes('/auth/refresh') && refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedRequests: any[] = [];

// Response interceptors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      error.response = {
        data: {message: 'Network error - unable to reach server'},
        status: 503
      };
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequests.push(() => resolve(api(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data: tokens } = await authApi.refreshToken();
        localStorage.setItem('accessToken', tokens.accessToken);
        // If s refresh token id provided, store it. (for token rotation)
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        api.defaults.headers.Authorization = `Bearer ${tokens.accessToken}`

        failedRequests.forEach((cb) => cb);
        failedRequests = [];
        return api(originalRequest);
      } catch (refreshError) {
        // Get global error display function
        getGlobalShowError()?.('Session expired. Please login again');

        useAuth().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false;
      }
    }

    // Generic error handling
    const errorMessage = handleApiError(error);
    error.response.data.message = errorMessage;

    // show error using global handling
    const showError = getGlobalShowError();
    if (showError) {
      showError(errorMessage);
    }

    return Promise.reject(error);
  }
);