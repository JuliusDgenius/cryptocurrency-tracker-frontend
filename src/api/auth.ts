import { Token, LoginDto, RegisterDto, VerifyEmailDto, 
  ResetPasswordDto, DeleteAccountDto, 
} from '../types/auth';
import { api } from './axios';

export const authApi = {
  // Core Authentication
  register: async (data: RegisterDto) => {
    return api.post('/auth/register', data);
  },
  login: async (data: LoginDto) => {
    return api.post<Token>('/auth/login', data);
  },
  logout: async () => api.post('/auth/logout'),
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/refresh', { refreshToken });
  },

  // Email verification
  verifyEmail: async (data: VerifyEmailDto) => {
    return api.post('/auth/verify-email', data);
  },

  // Password Management
  requestPasswordReset: async (email: string) => {
    return api.post('/auth/password-reset-request', email);
  },
  resetPassword: async (data: ResetPasswordDto) => {
    return api.post('/auth/reset-password', data);
  },

  // Account Management
  deleteAccount: async (data: DeleteAccountDto) => {
    return api.delete('/auth/account-delete', { data });
  },

  // 2FA
  setup2FA: async () => {
    api.post<{ secret: string, qrCode: string }>('/auth/setup-2fa');
  },
  verify2FA: async (token: string) => {
    api.post('/auth/verify-2fa', token);
  },
  disable2FA: async () => {'/auth/disable-2fa'},
};