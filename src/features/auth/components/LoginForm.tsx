import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, CircularProgress, Container, TextField, Typography, Box } from '@mui/material';
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
      } catch (err) {
        const error = err as AxiosError
        setError(error.response?.statusText || 'Login failed')
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
          <Typography>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{width: '100%'}}>
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
              '& .MuiInputLabel-root': { mb: 1, color: '#1a202c' },
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
              '& .MuiInputLabel-root': { mb: 1, color: '#1a202c' },
              '& .MuiOutlinedInput-root': { mt: 1 },
              '& .MuiInputBase-input': { color: '#1a202c' }
            }}
          />

          <Button
            type="submit"
            disabled={isLoading}
            variant="contained"
            fullWidth
            size='large'
            sx={{ mt: 2, py: 1.5 }}
          >
            {isLoading && (
              <Box sx={{ position: 'absolute', color: 'primary.light' }}>
                <CircularProgress size={24} />
                <span style={{ visibility: 'hidden' }}>
                  Sign In
                </span>
              </Box>
            )}
            {!isLoading && 'Sign In'}
          </Button>
        </Box>
      </Container>
    );
};