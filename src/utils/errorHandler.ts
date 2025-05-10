import { AxiosError } from 'axios';

export const handleAuthError = (error: AxiosError) => {
  const message = error.response?.statusText || 'Authentication error';
  
  if (error.response?.status === 401) {
    // Handle token expiration
  }
  
  return {
    success: false,
    message
  };
};