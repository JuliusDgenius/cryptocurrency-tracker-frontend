import { useState, useEffect } from 'react';
import { useAuth } from "../../../hooks/useAuth";
import { Navbar } from "../../../components/NavBar";
import PortfolioSummary from '../components/PortfolioSummary';
import AssetDistribution from '../components/AssetDistribution';
import RecentActivity from '../components/RecentActivity';
import type { Asset, Transaction } from '../../../types/dashboard';
import { Box, Typography, CircularProgress, Container } from '@mui/material';

const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('1D');
  const [isLoading, setIsLoading] = useState(true);

  // Temporary data - same as before
  const [assets] = useState<Asset[]>([
    { name: 'Bitcoin', symbol: 'BTC', percentage: 60, value: 31458.3 },
    { name: 'Ethereum', symbol: 'ETH', percentage: 30, value: 15729.15 },
    { name: 'Other', symbol: 'OTHER', percentage: 10, value: 5243.05 },
  ]);
  const [transactions] = useState<Transaction[]>([
    { date: '2024-03-15', type: 'Buy', asset: 'BTC', amount: 0.5, value: 25724.5 },
    { date: '2024-03-14', type: 'Sell', asset: 'ETH', amount: 2.1, value: 8423.1 },
    { date: '2024-03-13', type: 'Receive', asset: 'DOT', amount: 50, value: 1234.5 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="secondary" />
          <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
            Loading portfolio...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ pt: 10, px: 2, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name || 'User'}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Your portfolio summary
          </Typography>
        </Box>

        <PortfolioSummary 
          selectedTimeFrame={selectedTimeFrame}
          onTimeFrameChange={setSelectedTimeFrame}
          totalValue={52430.5}
          twentyFourHourChange={3.2}
        />

        <Box sx={{ mt: 4 }}>
          <AssetDistribution assets={assets} />
        </Box>

        <Box sx={{ mt: 4 }}>
          <RecentActivity transactions={transactions} />
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;