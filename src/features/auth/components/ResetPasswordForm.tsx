import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, CircularProgress, Container, 
    TextField, Box, Typography, Alert } from '@mui/material';
import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { handleApiError } from '@/utils/errorHandler';
import { ResetPasswordDto } from '@/types/auth';
import { resetPasswordFormSchema, ResetPasswordFormValues } from '@/schemas/auth';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema)
  });

  const onSubmit = async (data: ResetPasswordDto) => {
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    const payload = {
      newPassword: data.newPassword,
      token
    };

    try {
      setIsLoading(true);
      const response = await authApi.resetPassword(payload);
      setSuccess(response?.data?.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const error = handleApiError(err);
      setError(error);
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
        }}>
          <Typography variant='h4' component="h1" gutterBottom>
            Reset Password
          </Typography>

          {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            type='password'
            label='New Password'
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            {...register('newPassword')}
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
            type='password'
            label='Confirm Password'
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register('confirmPassword')}
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
            type='submit'
            disabled={isLoading}
            variant='contained'
            fullWidth
            size='large'
            sx={{ mt: 2, py: 1.5, position: 'relative' }}
          >
            {isLoading && (
              <Box sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}>
                <CircularProgress size={24} color='inherit' />
                <span style={{ visibility: 'hidden' }}>
                  Reset Password
                </span>                
              </Box>
            )}
            {!isLoading && 'Reset Password'}
          </Button>
        </Box>
    </Container>
  );
};

export default ResetPasswordForm;