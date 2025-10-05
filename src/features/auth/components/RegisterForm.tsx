import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Alert, Button, 
  CircularProgress, Container, 
  TextField, Box 
} from '@mui/material';
import { RegisterDto } from '@/types/auth';
import { registerSchema } from '@/schemas/auth';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '@/utils/errorHandler';

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
          type="text"
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
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