import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert
} from '@mui/material';
import { LineChart, Line,
   XAxis, YAxis, CartesianGrid, 
   Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import dashboardService from '../../../api/dashboard';

interface BenchmarkDataPoint {
  date: string;
  portfolio: number;
  benchmark: number;
}

interface BenchmarkComparisonChartProps {
  portfolioId: string;
  timeFrame: string;
  className?: string;
}

const BenchmarkComparisonChart: React.FC<BenchmarkComparisonChartProps> = ({
  portfolioId,
  timeFrame,
  className
}) => {
  const theme = useTheme();
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState('BTC');

  const availableBenchmarks = [
    { value: 'BTC', label: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'ADA', label: 'Cardano' },
    { value: 'DOGE', label: 'Dogecoin' },
    { value: 'SP500', label: 'S&P 500' },
    { value: 'GOLD', label: 'Gold' }
  ];

  useEffect(() => {
    const fetchBenchmarkData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getBenchmarkComparison(
          portfolioId, 
          timeFrame, 
          selectedBenchmark
        );
        setBenchmarkData(data);
      } catch (err) {
        console.error('Failed to fetch benchmark data:', err);
        setError('Failed to load benchmark comparison data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenchmarkData();
  }, [portfolioId, timeFrame, selectedBenchmark]);

  const handleBenchmarkChange = (event: any) => {
    setSelectedBenchmark(event.target.value);
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

  const portfolioPerformance = benchmarkData.length > 0 
    ? ((benchmarkData[benchmarkData.length - 1].portfolio - benchmarkData[0].portfolio) / 
      benchmarkData[0].portfolio) * 100
    : 0;

  const benchmarkPerformance = benchmarkData.length > 0
    ? ((benchmarkData[benchmarkData.length - 1].benchmark - benchmarkData[0].benchmark) /
      benchmarkData[0].benchmark) * 100
    : 0;

  const performanceDifference = portfolioPerformance - benchmarkPerformance;

  return (
    <Box className={className}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
          Benchmark Comparison
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Benchmark</InputLabel>
          <Select
            value={selectedBenchmark}
            onChange={handleBenchmarkChange}
            label="Benchmark"
          >
            {availableBenchmarks.map((benchmark) => (
              <MenuItem key={benchmark.value} value={benchmark.value}>
                {benchmark.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Performance Summary */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 2,
        flexWrap: 'wrap'
      }}>
        <Box sx={{ 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          p: 1.5,
          borderRadius: 1,
          flex: 1,
          minWidth: '120px'
        }}>
          <Typography variant="caption" display="block">
            Portfolio
          </Typography>
          <Typography variant="h6">
            {portfolioPerformance.toFixed(2)}%
          </Typography>
        </Box>
        <Box sx={{ 
          bgcolor: theme.palette.secondary.main,
          color: 'white',
          p: 1.5,
          borderRadius: 1,
          flex: 1,
          minWidth: '120px'
        }}>
          <Typography variant="caption" display="block">
            {availableBenchmarks.find(b => b.value === selectedBenchmark)?.label}
          </Typography>
          <Typography variant="h6">
            {benchmarkPerformance.toFixed(2)}%
          </Typography>
        </Box>
        <Box sx={{ 
          bgcolor: performanceDifference >= 0 ? 'success.main' : 'error.main',
          color: 'white',
          p: 1.5,
          borderRadius: 1,
          flex: 1,
          minWidth: '120px'
        }}>
          <Typography variant="caption" display="block">
            Difference
          </Typography>
          <Typography variant="h6">
            {performanceDifference >= 0 ? '+' : ''}{performanceDifference.toFixed(2)}%
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={benchmarkData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${Number(value).toFixed(2)}%`, 
              name === 'portfolio' ? 'Your Portfolio' : `${selectedBenchmark} Benchmark`
            ]}
            labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="portfolio" 
            name="Your Portfolio"
            stroke={theme.palette.primary.main} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            name={`${selectedBenchmark} Benchmark`}
            stroke={theme.palette.secondary.main} 
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BenchmarkComparisonChart;
