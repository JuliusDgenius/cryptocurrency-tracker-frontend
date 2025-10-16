import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Chip
} from '@mui/material';
import { 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import dashboardService from '../../../api/dashboard';

interface HistoricalReturnsData {
  period: string;
  returns: number;
  benchmark: number;
  category: string;
}

interface HistoricalReturnsChartProps {
  portfolioId: string;
  timeFrame: string;
  className?: string;
}

const HistoricalReturnsChart: React.FC<HistoricalReturnsChartProps> = ({
  portfolioId,
  timeFrame,
  className
}) => {
  const theme = useTheme();
  const [returnsData, setReturnsData] = useState<HistoricalReturnsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getHistoricalReturns(portfolioId, timeFrame);
        setReturnsData(data);
      } catch (err) {
        console.error('Failed to fetch historical returns data:', err);
        setError('Failed to load historical returns data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturnsData();
  }, [portfolioId, timeFrame]);

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

  const getChipColor = (returns: number) => {
    if (returns > 0) return 'success';
    if (returns < -5) return 'error';
    return 'warning';
  };

  const averageReturn = returnsData.length > 0 
    ? returnsData.reduce((sum, item) => sum + item.returns, 0) / returnsData.length
    : 0;

  const bestPeriod = returnsData.reduce((best, current) => 
    current.returns > best.returns ? current : best, 
    returnsData[0] || { period: '', returns: 0 }
  );

  const worstPeriod = returnsData.reduce((worst, current) => 
    current.returns < worst.returns ? current : worst, 
    returnsData[0] || { period: '', returns: 0 }
  );

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Historical Returns
      </Typography>

      {/* Key Metrics */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 2,
        flexWrap: 'wrap'
      }}>
        <Chip 
          label={`Avg: ${averageReturn.toFixed(2)}%`}
          color={averageReturn >= 0 ? 'success' : 'error'}
          variant="outlined"
          size="small"
        />
        <Chip 
          label={`Best: ${bestPeriod.period} (${bestPeriod.returns.toFixed(2)}%)`}
          color="success"
          variant="outlined"
          size="small"
        />
        <Chip 
          label={`Worst: ${worstPeriod.period} (${worstPeriod.returns.toFixed(2)}%)`}
          color="error"
          variant="outlined"
          size="small"
        />
      </Box>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={returnsData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" stroke={theme.palette.divider} 
          />
          <XAxis 
            dataKey="period" 
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${Number(value).toFixed(2)}%`, 
              name === 'returns' ? 'Portfolio Returns' : 'Benchmark Returns'
            ]}
            labelFormatter={(label) => `Period: ${label}`}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius
            }}
          />
          <Legend />
          <Bar 
            dataKey="returns" 
            name="Portfolio Returns"
            fill={theme.palette.primary.main}
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="benchmark" 
            name="Benchmark Returns"
            fill={theme.palette.secondary.main}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Return Distribution */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Return Distribution
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {returnsData.map((item, index) => (
            <Chip
              key={index}
              label={`${item.period}: ${item.returns.toFixed(1)}%`}
              color={getChipColor(item.returns)}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HistoricalReturnsChart;
