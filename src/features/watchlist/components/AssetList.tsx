import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  // TrendingUp as TrendingUpIcon,
  // TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import watchlistService from '../../../api/watchlist';
import type { WatchlistAsset } from '../../../types/watchlist';

interface AssetListProps {
  watchlistId: string;
  assets: WatchlistAsset[];
  onAssetRemoved: () => void;
}

const AssetList: React.FC<AssetListProps> = ({
  watchlistId,
  assets,
  onAssetRemoved
}) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{ assetId: string; symbol: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (assetId: string) => {
    try {
      setIsDeleting(assetId);
      setError(null);
      await watchlistService.removeAssetFromWatchlist(watchlistId, assetId);
      onAssetRemoved();
    } catch (err: any) {
      setError(err.message || 'Failed to remove asset');
    } finally {
      setIsDeleting(null);
      setShowDeleteDialog(null);
    }
  };

  const formatPrice = (price: number) => {
    try {
      if (typeof price !== 'number' || isNaN(price)) {
        return '$0.00';
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', price, error);
      return '$0.00';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  console.log("Assets in AssetList component:", assets);
  console.log("Asset structure check:", assets.map(asset => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    currentPrice: asset.currentPrice,
    addedAt: asset.addedAt
  })));

  if (assets.length === 0) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Assets Added
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add some cryptocurrencies to start tracking their prices
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Assets ({assets.length})
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="center">Added</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow 
                    key={asset.id}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      opacity: isDeleting === asset.symbol ? 0.6 : 1
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={asset.symbol} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {asset.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {formatPrice(asset.currentPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(asset.addedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => setShowDeleteDialog({ assetId: asset.id || '', symbol: asset.symbol, name: asset.name })}
                        size="small"
                        color="error"
                        disabled={isDeleting === asset.id}
                        title="Remove from watchlist"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isDeleting && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onClose={() => setShowDeleteDialog(null)}>
        <DialogTitle>Remove Asset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {showDeleteDialog?.symbol} ({showDeleteDialog?.name}) from this watchlist?
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {isDeleting && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteDialog(null)} 
            disabled={!!isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => showDeleteDialog && handleDelete(showDeleteDialog.assetId)} 
            color="error" 
            variant="contained"
            disabled={!!isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { AssetList }; 