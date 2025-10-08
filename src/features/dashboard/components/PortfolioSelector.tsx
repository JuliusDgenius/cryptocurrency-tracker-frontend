import { useState } from 'react';
import { 
  FormControl, InputLabel, MenuItem, Select, 
  Button, Box, CircularProgress, Typography,
  IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { Portfolio } from '@/types/dashboard';

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  currentPortfolioId: string;
  onChange: (portfolioId: string) => void;
  onSetPrimary: (portfolioId: string) => void;
}

const PortfolioSelector: React.FC<PortfolioSelectorProps> = ({ 
  portfolios, 
  currentPortfolioId, 
  onChange,
  onSetPrimary
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePortfolio = async () => {
    try {
      setIsLoading(true);
      setError(null);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      setError('Failed to create portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Select Portfolio</InputLabel>
        <Select
          value={currentPortfolioId}
          onChange={(e) => onChange(e.target.value)}
          label="Select Portfolio"
          disabled={isLoading}
        >
          {portfolios.map((portfolio) => (
            <MenuItem key={portfolio.id} value={portfolio.id}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <Typography>{portfolio.name}</Typography>
                <Tooltip title={portfolio.isPrimary ? "Primary Portfolio" : "Set as Primary"}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetPrimary(portfolio.id);
                    }}
                  >
                    {portfolio.isPrimary ? (
                      <StarIcon color="primary" fontSize="small" />
                    ) : (
                      <StarBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button 
        variant="outlined" 
        startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
        onClick={handleCreatePortfolio}
        disabled={isLoading}
        sx={{
          width: { xs: '100%', sm: 'auto' },
          whiteSpace: 'nowrap',
          fontSize: { xs: '0.875rem', sm: '1rem' },
          py: { xs: 1, sm: 1.5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        New Portfolio
      </Button>

      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PortfolioSelector;