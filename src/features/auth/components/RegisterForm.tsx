import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, CircularProgress, Container, TextField, Typography, Box } from '@mui/material';
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
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>

          {error && (
            <Alert severity='error' sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <TextField 
            fullWidth
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            variant='outlined'
            sx={{
              '& .MuiInputLabel-root': { mb: 1 },
              '& .MuiOutlinedInput-root': { mt: 1 },
              '& .MuiInputBase-input': { color: '#1a202c' },
            }}
          />

          <TextField 
            fullWidth
            type="text"
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
            variant='outlined'
            sx={{
              '& .MuiInputLabel-root': { mb: 1 },
              '& .MuiOutlinedInput-root': { mt: 1 },
              '& .MuiInputBase-input': { color: '#1a202c' },
            }}
          />

          <TextField 
            fullWidth
            type="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            variant='outlined'
            sx={{
              '& .MuiInputLabel-root': { mb: 1 },
              '& .MuiOutlinedInput-root': { mt: 1 },
              '& .MuiInputBase-input': { color: '#1a202c' },
            }}
          />

          <Button
            type="submit"
            disabled={isLoading}
            variant="contained"
            fullWidth
            size='large'
            sx={{ mt: 2, py: 1.5, position: 'relative' }}
          >
            {isLoading && (
              <Box sx={{ position: 'absolute', color: 'primary.light' }}>
                <CircularProgress size={24} />
                <span style={{ visibility: 'hidden' }}>
                  Sign Up
                </span>
              </Box>
            )}
            {!isLoading && 'Sign Up'}
          </Button>
        </Box>
      </Container>
    );
};