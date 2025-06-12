import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material';
import { CorrelationMatrixData } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';

interface CorrelationMatrixProps {
  portfolioId: string;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ portfolioId }) => {
  const [data, setData] = useState<CorrelationMatrixData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const correlationData = await dashboardService.getCorrelationMatrix(portfolioId);
        setData(correlationData);
      } catch (err) {
        console.error('Failed to fetch correlation matrix:', err);
        setError('Failed to load correlation matrix');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCorrelationData();
  }, [portfolioId]);

  const getColor = (value: number) => {
    const hue = value > 0 ? 120 : 0;
    const saturation = Math.abs(value) * 100;
    const lightness = 90 - (Math.abs(value) * 40);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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

  if (!data) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Asset Correlation Matrix
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        30-day rolling correlation between assets
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {data.assets.map((asset) => (
                <TableCell key={asset} align="center" sx={{ fontWeight: 'bold' }}>
                  {asset}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.correlations.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  {data.assets[rowIndex]}
                </TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    align="center"
                    sx={{ 
                      backgroundColor: getColor(cell),
                      color: Math.abs(cell) > 0.6 ? '#fff' : 'inherit'
                    }}
                  >
                    {cell.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 2,
        fontSize: '0.75rem'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: getColor(1),
            mr: 1
          }} />
          <span>High Correlation (1.0)</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: getColor(0),
            mr: 1
          }} />
          <span>No Correlation (0.0)</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: getColor(-1),
            mr: 1
          }} />
          <span>Negative Correlation (-1.0)</span>
        </Box>
      </Box>
    </Paper>
  );
};

export default CorrelationMatrix;