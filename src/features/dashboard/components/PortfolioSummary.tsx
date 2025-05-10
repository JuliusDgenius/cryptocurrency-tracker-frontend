import { 
  Box, 
  Typography, 
  Button, 
  ButtonGroup, 
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Add } from '@mui/icons-material';

interface PortfolioSummaryProps {
    selectedTimeFrame: string;
    totalValue: number;
    twentyFourHourChange: number;
    onTimeFrameChange: (timeframe: string) => void;
}

const PortfolioSummary = ({
    selectedTimeFrame,
    totalValue,
    twentyFourHourChange,
    onTimeFrameChange
}: PortfolioSummaryProps) => {
  const isPositive = twentyFourHourChange >= 0;

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 4,
      p: 4,
      mb: 4,
      boxShadow: 1
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>Portfolio Value</Typography>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          ${totalValue.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? 'success.main' : 'error.main' }}>
          {isPositive ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
          <Typography variant="body1" ml={0.5}>
            {twentyFourHourChange}%
          </Typography>
        </Box>
      </Box>

      <ButtonGroup sx={{ mb: 4 }}>
        {['1D', '1W', '1M', '1Y', 'ALL'].map((time) => (
          <Button
            key={time}
            variant={selectedTimeFrame === time ? 'contained' : 'outlined'}
            onClick={() => onTimeFrameChange(time)}
            sx={{ 
              textTransform: 'none',
              px: 3,
              '&.MuiButton-contained': {
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }
            }}
          >
            {time}
          </Button>
        ))}
      </ButtonGroup>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          sx={{ py: 2, borderRadius: 3 }}
        >
          Add Transaction
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ py: 2, borderRadius: 3 }}
        >
          Sync Wallet
        </Button>
      </Box>
    </Box>
  );
}

export default PortfolioSummary;