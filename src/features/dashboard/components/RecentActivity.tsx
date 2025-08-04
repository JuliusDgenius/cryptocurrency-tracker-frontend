import { useEffect, useState } from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import type { RecentActivityData } from '@/types/dashboard';
import dashboardService from '@/api/dashboard';

interface RecentActivityProps {
  portfolioId?: string;
  demoMode?: boolean;
  transactions?: RecentActivityData[];
}

export default function RecentActivity({ 
  portfolioId, 
  demoMode = false,
  transactions: initialTransactions = []
}: RecentActivityProps) {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<RecentActivityData[]>(initialTransactions);
  const [isLoading, setIsLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (demoMode || !portfolioId) return;
      
      try {
        setIsLoading(true);
        const data = await dashboardService.getRecentActivity(portfolioId);
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load recent activity');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [portfolioId, demoMode]);

  const getTypeColor = (type: RecentActivityData['type']) => {
    switch (type) {
      case 'BUY': return theme.palette.success.main;
      case 'SELL': return theme.palette.error.main;
      case 'TRANSFER': return theme.palette.info.main;
      case 'STAKING': return theme.palette.warning.main;
      case 'DIVIDEND': return theme.palette.success.light;
      default: return theme.palette.warning.main;
    }
  };

  const formatType = (type: RecentActivityData['type']) => {
    switch (type) {
      case 'BUY': return 'Buy';
      case 'SELL': return 'Sell';
      case 'TRANSFER': return 'Transfer';
      case 'STAKING': return 'Staking';
      case 'DIVIDEND': return 'Dividend';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 4,
        p: 4,
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 4,
        p: 4,
        boxShadow: 1
      }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 4,
      p: 4,
      boxShadow: 1
    }}>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
        {transactions.map((txn) => (
          <Box 
            key={txn.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': { borderBottom: 0 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: getTypeColor(txn.type)
              }} />
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatType(txn.type)} {txn.asset}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(txn.timestamp).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body1" fontWeight="medium" textAlign="right">
                {txn.amount} {txn.symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${txn.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}