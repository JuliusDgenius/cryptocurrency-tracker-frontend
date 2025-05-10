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

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;