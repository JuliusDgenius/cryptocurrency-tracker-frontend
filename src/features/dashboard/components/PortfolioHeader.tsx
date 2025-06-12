import { Box, Typography, Chip } from '@mui/material';

interface PortfolioHeaderProps {
  portfolioName: string;
  totalValue: number;
  twentyFourHourChange?: number;
  profitLoss: {
    day: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
    twentyFourHour: number;
  }
}

const PortfolioHeader = ({ portfolioName, totalValue, twentyFourHourChange = 0 }: PortfolioHeaderProps) => {
  const isPositive = twentyFourHourChange >= 0;
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {portfolioName}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" component="div" sx={{ mr: 2 }}>
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
        <Chip 
          label={`${isPositive ? '+' : ''}${twentyFourHourChange.toFixed(2)}%`}
          color={isPositive ? 'success' : 'error'}
          variant="outlined"
        />
      </Box>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
        Portfolio Value
      </Typography>
    </Box>
  );
};

export default PortfolioHeader;
