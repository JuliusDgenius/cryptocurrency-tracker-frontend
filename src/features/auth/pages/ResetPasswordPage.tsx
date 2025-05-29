import { useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { Box, Container, Typography } from '@mui/material';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  console.log('searchParams:', searchParams);
  const token = searchParams.get('token');
  console.log('Token:', token)
  if (!token) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', p: 4
      }}>
        <Box sx={{ 
          width: '100%', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Reset Password
            </Typography>
            <ResetPasswordForm token={token} />
          </Box>
    </Container>
  );
};

export default ResetPasswordPage;