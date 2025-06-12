import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, LinearProgress, Tooltip,
  CircularProgress
} from '@mui/material';
import { PortfolioHealthMetrics } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';

interface PortfolioHealthProps {
  portfolioId: string;
}

const PortfolioHealth: React.FC<PortfolioHealthProps> = ({ portfolioId }) => {
  const [metrics, setMetrics] = useState<PortfolioHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getPortfolioHealth(portfolioId);
        setMetrics(data);
      } catch (err) {
        console.error('Failed to fetch portfolio health metrics:', err);
        setError('Failed to load portfolio health metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthMetrics();
  }, [portfolioId]);

  if (isLoading) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 4, 
        p: 3,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        p: 3,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 4, 
      p: 3,
      height: '100%'
    }}>
      <Typography variant="h6" gutterBottom>
        Portfolio Health
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Diversification
              </Typography>
              <Typography variant="body2">
                {metrics.diversificationScore.toFixed(1)}/10
              </Typography>
            </Box>
            <Tooltip title={`Score: ${metrics.diversificationScore.toFixed(1)} - ${metrics.diversificationScore > 7 ? 'Excellent' : metrics.diversificationScore > 5 ? 'Good' : 'Needs Improvement'}`}>
              <LinearProgress 
                variant="determinate" 
                value={metrics.diversificationScore * 10} 
                color={metrics.diversificationScore > 7 ? 'success' : metrics.diversificationScore > 5 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
            </Tooltip>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Volatility (30d)
              </Typography>
              <Typography variant="body2">
                {metrics.volatility.toFixed(2)}%
              </Typography>
            </Box>
            <Tooltip title={`30-day volatility: ${metrics.volatility.toFixed(2)}%`}>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(metrics.volatility, 50)} 
                color={metrics.volatility < 15 ? 'success' : metrics.volatility < 30 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
            </Tooltip>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ 
            bgcolor: 'background.default', 
            borderRadius: 3, 
            p: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Risk-Adjusted Returns
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Sharpe Ratio:</Typography>
                <Typography variant="h6">
                  {metrics.riskAdjustedReturns.sharpeRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Sortino Ratio:</Typography>
                <Typography variant="h6">
                  {metrics.riskAdjustedReturns.sortinoRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Max Drawdown:</Typography>
                <Typography variant="h6" color="error.main">
                  -{metrics.maxDrawdown.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Value at Risk:</Typography>
                <Typography variant="h6" color="error.main">
                  -{metrics.valueAtRisk.toFixed(2)}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioHealth;