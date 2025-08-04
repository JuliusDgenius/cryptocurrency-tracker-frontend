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
  const [showDeleteDialog, setShowDeleteDialog] = useState<{ symbol: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (symbol: string) => {
    try {
      setIsDeleting(symbol);
      setError(null);
      await watchlistService.removeAssetFromWatchlist(watchlistId, symbol);
      onAssetRemoved();
    } catch (err: any) {
      setError(err.message || 'Failed to remove asset');
    } finally {
      setIsDeleting(null);
      setShowDeleteDialog(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
                    key={asset.symbol}
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
                        onClick={() => setShowDeleteDialog({ symbol: asset.symbol, name: asset.name })}
                        size="small"
                        color="error"
                        disabled={isDeleting === asset.symbol}
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
            onClick={() => showDeleteDialog && handleDelete(showDeleteDialog.symbol)} 
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