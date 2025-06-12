import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Select, MenuItem, FormControl, InputLabel,
  CircularProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import type { PerformanceDataPoint } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';

interface PerformanceChartProps {
  portfolioId: string;
  timeFrame: string;
  onTimeFrameChange: (value: string) => void;
  detailedView?: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  portfolioId, timeFrame, onTimeFrameChange, detailedView = false 
}) => {
  const theme = useTheme();
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState('BTC');

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.getPerformanceData(portfolioId, timeFrame);
        setPerformanceData(data);
      } catch (err) {
        console.error('Failed to fetch performance data:', err);
        setError('Failed to load performance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [portfolioId, timeFrame]);

  if (isLoading) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 4, 
        p: 3,
        height: detailedView ? '500px' : '300px',
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
        height: detailedView ? '500px' : '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 4, 
      p: 3,
      height: detailedView ? '500px' : '300px'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h6">
          Portfolio Performance
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Benchmark</InputLabel>
          <Select
            value={selectedBenchmark}
            label="Benchmark"
            onChange={(e) => setSelectedBenchmark(e.target.value)}
          >
            <MenuItem value="BTC">Bitcoin (BTC)</MenuItem>
            <MenuItem value="ETH">Ethereum (ETH)</MenuItem>
            <MenuItem value="SP500">S&P 500</MenuItem>
            <MenuItem value="NONE">None</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: theme.palette.text.secondary }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Your Portfolio"
            stroke={theme.palette.primary.main} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          {selectedBenchmark !== 'NONE' && (
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              name={`${selectedBenchmark} Benchmark`}
              stroke={theme.palette.secondary.main} 
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PerformanceChart;