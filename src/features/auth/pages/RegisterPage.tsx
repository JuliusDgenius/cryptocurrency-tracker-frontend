import { RegisterForm } from "../components/RegisterForm";
import { Container, Box, Typography } from '@mui/material';

export const RegisterPage = () => {
    return (
      <Container maxWidth="md" sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', p: 4
      }}>
        <Box sx={{ width: '100%', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">Create Account</Typography>
            <RegisterForm />
        </Box>
      </Container>
    );
};