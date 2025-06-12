import { useEffect, useState } from 'react';
import { 
  Box, Typography, LinearProgress, useTheme, 
  CircularProgress, Card
} from '@mui/material';
import type { AssetDistributionData } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';

interface AssetDistributionProps {
  portfolioId?: string;
  demoMode?: boolean;
  assets?: AssetDistributionData[];
  detailedView?: boolean;
}

export default function AssetDistribution({ 
  portfolioId,
  demoMode = false,
  assets: initialAssets = [],
  detailedView = false
}: AssetDistributionProps) {
  const theme = useTheme();
  const [assets, setAssets] = useState<AssetDistributionData[]>(initialAssets || []);
  const [isLoading, setIsLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      if (demoMode || !portfolioId) return;
      
      try {
        setIsLoading(true);
        const data = await dashboardService.getAssetDistribution(portfolioId);
        console.log('Assets:', data);
        setAssets(data || []);
      } catch (err) {
        console.error('Failed to fetch assets:', err);
        setError('Failed to load asset distribution');
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [portfolioId, demoMode]);

  if (isLoading) {
    return (
      <Card sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Typography color="error">{error}</Typography>
      </Card>
    );
  }

  if (!assets || !assets.length) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
        <Typography color="text.secondary">
          No assets found in this portfolio
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
      <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
        {assets.map((asset) => (
          <Box key={asset.id} sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: asset.twentyFourHourChange >= 0 ? 
                    'success.main' : 'error.main'
                }} />
                <Box>
                  <Typography variant="body1" component="span" fontWeight="medium">
                    {asset.name}
                  </Typography>
                  <Typography variant="body2" component="span" color="text.secondary" ml={1}>
                    {asset.symbol}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {asset.allocation.toFixed(2)}%
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={asset.allocation}
              sx={{ 
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.grey[800],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: asset.twentyFourHourChange >= 0 ? 
                    'success.main' : 'error.main'
                }
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1
            }}>
              <Typography variant="body2" color="text.secondary">
                ${asset.value.toLocaleString()}
              </Typography>
              <Typography 
                variant="body2" 
                color={asset.twentyFourHourChange >= 0 ? 
                  'success.main' : 'error.main'}
              >
                {asset.twentyFourHourChange >= 0 ? '+' : ''}
                {asset.twentyFourHourChange.toFixed(2)}%
              </Typography>
            </Box>

            {detailedView && (
              <Box sx={{ mt: 2, pl: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {asset.quantity.toFixed(8)} {asset.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg. Buy Price: ${asset.averageBuyPrice.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Price: ${asset.currentPrice.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profit/Loss: ${asset.profitLoss.toLocaleString()} ({asset.profitLossPercentage.toFixed(2)}%)
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Card>
  );
}