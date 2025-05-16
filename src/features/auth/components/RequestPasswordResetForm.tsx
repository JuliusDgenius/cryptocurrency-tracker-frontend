import { Button, TextField, Container, Box, Alert, LinearProgress } from '@mui/material';
import { authApi } from '../../../api/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RequestPasswordResetDto } from '../../../types/auth';
import { RequestPasswordResetSchema } from '../../../schemas/auth';
import { z } from 'zod';

export const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      RequestPasswordResetSchema.parse({ email });
      const data: RequestPasswordResetDto = { email };
      await authApi.requestPasswordReset(data);
      setSuccess(true);
      // onSubmit(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError('Failed to send reset instructions. Please try again');
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <Container maxWidth='sm'>
      <Box sx={{ mt: 8 }}>
        {/* <Typography variant='h4' component='h1' gutterBottom>Reset Password</Typography> */}

        {isLoading && <LinearProgress sx={{ my: 2 }} />}

        {success ? (
          <Alert severity='success' sx={{ my: 3 }}>
            Instructions sent to {email}. Check your email and follow the link.
          </Alert>
        ) : (
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3, gap: 2 }}>
            <TextField
              fullWidth
              label='Email'
              variant='outlined'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type='email'
              sx={{
                '& .MuiInputLabel-root': { mb: 1 },
                '& .MuiOutlinedInput-root': { mt: 1 },
                '& .MuiInputBase-input': { color: '#1a202c' },
              }}
          />

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button 
            type='submit'
            variant='contained'
            fullWidth
            size='large'
            sx={{ py: 1.5, mt: 2 }}
          >
            Send Reset Link
          </Button>
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Link to="/login">
          Back to Login
        </Link>
      </Box>
      </Box>
    </Container>
  );
};