import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  // Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import watchlistService from '@/api/watchlist';
import type { Watchlist } from '@/types/watchlist';

interface WatchlistCardProps {
  watchlist: Watchlist;
  onDeleted: (id: string) => void;
  onUpdated: (watchlist: Watchlist) => void;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({
  watchlist,
  onDeleted,
  // onUpdated
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await watchlistService.deleteWatchlist(watchlist.id);
      onDeleted(watchlist.id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete watchlist');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleView = () => {
    navigate(`/watchlists/${watchlist.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const assetCount = watchlist.items?.length || 0;

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {watchlist.name}
            </Typography>
            <Chip 
              label={`${assetCount} assets`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          
          {watchlist.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {watchlist.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(watchlist.createdAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updated: {formatDate(watchlist.updatedAt)}
            </Typography>
          </Box>
          
          {assetCount > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Top Assets:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {watchlist.items.slice(0, 3).map((asset) => (
                  <Chip
                    key={asset.symbol}
                    label={asset.symbol}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {assetCount > 3 && (
                  <Chip
                    label={`+${assetCount - 3} more`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Box>
            <IconButton 
              onClick={handleView}
              color="primary"
              size="small"
              title="View Watchlist"
            >
              <ViewIcon />
            </IconButton>
            <IconButton 
              onClick={() => navigate(`/watchlists/${watchlist.id}`)}
              color="primary"
              size="small"
              title="Add Asset"
            >
              <AddIcon />
            </IconButton>
          </Box>
          
          <IconButton 
            onClick={() => setShowDeleteDialog(true)}
            color="error"
            size="small"
            title="Delete Watchlist"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Watchlist</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{watchlist.name}"? This action cannot be undone.
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
            onClick={() => setShowDeleteDialog(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { WatchlistCard }; 