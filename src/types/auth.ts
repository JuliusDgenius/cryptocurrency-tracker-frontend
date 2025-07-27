export type User = {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    twoFactorEnabled?: boolean;
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

export type TempToken = {
    require2FA: boolean;
    tempToken: string;
};

export type LoginResponse = Token & { user: User } | TempToken;

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
  newPassword: string;
  token?: string;
};

export interface RequestPasswordResetDto {
  email: string;
};

export interface DeleteAccountDto {
  password: string;
  reason?: string;
};

export interface Setup2FADto {
  totpCode: string;
};

export interface Verify2FADto {
  totpCode: string;
};

export interface TwoFASetupResponse {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
};