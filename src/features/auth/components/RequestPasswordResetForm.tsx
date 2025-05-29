import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../../api/auth';
import { RequestPasswordResetDto, requestPasswordResetSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Button, Box, TextField,
  CircularProgress, Alert, Typography,
  Link as MuiLink, List, ListItem, ListItemIcon, Paper
 } from '@mui/material';
 import CheckIcon from '@mui/icons-material/Check';
 import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { handleApiError } from '../../../utils/errorHandler';

export const RequestPasswordResetForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  // const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RequestPasswordResetDto>({
    resolver: zodResolver(requestPasswordResetSchema)
  });

  const onSubmit = async (data: RequestPasswordResetDto) => {
    try {
      setIsLoading(true);
      const response = await authApi.requestPasswordReset(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      // show success message/redirect
      setSuccess(response?.data?.message);
      reset({ email: '' });
    } catch (err) {
      // handle error
      const error = handleApiError(err);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state UI
  if (isSubmitted) {
    return (
      <Box component="section" sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper'
      }}>
        <Box sx={{ 
          maxWidth: 448,
          width: '100%',
          p: 3,
          position: 'relative'
        }}>
          {/* Back Link */}
          <MuiLink 
            component={Link}
            to="/sign-in"
            sx={{
              display: { xs: 'none', xl: 'flex' },
              alignItems: 'center',
              position: 'absolute',
              top: -32,
              left: 0,
              color: 'text.primary',
              '&:hover': { 
                color: '#00A3FC',
                textDecoration: 'underline'
              },
              '&:focus': {
                outline: 'none',
                ring: 2,
                borderColor: '#00A3FC',
                ringColor: '#00A3FC'
              }
            }}
          >
            <ArrowBackIcon fontSize="small" />
            <Typography component="span" sx={{ ml: 0.5 }}>Back</Typography>
          </MuiLink>
    
          {/* Content Container */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}>
            {/* Success Icon */}
            <Box sx={{
              width: 64,
              height: 64,
              bgcolor: 'success.light',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}>
              <CheckIcon sx={{ fontSize: 32, color: 'success.main' }} />
            </Box>
    
            {/* Heading */}
            <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
              Check Your Email
            </Typography>
    
            <Box sx={{ maxWidth: 'md', width: '100%' }}>
              {/* Instruction Text */}
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                We've sent password reset instructions to:
              </Typography>
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                {submittedEmail}
              </Typography>
    
              {/* Info Box */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  bgcolor: 'info.light', 
                  borderColor: 'info.main',
                  p: 3,
                  textAlign: 'left',
                  mb: 4
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Next steps:
                </Typography>
                <List dense sx={{ p: 0, listStyleType: 'disc', pl: 2 }}>
                  <ListItem sx={{ display: 'list-item', p: 0, color: 'text.secondary' }}>
                    <ListItemIcon sx={{ minWidth: 24, color: 'inherit' }}>•</ListItemIcon>
                    Check your email inbox and spam folder
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, color: 'text.secondary' }}>
                    <ListItemIcon sx={{ minWidth: 24, color: 'inherit' }}>•</ListItemIcon>
                    Click the reset link within <Box component="strong" sx={{ ml: 0.5 }}>30 minutes</Box>
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, color: 'text.secondary' }}>
                    <ListItemIcon sx={{ minWidth: 24, color: 'inherit' }}>•</ListItemIcon>
                    Create your new password
                  </ListItem>
                </List>
              </Paper>
    
              {/* Buttons */}
              <Box sx={{ '& > *': { mb: 2 }, '& > *:last-child': { mb: 0 } }}>
                <MuiLink component={Link} to='/request-reset' underline='none'>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubmittedEmail("");
                    }}
                    sx={{ py: 1.5 }}
                  >
                    Try Different Email
                  </Button>
                </MuiLink>
                
                <MuiLink component={Link} to="/login" underline="none">
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ py: 1.5, mt: 1.5 }}
                  >
                    Back to Sign In
                  </Button>
                </MuiLink>
              </Box>
    
              {/* Footer */}
              <Box sx={{ 
                borderTop: 1, 
                borderColor: 'divider', 
                pt: 3, 
                mt: 4 
              }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Didn't receive the email? Check your spam folder or{' '}
                  <MuiLink 
                    component={Link} 
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubmittedEmail("");
                    }}
                    sx={{ 
                      color: 'primary.main', 
                      '&:hover': { textDecoration: 'underline' } 
                    }}
                  >
                    try again
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Initial state
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
