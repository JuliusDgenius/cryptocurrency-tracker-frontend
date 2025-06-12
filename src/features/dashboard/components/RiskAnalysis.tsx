import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Chip, Paper, Divider,
  CircularProgress
} from '@mui/material';
import { RiskAnalysisData } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';

interface RiskAnalysisProps {
  portfolioId: string;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ portfolioId }) => {
  const [riskData, setRiskData] = useState<RiskAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getRiskAnalysis(portfolioId);
        setRiskData(data);
      } catch (err) {
        console.error('Failed to fetch risk analysis:', err);
        setError('Failed to load risk analysis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskData();
  }, [portfolioId]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'info';
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!riskData) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Risk Analysis
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            Overall Risk Level:
          </Typography>
          <Chip 
            label={riskData.riskLevel} 
            color={getRiskColor(riskData.riskLevel)}
            size="small"
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Volatility
              </Typography>
              <Typography variant="h6">
                {riskData.volatility.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Liquidity Risk
              </Typography>
              <Typography variant="h6">
                {riskData.liquidityRisk.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Concentration
              </Typography>
              <Typography variant="h6">
                {riskData.concentrationRisk.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Market Risk
              </Typography>
              <Typography variant="h6">
                {riskData.marketRisk.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Stress Test Scenarios
      </Typography>
      <Grid container spacing={2}>
        {riskData.stressTestResults.map((test, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {test.scenario}
              </Typography>
              <Typography 
                variant="h6" 
                color={test.portfolioImpact < 0 ? 'error.main' : 'success.main'}
              >
                {test.portfolioImpact.toFixed(1)}% Impact
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default RiskAnalysis;