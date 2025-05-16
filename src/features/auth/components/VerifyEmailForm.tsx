import { useForm } from "react-hook-form";
import { Alert, Button, Container, TextField, Typography, Box } from "@mui/material";
import { VerifyEmailDto } from "../../../types/auth";
import { authApi } from "../../../api/auth";
import { useState } from 'react';

export const VerifyEmailForm = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; 'text': string } | null>(null);

  const { register, handleSubmit } = useForm<VerifyEmailDto>();

  const onSubmit = async (data: VerifyEmailDto) => {
    try {
      await authApi.verifyEmail(data);
      setMessage({ type: 'success', text: 'Email successfully verified' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Verification failed. Please try again' });
    }
  };

  return (
    <Container maxWidth='sm'>
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
      <Typography variant='h4' component='h1' gutterBottom>
        Verify Email
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      )}

      <TextField
        label='Verification Token'
        {...register('token')}
        fullWidth
        variant='outlined'
        required
        sx={{
          '& .MuiInputLabel-root': { mb: 1 },
          '& .MuiOutlinedInput-root': { mt: 1 },
          '& .MuiInputBase-input': { color: '#1a202c' },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        sx={{ py: 1.5 }}
      >
        Verify Email
      </Button>
    </Box>
  </Container>
  );
};