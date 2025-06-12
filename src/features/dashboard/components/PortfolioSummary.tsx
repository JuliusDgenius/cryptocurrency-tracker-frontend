import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Typography, Chip,
  Card, Button, CircularProgress
} from '@mui/material';
import { AssetDistributionData, Portfolio, PortfolioSummaryData } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';

interface PortfolioSummaryProps {
  portfolio?: Portfolio;
  portfolioId?: string;
  timeFrame?: string;
  demoMode?: boolean;
  assets?: AssetDistributionData[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolio, 
  portfolioId, 
  timeFrame = '1M',
  demoMode = false,
  assets: initialAssets = []
}) => {
  const [assets, setAssets] = useState<AssetDistributionData[]>(initialAssets);
  const [summaryData, setSummaryData] = useState<PortfolioSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (demoMode || !portfolioId) return;
      
      try {
        setIsLoading(true);
        const [assetsData, summaryData] = await Promise.all([
          dashboardService.getAssetDistribution(portfolioId),
          dashboardService.getPortfolioSummary(portfolioId, timeFrame)
        ]);
        setAssets(assetsData);
        setSummaryData(summaryData);
      } catch (err) {
        console.error('Failed to fetch portfolio data:', err);
        setError('Failed to load portfolio data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [portfolioId, timeFrame, demoMode]);

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

  if (!summaryData) {
    return null;
  }

  // Calculate top performing assets
  const topPerformers = assets && assets.length > 0 
    ? [...assets]
        .sort((a, b) => b.twentyFourHourChange - a.twentyFourHourChange)
        .slice(0, 3)
    : [];

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Portfolio Summary
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            bgcolor: 'background.default', 
            borderRadius: 2, 
            p: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              ${summaryData.totalValue?.toLocaleString() ?? '0'}
            </Typography>
            <Typography 
              variant="body2" 
              color={summaryData?.profitLoss?.twentyFourHour >= 0 ? 'success.main' : 'error.main'}
              sx={{ mt: 1 }}
            >
              {summaryData?.profitLoss?.twentyFourHour >= 0 ? '+' : ''}
              {summaryData?.profitLoss?.twentyFourHour?.toFixed(2) ?? '0.00'}% (24h)
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            bgcolor: 'background.default', 
            borderRadius: 2, 
            p: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" color="text.secondary">
              Top Performing Assets
            </Typography>
            <Box sx={{ mt: 1 }}>
              {topPerformers.length > 0 ? (
                topPerformers.map((asset, index) => (
                  <Box key={asset.id} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: index < topPerformers.length - 1 ? 
                      '1px solid rgba(0, 0, 0, 0.12)' : 'none'
                  }}>
                    <Typography variant="body1">
                      {asset.symbol}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: asset.twentyFourHourChange >= 0 ? 
                              'success.main' : 'error.main' 
                      }}
                    >
                      {asset.twentyFourHourChange >= 0 ? '+' : ''}
                      {asset.twentyFourHourChange.toFixed(2)}%
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No assets available
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            bgcolor: 'background.default', 
            borderRadius: 2, 
            p: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" color="text.secondary">
              Profit/Loss
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1
              }}>
                <Typography variant="body2">24h</Typography>
                <Typography 
                  variant="body2" 
                  color={summaryData.profitLoss?.day >= 0 ? 'success.main' : 'error.main'}
                >
                  {summaryData.profitLoss?.day >= 0 ? '+' : ''}
                  {summaryData.profitLoss?.day?.toFixed(2) ?? '0.00'}%
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1
              }}>
                <Typography variant="body2">7d</Typography>
                <Typography 
                  variant="body2" 
                  color={summaryData.profitLoss?.week >= 0 ? 'success.main' : 'error.main'}
                >
                  {summaryData.profitLoss?.week >= 0 ? '+' : ''}
                  {summaryData.profitLoss?.week?.toFixed(2) ?? '0.00'}%
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1
              }}>
                <Typography variant="body2">30d</Typography>
                <Typography 
                  variant="body2" 
                  color={summaryData.profitLoss?.month >= 0 ? 'success.main' : 'error.main'}
                >
                  {summaryData.profitLoss?.month >= 0 ? '+' : ''}
                  {summaryData.profitLoss?.month?.toFixed(2) ?? '0.00'}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PortfolioSummary;