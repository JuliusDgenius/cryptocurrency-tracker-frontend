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

export const requestPasswordResetSchema = z.object({
    email: z.string().email('Invalid email format'),
});

// Create schema for password reset validation
export const resetPasswordFormSchema = z.object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

  export const resetPasswordApiSchema = z.object({
    newPassword: z.string().min(8),
    token: z.string()
  });

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type RequestPasswordResetDto = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordApiSchema>