import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import watchlistService from '@/api/watchlist';
import type { AddAssetDto, AvailableCrypto } from '@/types/watchlist';

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  watchlistId: string;
  onAssetAdded: () => void;
}

// Common cryptocurrency symbols for autocomplete
// const commonCryptos = [
//   'BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'AVAX', 'MATIC',
//   'LINK', 'UNI', 'ATOM', 'LTC', 'BCH', 'XRP', 'DOGE', 'SHIB',
//   'TRX', 'ETC', 'XLM', 'VET', 'FIL', 'ALGO', 'ICP', 'XMR'
// ];

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({
  open,
  onClose,
  watchlistId,
  onAssetAdded
}) => {
  const [symbol, setSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cryptoOptions, setCryptoOptions] = useState<AvailableCrypto[]>([]);
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [fetchOptionsError, setFetchOptionsError] = useState<string | null>(null);

  // Function to fetch available cryptos dynamically from backend
  const fetchCryptos = useCallback(async () => {
    setIsFetchingOptions(true);
    setFetchOptionsError(null);
    try {
      const data = await watchlistService.getAvailableCryptos();
      setCryptoOptions(data);
    } catch (err: any) {
      setFetchOptionsError('Failed to load crypto options. Please try again.');
      console.error('Error fetching available cryptos:', err);
    } finally {
      setIsFetchingOptions(false);
    }
  }, []);

  // Fetch cryptos when the dialog opens or if options are empty
  useEffect(() => {
    if (open && cryptoOptions.length === 0 && !isFetchingOptions) {
      fetchCryptos();
    }
  }, [open, cryptoOptions.length, isFetchingOptions, fetchCryptos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      setError('Asset symbol is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data: AddAssetDto = {
        symbol: symbol.trim().toUpperCase()
      };

      await watchlistService.addAssetToWatchlist(watchlistId, data);
      onAssetAdded();
      
      // Reset form
      setSymbol('');
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add asset to watchlist';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSymbol('');
      setError(null);
      setFetchOptionsError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Asset to Watchlist</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {fetchOptionsError && (
              <Alert severity="error" onClose={() => setFetchOptionsError(null)}>
                {fetchOptionsError}
              </Alert>
            )}
            
            <Autocomplete
              freeSolo
              options={cryptoOptions.map(option => option.symbol)}
              loading={isFetchingOptions}
              value={symbol}
              onChange={(_, newValue) => setSymbol(newValue || '')}
              onInputChange={(_, newInputValue) => setSymbol(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Asset Symbol"
                  placeholder="e.g., BTC, ETH, SOL"
                  fullWidth
                  required
                  disabled={isLoading || isFetchingOptions}
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isFetchingOptions ? <CircularProgress color='inherit' size={20}/> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            
            <Box sx={{ mt: 1 }}>
              <Alert severity="info">
                Enter the cryptocurrency symbol (e.g., BTC for Bitcoin, ETH for Ethereum)
              </Alert>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading || !symbol.trim()}
            startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
          >
            {isLoading ? 'Adding...' : 'Add Asset'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export { AddAssetDialog }; 