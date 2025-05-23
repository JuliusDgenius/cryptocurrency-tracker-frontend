import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be atleast 8 characters'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().nonempty('Must provide a name'),
    password: z.string().min(8, 'Password must be atleast 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            'Password must include at least one uppercase letter, one lowercase letter, and one number'),
});

export const RequestPasswordResetSchema = z.object({
    email: z.string().email('Invalid email format'),
});

// Create schema for password reset validation
export const resetPasswordSchema = z.object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    token: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type RequestPasswordResetDto = z.infer<typeof RequestPasswordResetSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;