export type User = {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    preferences: {
        currency?: string;
        theme?: string;
        notificationsEnabled: boolean;
    }
};

export type Token = {
    accessToken: string;
    refreshToken: string;
};

export interface RegisterDto {
    email: string;
    name: string;
    password: string;
};

export interface LoginDto {
    email: string;
    password: string;
};

export interface VerifyEmailDto {
  token: string;
};

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export interface RequestPasswordResetDto {
  email: string;
};

export interface DeleteAccountDto {
  password: string;
  reason?: string;
};