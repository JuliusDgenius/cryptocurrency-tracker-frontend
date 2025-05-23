import { Typography, Container, Box } from "@mui/material";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
    return (
      <Container maxWidth="md" sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', p: 4
      }}>
        <Box sx={{ width: '100%', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">LOGIN</Typography>
            <LoginForm />
        </Box>
      </Container>
    );
};