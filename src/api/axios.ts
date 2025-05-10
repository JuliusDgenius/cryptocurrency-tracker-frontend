import axios from "axios";
import { authApi } from "./auth";
import { useAuth } from "../hooks/useAuth";

// Create an Axios instance with default settings
export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Add request interceptors for auth headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedRequests: any[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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
        useAuth().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);