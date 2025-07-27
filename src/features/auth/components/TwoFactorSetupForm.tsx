import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert, Button,
  CircularProgress,
  Container, TextField,
  Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Setup2FADto, TwoFASetupResponse } from '../../../types/auth';
import { useState, useEffect } from 'react';
import { authApi } from '../../../api/auth';
import { handleApiError } from '../../../utils/errorHandler';
import { z } from 'zod';

const setup2FASchema = z.object({
  totpCode: z.string()
    .length(6, 'TOTP code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'TOTP code must contain only numbers'),
});

interface TwoFactorSetupFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TwoFactorSetupForm = ({ open, onClose, onSuccess }: TwoFactorSetupFormProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [setupData, setSetupData] = useState<TwoFASetupResponse | null>(null);

  const { 
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Setup2FADto>({
    resolver: zodResolver(setup2FASchema),
  });

  // Initialize 2FA setup when dialog opens
  useEffect(() => {
    if (open && !setupData) {
      initializeSetup();
    }
  }, [open]);

  const initializeSetup = async () => {
    try {
      setIsInitializing(true);
      setError('');
      const response = await authApi.initiate2FASetup();
      setSetupData(response.data);
    } catch (err) {
      const error = handleApiError(err);
      setError(error);
    } finally {
      setIsInitializing(false);
    }
  };

  const onSubmit = async (data: Setup2FADto) => {
    if (!setupData) {
      setError('Setup data not available. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await authApi.complete2FASetup({
        ...data,
        secret: setupData.secret
      });
      
      onSuccess();
      onClose();
      reset();
      setSetupData(null);
    } catch (err) {
      const error = handleApiError(err);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setSetupData(null);
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="h2">
          Set Up Two-Factor Authentication
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isInitializing ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : setupData ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Scan the QR code below with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator):
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={setupData.qrCodeUrl} 
                  alt="QR Code for 2FA Setup"
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    maxWidth: '200px',
                    height: 'auto'
                  }}
                />
              </Box>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Or manually enter this secret key:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    bgcolor: 'white', 
                    p: 1, 
                    borderRadius: 0.5,
                    wordBreak: 'break-all'
                  }}
                >
                  {setupData.secret}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                After scanning the QR code, enter the 6-digit code from your authenticator app to complete setup:
              </Typography>

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
                  '& .MuiInputBase-input': {
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    letterSpacing: '0.5em',
                  },
                }}
              />
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading || !setupData}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Complete Setup'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 