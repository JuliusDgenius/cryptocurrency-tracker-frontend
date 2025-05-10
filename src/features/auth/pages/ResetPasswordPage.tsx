import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Container } from '@mui/material';
import { authApi } from '../../../api/auth';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  token: z.string().min(1, 'Reset token is required')
});

type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = 
    useForm<ResetPasswordDto>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        token: searchParams.get('token') || ''
      }
    });

  const onSubmit = async (data: ResetPasswordDto) => {
    try {
      await authApi.resetPassword({ token: data.token, newPassword: data.password });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Password reset failed. The token may be invalid or expired.');
      setSuccess(false);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Typography variant="h4" gutterBottom>Set New Password</Typography>

      {success ? (
        <div className="text-green-600 mb-4">
          Password updated successfully! <br />
          <Link to="/login" className="text-blue-500 hover:underline">
            Proceed to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="Reset Token"
            variant="outlined"
            {...register('token')}
            error={!!errors.token}
            helperText={errors.token?.message}
            disabled={!!searchParams.get('token')}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {error && <div className="text-red-500">{error}</div>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Reset Password
          </Button>
        </form>
      )}
    </Container>
  );
};