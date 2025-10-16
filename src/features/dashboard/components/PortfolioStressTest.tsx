import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, LinearProgress,
  Card, CardContent, Grid, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dashboardService from '../../../api/dashboard';

interface StressTestResult {
  scenario: string;
  portfolioImpact: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface PortfolioStressTestProps {
  portfolioId: string;
  className?: string;
}

const PortfolioStressTest: React.FC<PortfolioStressTestProps> = ({
  portfolioId,
  className
}) => {
  const theme = useTheme();
  const [stressTestData, setStressTestData] = useState<StressTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStressTestData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getStressTestResults(portfolioId);
        setStressTestData(data as StressTestResult[]);
      } catch (err) {
        console.error('Failed to fetch stress test data:', err);
        setError('Failed to load stress test data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStressTestData();
  }, [portfolioId]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getSeverityValue = (severity: string) => {
    switch (severity) {
      case 'low': return 25;
      case 'medium': return 50;
      case 'high': return 75;
      case 'critical': return 100;
      default: return 0;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'success.main';
    if (impact < -10) return 'error.main';
    if (impact < -5) return 'warning.main';
    return 'text.secondary';
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const worstCaseScenario = stressTestData.reduce((worst, current) => 
    current.portfolioImpact < worst.portfolioImpact ? current : worst, 
    stressTestData[0] || { portfolioImpact: 0, scenario: '', severity: 'low' }
  );

  const bestCaseScenario = stressTestData.reduce((best, current) => 
    current.portfolioImpact > best.portfolioImpact ? current : best, 
    stressTestData[0] || { portfolioImpact: 0, scenario: '', severity: 'low' }
  );

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Portfolio Stress Test
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Worst Case
              </Typography>
              <Typography variant="h6">
                {worstCaseScenario.portfolioImpact.toFixed(2)}%
              </Typography>
              <Typography variant="caption">
                {worstCaseScenario.scenario}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Best Case
              </Typography>
              <Typography variant="h6">
                {bestCaseScenario.portfolioImpact.toFixed(2)}%
              </Typography>
              <Typography variant="caption">
                {bestCaseScenario.scenario}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stress Test Scenarios */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Scenario Analysis
        </Typography>
        {stressTestData.map((scenario, index) => (
          <Card key={index} sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="subtitle2" sx={{ flex: 1 }}>
                  {scenario.scenario}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={scenario.severity.toUpperCase()}
                    color={getSeverityColor(scenario.severity)}
                    size="small"
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: getImpactColor(scenario.portfolioImpact),
                      minWidth: '60px',
                      textAlign: 'right'
                    }}
                  >
                    {scenario.portfolioImpact >= 0 ? '+' : ''}{scenario.portfolioImpact.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {scenario.description}
              </Typography>
              
              <LinearProgress
                variant="determinate"
                value={getSeverityValue(scenario.severity)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette[getSeverityColor(scenario.severity)].main,
                    borderRadius: 3
                  }
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Risk Assessment */}
      <Box sx={{ 
        bgcolor: 'background.default',
        p: 2,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="subtitle2" gutterBottom>
          Risk Assessment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your portfolio shows {stressTestData.filter(s => s.severity === 'high' || s.severity === 'critical').length} high-risk scenarios 
          out of {stressTestData.length} tested scenarios. Consider diversifying your holdings or reducing exposure 
          to high-volatility assets to improve your portfolio's resilience.
        </Typography>
      </Box>
    </Box>
  );
};

export default PortfolioStressTest;
