import { Box, Typography, Button } from '@mui/material';

interface EmptyDashboardProps {
  onCreatePortfolio: () => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onCreatePortfolio }) => {
  return (
    <Box sx={{ 
      textAlign: 'center',
      p: 4,
      bgcolor: 'background.paper',
      borderRadius: 4,
      boxShadow: 1,
      maxWidth: 600,
      mx: 'auto',
      my: 4
    }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome to Your Crypto Portfolio!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You don't have any portfolios yet. Create your first portfolio to start tracking your crypto investments.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={onCreatePortfolio}
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Create Your First Portfolio
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          sx={{ px: 4, py: 1.5 }}
          onClick={() => window.open('https://learn.cryptotracker.com', '_blank')}
        >
          Learn How It Works
        </Button>
      </Box>
    </Box>
  );
}

export default EmptyDashboard;