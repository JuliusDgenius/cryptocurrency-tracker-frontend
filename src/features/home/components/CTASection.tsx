import { Box, Button, Container, Typography } from '@mui/material';
import { ArrowRightAlt } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const CTASection = () => {
  const { user } = useAuth();

  return (
    <Container
      sx={{
        py: { xs: 8, md: 10 },
        mb: { xs: 4, md: 6 },
        textAlign: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          fontWeight: 600,
        }}
      >
        Ready to optimize your crypto portfolio?
      </Typography>

            
      <Box 
        sx={{ 
          display: 'flex', 
          mt: 3, gap: 3, 
          justifyContent: 'center',
           zIndex: 1, flexWrap: 'wrap' 
        }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRightAlt />}
          component={Link}
          to={user ? '/dashboard' : '/register'}
          sx={{
            px: 4,
            py: 1.5,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        >
          {user ? 'Go to Dashboard' : 'Get Started Free'}
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          component={Link}
          to="/demo"
        >
          Live Demo
        </Button>
      </Box>
    </Container>
  );
};

export default CTASection;