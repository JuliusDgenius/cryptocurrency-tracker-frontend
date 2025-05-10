import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { LoginDto } from '../../../types/auth';
import { loginSchema } from '../../../schemas/auth';
import { useState } from 'react';
import { authApi } from '../../../api/auth';
import { AxiosError } from 'axios';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const { 
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
    });

    const { login } = useAuth();
    const navigate = useNavigate();
  

    const onSubmit = async (data: LoginDto) => {
      try {
        setIsLoading(true);
        const response = await authApi.login(data);
        await login(response.data);
        navigate('/dashboard')
        // TODO: store token and redirect
      } catch (err) {
        const error = err as AxiosError
        setError(error.response?.statusText || 'Login failed')
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-md space-y-4'>
          {error && <div className='text-red-500'>{error}</div>}

            <TextField 
              fullWidth
              label="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <TextField 
              fullWidth
              type="password"
              label="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              fullWidth
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>
    );
};