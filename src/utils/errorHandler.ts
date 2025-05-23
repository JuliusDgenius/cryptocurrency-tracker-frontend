import { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
  const axiosError = error as AxiosError;

  if (!axiosError.response) {
    // Network error or server completely down
    return 'Unable to connect to the server. Please check your internet connection';
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data as {message?: string};

  switch (status) {
    case 500:
      return data?.message || 'Internal server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. The server is taking too long to respond.';
    default:
      return data?.message || 'An unexpected error occurred.';
  }
};