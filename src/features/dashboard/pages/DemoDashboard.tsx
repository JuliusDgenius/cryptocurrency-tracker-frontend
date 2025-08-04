import { useEffect, useState } from 'react';
import { 
  Container, Box, Typography, Button, CircularProgress, Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AssetDistributionData, Portfolio, RecentActivityData } from '@/types/dashboard';
import PortfolioSummary from '../components/PortfolioSummary';
import AssetDistribution from '../components/AssetDistribution';
import RecentActivity from '../components/RecentActivity';
import PerformanceChart from '../components/PerformanceChart';

// Mock data for demo
const demoPortfolio: Portfolio = {
  id: 'demo',
  name: 'Demo Portfolio',
  totalValue: 12450.75,
  twentyFourHourChange: 2.34,
  isPrimary: true,
  createdAt: '2023-01-15',
  lastUpdated: '2023-10-20',
  profitLoss: {
    day: 150.25,
    week: 320.50,
    month: 1245.75,
    year: 5450.25,
    twentyFourHour: 0,
    allTime: 7450.75
  }
};

const demoAssets: AssetDistributionData[] = [
  { 
    id: '1', 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    allocation: 45, 
    value: 5602.50, 
    twentyFourHourChange: 1.8, 
    quantity: 0.15,
    averageBuyPrice: 37500, 
    currentPrice: 38000, 
    profitLoss: 75,
    profitLossPercentage: 2, 
    category: 'Cryptocurrency',
    marketCap: 740000000000 // Added marketCap
  },
  { 
    id: '2', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    allocation: 30, 
    value: 3735.25, 
    twentyFourHourChange: 3.2, 
    quantity: 1.2,
    averageBuyPrice: 3000, 
    currentPrice: 3112.7, 
    profitLoss: 135.24,
    profitLossPercentage: 3.2, 
    category: 'Cryptocurrency',
    marketCap: 370000000000 // Added marketCap
  },
  { 
    id: '3', 
    symbol: 'SOL', 
    name: 'Solana', 
    allocation: 15, 
    value: 1867.50, 
    twentyFourHourChange: 5.7, 
    quantity: 12,
    averageBuyPrice: 24.50, 
    currentPrice: 28.5, 
    profitLoss: 48,
    profitLossPercentage: 16.3, 
    category: 'Cryptocurrency',
    marketCap: 15000000000 // Added marketCap
  },
  { 
    id: '4', 
    symbol: 'ADA', 
    name: 'Cardano', 
    allocation: 10, 
    value: 1245.50, 
    twentyFourHourChange: -0.5, 
    quantity: 500,
    averageBuyPrice: 0.25, 
    currentPrice: 0.249, 
    profitLoss: -1,
    profitLossPercentage: -0.5, 
    category: 'Cryptocurrency',
    marketCap: 10000000000 // Added marketCap
  }
];


const demoTransactions: RecentActivityData[] = [
  { 
    id: '1', type: 'BUY', asset: 'Bitcoin', symbol: 'BTC', 
    amount: 0.15, price: 37500, timestamp: '2023-10-15T14:30:00Z',
    totalValue: 5625, // Added totalValue
    status: 'COMPLETED' // Added status
  },
  { 
    id: '2', type: 'SELL', asset: 'Ethereum', symbol: 'ETH', 
    amount: 1.2, price: 1850, timestamp: '2023-10-12T09:45:00Z',
    totalValue: 2220, // Added totalValue
    status: 'COMPLETED' // Added status
  },
  { 
    id: '3', type: 'BUY', asset: 'Solana', symbol: 'SOL', 
    amount: 12, price: 24.50, timestamp: '2023-10-10T11:20:00Z',
    totalValue: 294, // Added totalValue
    status: 'COMPLETED' // Added status
  },
  { 
    id: '4', type: 'STAKING', asset: 'Cardano', symbol: 'ADA', 
    amount: 500, price: 0.25, timestamp: '2023-10-05T16:15:00Z',
    totalValue: 125, // Added totalValue
    status: 'COMPLETED' // Added status
  }
];


const performanceChartProps = {
  portfolioId: 'demo', // Use a demo ID
  timeFrame: '7d', // Define a default time frame
  onTimeFrameChange: () => {}, // Provide a mock function
  detailedView: true,
};

const DemoDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 10, px: 2, pb: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Demo Portfolio
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Explore CryptoFolio's features with this interactive demo. Sign up to create your own portfolio.
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 4, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Ready to start tracking your own portfolio?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Create an account to unlock all features and start managing your cryptocurrency investments.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/register"
              sx={{ mr: 2 }}
            >
              Sign Up Free
            </Button>
            <Button 
              variant="outlined"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <PerformanceChart {...performanceChartProps} />
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <PortfolioSummary 
            portfolio={demoPortfolio}
            demoMode
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AssetDistribution 
            assets={demoAssets}
            demoMode
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <RecentActivity 
          transactions={demoTransactions}
          demoMode
        />
      </Box>
    </Container>
  );
};

export default DemoDashboard;