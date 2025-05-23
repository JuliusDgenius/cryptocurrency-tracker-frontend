import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/auth';
import { RequestPasswordResetDto, RequestPasswordResetSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Button, Box, TextField, CircularProgress, Alert } from '@mui/material';
import { handleApiError } from '../../../utils/errorHandler';

export const RequestPasswordResetForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RequestPasswordResetDto>({
    resolver: zodResolver(RequestPasswordResetSchema)
  });

  const onSubmit = async (data: RequestPasswordResetDto) => {
    try {
      setIsLoading(true);
      const response = await authApi.requestPasswordReset(data);
      // show success message/redirect
      setSuccess(response?.data?.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      // handle error
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
      }} 
      >

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
                  Send Instructions
                </span>
              </Box>
            )}
            {!isLoading && 'Send Reset Instructions'}
          </Button>
      </Box>
    </Container>
  );
}
