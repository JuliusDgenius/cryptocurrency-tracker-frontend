import { Alert, Container, Typography, Box } from "@mui/material";
import { VerifyEmailDto } from "@/types/auth";
import { authApi } from "@/api/auth";
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

export const VerifyEmailForm = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; 'text': string } | null>(null);
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      onSubmit({ token });
    } else {
      setMessage({ type: 'error', text: 'No verification token found.' });
      setIsVerifying(false);
    }
  }, [searchParams]);

  const onSubmit = async (data: VerifyEmailDto) => {
    setIsVerifying(true);
    try {
      await authApi.verifyEmail(data);
      setMessage({ type: 'success', text: 'Email successfully verified' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Verification failed. Please try again' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box
        component="div"
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

      {isVerifying ? (
        <Typography>Verifying your email, please wait...</Typography>
      ) : (
        message && (
        <Alert severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
        )
      )}
    </Box>
  </Container>
  );
};