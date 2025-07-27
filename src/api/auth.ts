import { Token, LoginDto, RegisterDto, VerifyEmailDto, 
  ResetPasswordDto, DeleteAccountDto, LoginResponse, Setup2FADto, 
  Verify2FADto, TwoFASetupResponse
} from '../types/auth';
import { api } from './axios';

export const authApi = {
  // Core Authentication
  register: async (data: RegisterDto) => {
    return api.post('/auth/register', data);
  },
  login: async (data: LoginDto) => {
    // Store email for potential verification resend
    localStorage.setItem('lastLoginEmail', data.email);
    return api.post<LoginResponse>('/auth/login', data);
  },
  logout: async () => {
    localStorage.removeItem('lastLoginEmail');
    return api.post('/auth/logout');
  },
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/refresh', { refreshToken });
  },

  // Email verification
  verifyEmail: async (data: VerifyEmailDto) => {
    return api.post('/auth/verify-email', data);
  },
  resendVerificationEmail: async (email: string) => {
    return api.post('/auth/resend-verification', { email });
  },

  // Password Management
  requestPasswordReset: async (data: { email: string }) => {
    return api.post('/auth/password-reset-request', data);
  },
  resetPassword: async (data: ResetPasswordDto) => {
    return api.post('/auth/reset-password', data);
  },

  // Account Management
  deleteAccount: async (data: DeleteAccountDto) => {
    return api.delete('/auth/account-delete', { data });
  },

  // 2FA Setup and Management
  initiate2FASetup: async () => {
    return api.post<TwoFASetupResponse>('/auth/initiate-2fa-setup');
  },
  complete2FASetup: async (data: Setup2FADto & { secret: string }) => {
    return api.post('/auth/complete-2fa-setup', data);
  },
  verify2FA: async (data: Verify2FADto & { tempToken: string }) => {
    return api.post<Token & { user: any }>('/auth/verify-2fa', data);
  },
  disable2FA: async () => {
    return api.post('/auth/disable-2fa');
  },
};