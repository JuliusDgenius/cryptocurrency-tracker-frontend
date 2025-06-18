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

// Track if we're already redirecting to login
let isRedirectingToLogin = false;

// Add request interceptors for auth headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  // Don't add auth headers for login/register requests
  if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
    return config;
  }

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
      const errorMessage = 'Network error - unable to reach server';
      getGlobalShowError()?.(errorMessage);
      return Promise.reject({ response: { data: { message: errorMessage }, status: 503 } });
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already on the login page or trying to refresh, don't retry
      if (window.location.pathname === '/login' || originalRequest.url?.includes('/auth/refresh')) {
        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true;
          useAuth().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

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
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        api.defaults.headers.Authorization = `Bearer ${tokens.accessToken}`;

        failedRequests.forEach((cb) => cb());
        failedRequests = [];
        return api(originalRequest);
      } catch (refreshError) {
        // Clear all auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Only redirect if we're not already redirecting
        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true;
          getGlobalShowError()?.('Session expired. Please login again');
          useAuth().logout();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || handleApiError(error);
    
    // Special handling for unverified email
    if (error.response?.status === 401 && errorMessage === 'Please verify your email first') {
      const showError = getGlobalShowError();
      if (showError) {
        showError('Please verify your email first. Click the Resend Verification button below.');
        // Handle resend verification separately
        const email = localStorage.getItem('lastLoginEmail');
        if (email) {
          try {
            await authApi.resendVerificationEmail(email);
            showError('Verification email sent. Please check your inbox.');
          } catch (err) {
            showError('Failed to resend verification email. Please try again.');
          }
        }
      }
      return Promise.reject(error);
    }
    
    // Don't show error for 401s as they're handled above
    if (error.response?.status !== 401) {
      const showError = getGlobalShowError();
      if (showError) {
        showError(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);