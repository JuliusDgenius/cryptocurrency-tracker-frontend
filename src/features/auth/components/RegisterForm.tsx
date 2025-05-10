import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { RegisterDto } from '../../../types/auth';
import { registerSchema } from '../../../schemas/auth';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from '../../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const { 
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterDto>({
        resolver: zodResolver(registerSchema),
    });

    const { registerContext } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterDto) => {
      try {
        setIsLoading(true);
        await registerContext(data);
        navigate('/login');        // TODO: store token and redirect
      } catch (err) {
        const error = err as AxiosError
        setError(error.response?.statusText || 'Registration failed')
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
              type="text"
              label="name"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
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
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
        </form>
    );
};