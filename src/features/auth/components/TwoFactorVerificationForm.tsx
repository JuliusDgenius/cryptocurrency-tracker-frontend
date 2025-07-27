import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert, Button,
  CircularProgress,
  Container, TextField,
  Typography, Box, Paper
} from '@mui/material';
import { Verify2FADto } from '../../../types/auth';
import { useState } from 'react';
import { authApi } from '../../../api/auth';
import { handleApiError } from '../../../utils/errorHandler';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const verify2FASchema = z.object({
  totpCode: z.string()
    .length(6, 'TOTP code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'TOTP code must contain only numbers'),
});

interface TwoFactorVerificationFormProps {
  tempToken: string;
  onBack: () => void;
  children?: React.ReactNode;
}

export const TwoFactorVerificationForm = ({ tempToken, onBack }: TwoFactorVerificationFormProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Verify2FADto>({
    resolver: zodResolver(verify2FASchema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: Verify2FADto) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await authApi.verify2FA({
        ...data,
        tempToken
      });
      
      await login(response.data);
      navigate('/dashboard');
    } catch (err) {
      const error = handleApiError(err);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the 6-digit code from your authenticator app
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <TextField 
            fullWidth
            label="TOTP Code"
            placeholder="123456"
            error={!!errors.totpCode}
            helperText={errors.totpCode?.message}
            {...register('totpCode')}
            variant='outlined'
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            sx={{
              '& .MuiInputLabel-root': {
                mb: 1,
                color: '#111827',
                fontWeight: 600,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#6b7280',
                  borderWidth: '1.5px'
                },
                '&:hover fieldset': {
                  borderColor: '#374151',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                  boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                },
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
              },
              '& .MuiInputBase-input': {
                color: '#111827',
                padding: '14px 16px',
                fontSize: '1.2rem',
                textAlign: 'center',
                letterSpacing: '0.5em',
                '&::placeholder': {
                  color: '#6b7280',
                  opacity: 1,
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#6b7280',
                fontSize: '0.875rem',
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
                  Verify
                </span>
              </Box>
            )}
            {!isLoading && 'Verify'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={onBack}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            Back to Login
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant='body2' color="text.secondary">
              Don't have access to your authenticator app?
            </Typography>
            <Typography variant='body2' color="text.secondary">
              Contact support for assistance.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}; 