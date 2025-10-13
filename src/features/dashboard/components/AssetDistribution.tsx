import { useEffect, useState } from 'react';
import { 
  Box, Typography, LinearProgress, useTheme, 
  CircularProgress, Card, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { AssetDistributionData } from '@/types/dashboard';
import dashboardService from '@/api/dashboard';
import { FC } from 'react';

interface AssetDistributionProps {
  portfolioId?: string;
  demoMode?: boolean;
  assets?: AssetDistributionData[];
  detailedView?: boolean;
  onAssetDeleted?: () => void;
}

interface AssetItemProps {
  asset: AssetDistributionData;
  detailedView: boolean;
  onDelete: (asset: AssetDistributionData) => void;
}

const AssetItem: FC<AssetItemProps> = (
  { asset, detailedView, onDelete }
) => {
  const theme = useTheme();

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 1 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: asset.twentyFourHourChange >= 0 ? 
              'success.main' : 'error.main'
          }} />
          <Box>
            <Typography 
              variant="body1" 
              component="span" 
              fontWeight="medium"
            >
              {asset.name}
            </Typography>
            <Typography 
              variant="body2" 
              component="span" 
              color="text.secondary" ml={1}
            >
              {asset.symbol}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {asset.allocation.toFixed(2)}%
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => onDelete(asset)}
            sx={{ 
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={asset.allocation}
        sx={{ 
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.palette.grey[800],
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: asset.twentyFourHourChange >= 0 ? 
              'success.main' : 'error.main'
          }
        }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 1
      }}>
        <Typography variant="body2" color="text.secondary">
          ${asset.value.toLocaleString()}
        </Typography>
        <Typography 
          variant="body2" 
          color={asset.twentyFourHourChange >= 0 ? 
            'success.main' : 'error.main'}
        >
          {asset.twentyFourHourChange >= 0 ? '+' : ''}
          {asset.twentyFourHourChange.toFixed(2)}%
        </Typography>
      </Box>

      {detailedView && (
        <Box sx={{ mt: 2, pl: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Quantity: {asset.quantity.toFixed(8)} {asset.symbol}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avg. Buy Price: ${asset.averageBuyPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current Price: ${asset.currentPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profit/Loss: ${asset.profitLoss.toLocaleString()} (
              {asset.profitLossPercentage.toFixed(2)}%)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const AssetDistribution: FC<AssetDistributionProps> = ({ 
  portfolioId,
  demoMode = false,
  assets: initialAssets = [],
  detailedView = false,
  onAssetDeleted
}) => {
  const [assets, setAssets] = useState<AssetDistributionData[]>(
    initialAssets || []);
  const [isLoading, setIsLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = 
    useState<AssetDistributionData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      if (demoMode || !portfolioId) return;
      
      try {
        setIsLoading(true);
        const data = await dashboardService.getAssetDistribution(portfolioId);
        setAssets(data || []);
      } catch (err) {
        console.error('Failed to fetch assets:', err);
        setError('Failed to load asset distribution');
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [portfolioId, demoMode]);

  const handleDeleteClick = (asset: AssetDistributionData) => {
    setAssetToDelete(asset);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete || !portfolioId) return;

    try {
      setIsDeleting(true);
      await dashboardService.deleteAsset(portfolioId, assetToDelete.id);
      setAssets(assets.filter(a => a.id !== assetToDelete.id));
      onAssetDeleted?.();
    } catch (err) {
      console.error('Failed to delete asset:', err);
      setError('Failed to delete asset');
    } finally {
      setIsDeleting(false);
      setAssetToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setAssetToDelete(null);
  };

  if (isLoading) {
    return (
      <Card sx={{ 
        p: 3, height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' }}
      >
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Typography color="error">{error}</Typography>
      </Card>
    );
  }

  if (!assets || !assets.length) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
        <Typography color="text.secondary">
          No assets found in this portfolio
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
        <Box sx={{ 
          flex: 1, 
          height: 'calc(100% - 40px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        }}>
          {assets.map((asset, index) => (
            <Box 
              key={asset.id || index}
              sx={{ 
                borderBottom: index < assets.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider'
              }}
            >
              <AssetItem 
                asset={asset} 
                detailedView={detailedView} 
                onDelete={handleDeleteClick}
              />
            </Box>
          ))}
        </Box>
      </Card>

      <Dialog
        open={!!assetToDelete}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Asset
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {assetToDelete?.name} (
              {assetToDelete?.symbol})?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssetDistribution;