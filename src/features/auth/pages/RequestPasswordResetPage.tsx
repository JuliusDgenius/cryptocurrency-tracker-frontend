import { Container, Box, Typography } from "@mui/material";
import { RequestPasswordResetForm } from "../components/RequestPasswordResetForm";

export const PasswordResetRequestPage = () => {
    return (
      <Container maxWidth="md" sx={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', p: 4
        }}>
        <Box sx={{ width: '100%', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">Reset Password</Typography>
          <RequestPasswordResetForm />
        </Box>
      </Container>
    );
};