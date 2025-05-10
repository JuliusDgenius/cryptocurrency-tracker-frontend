import { Button, TextField, Typography, Container } from '@mui/material';
import { authApi } from '../../../api/auth';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
      setError('Failed to send reset instructions. Please try again');
      setSuccess(false);
    }
  };

  return (
    <Container maxWidth='sm' className='mt-10'>
      <Typography variant='h4' gutterBottom>Reset Password</Typography>

      {success ? (
        <div className='text-green-600 mb-4'>
          Instructions sent to {email}. Check your email and follow the link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <TextField
            fullWidth
            label='Email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type='email'
          />

          {error && <div className='text-red-500'>{error}</div>}

          <Button 
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
          >
            Send Reset Link
          </Button>
        </form>
      )}

      <div className='mt-4 text-center'>
        <Link to="/login" className='text-blue-500 hover:underline'>
          Back to Login
        </Link>
      </div>
    </Container>
  );
};