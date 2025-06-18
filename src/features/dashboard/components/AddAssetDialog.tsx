import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, Autocomplete,
  CircularProgress, Alert
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dashboardService from '../../../api/dashboard';

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  portfolioId: string;
  onAssetAdded: () => void;
}

interface CryptoOption {
  symbol: string;
  name: string;
  currentPrice: number;
}

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({ 
  open, onClose, portfolioId, onAssetAdded 
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [averageBuyPrice, setAverageBuyPrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available cryptocurrencies
  const { data: cryptoOptions, isLoading: isLoadingCrypto } = useQuery({
    queryKey: ['availableCryptos'],
    queryFn: () => dashboardService.getAvailableCryptos(),
    enabled: open
  });

  const handleSubmit = async () => {
    if (!selectedCrypto) {
      setError('Please select a cryptocurrency');
      return;
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!averageBuyPrice || isNaN(Number(averageBuyPrice)) || Number(averageBuyPrice) <= 0) {
      setError('Please enter a valid average buy price');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await dashboardService.addAssetToPortfolio(portfolioId, {
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.name,
        quantity: Number(quantity),
        averageBuyPrice: Number(averageBuyPrice),
        currentPrice: selectedCrypto.currentPrice,
        value: Number(quantity) * selectedCrypto.currentPrice,
        allocation: 0, // Will be calculated by the backend
        category: undefined,
        marketCap: undefined,
        twentyFourHourChange: 0,
        profitLossPercentage: 0
      });

      onAssetAdded();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCrypto(null);
    setQuantity('');
    setAverageBuyPrice('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Asset</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Add a new cryptocurrency asset to your portfolio. You can specify the quantity and average buy price.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Autocomplete
          options={cryptoOptions || []}
          loading={isLoadingCrypto}
          getOptionLabel={(option) => `${option.name} (${option.symbol})`}
          value={selectedCrypto}
          onChange={(_, newValue) => setSelectedCrypto(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Cryptocurrency"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingCrypto ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            inputProps: { min: 0, step: "any" }
          }}
        />

        <TextField
          label="Average Buy Price (USD)"
          type="number"
          fullWidth
          variant="outlined"
          value={averageBuyPrice}
          onChange={(e) => setAverageBuyPrice(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            inputProps: { min: 0, step: "any" }
          }}
        />

        {selectedCrypto && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 1 
          }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Market Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Price: ${selectedCrypto.currentPrice.toLocaleString()}
            </Typography>
            {quantity && averageBuyPrice && (
              <Typography variant="body2" color="text.secondary">
                Estimated Value: ${(Number(quantity) * selectedCrypto.currentPrice).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedCrypto || !quantity || !averageBuyPrice}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Add Asset'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssetDialog; 