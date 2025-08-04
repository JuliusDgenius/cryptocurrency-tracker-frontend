import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert, Button,
  CircularProgress,
  Container, TextField,
  Typography, Box 
} from '@mui/material';
import { LoginDto } from '@/types/auth';
import { loginSchema } from '@/schemas/auth';
import { useState } from 'react';
import { authApi } from '@/api/auth';
import { handleApiError } from '@/utils/errorHandler';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { TwoFactorVerificationForm } from './TwoFactorVerificationForm';

export const LoginForm = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const { 
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      const email = getValues('email');
      await authApi.resendVerificationEmail(email);
      setError('Verification email sent. Please check your inbox.');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: LoginDto) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authApi.login(data);
      
      // Check if 2FA is required
      if ('require2FA' in response.data && response.data.require2FA) {
        setTempToken(response.data.tempToken);
        return;
      }
      
      // Normal login flow
      await login(response.data);
      navigate('/dashboard');
    } catch (err) {
      const error = handleApiError(err);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setTempToken(null);
    setError('');
  };

  // Show 2FA verification form if temp token exists
  if (tempToken) {
    return <TwoFactorVerificationForm tempToken={tempToken} onBack={handleBackToLogin} />;
  }

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
        {error && (
          <Alert severity="error" sx={{width: '100%'}}>
            {error}
            {error === 'Please verify your email first' && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                sx={{ ml: 2 }}
                size="small"
              >
                {isResending ? 'Sending...' : 'Resend Verification'}
              </Button>
            )}
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
              '& .MuiInputLabel-root': {
                mb: 1,
                color: '#111827',
                fontWeight: 600,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6b7280', // Gray birder for visibility
                  borderWidth: '1.5px'
                },
                '&:hover fieldset': {
                  borderColor: '#374151', // Darker gray on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2', // primary color
                  boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)', // Subtle glow
                },
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
              },
              '& .MuiInputBase-input': {
                color: '#111827', // Darker text color
                padding: '14px 16px', // Better padding
                '&::placeholder': {
                  color: '#6b7280', // Gray placeholder
                  opacity: 1,
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#6b7280', // Helper text color
                fontSize: '0.875rem', // Smaller font
                marginLeft: 0,
                mt: 1,
              },
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
              '& .MuiInputLabel-root': {
                mb: 1,
                color: '#111827',
                fontWeight: 600,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6b7280', // Gray birder for visibility
                  borderWidth: '1.5px'
                },
                '&:hover fieldset': {
                  borderColor: '#374151', // Darker gray on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2', // primary color
                  boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)', // Subtle glow
                },
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
              },
              '& .MuiInputBase-input': {
                color: '#111827', // Darker text color
                padding: '14px 16px', // Better padding
                '&::placeholder': {
                  color: '#6b7280', // Gray placeholder
                  opacity: 1,
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#6b7280', // Helper text color
                fontSize: '0.875rem', // Smaller font
                marginLeft: 0,
                mt: 1,
              },
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
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant='body2'>
            <Link to="/request-reset" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};