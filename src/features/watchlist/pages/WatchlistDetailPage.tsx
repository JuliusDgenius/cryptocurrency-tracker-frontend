import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  // Card,
  // CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { AssetList, WatchlistMetrics, AddAssetDialog } from '../components';
import watchlistService from '@/api/watchlist';
import type { Watchlist } from '@/types/watchlist';

const WatchlistDetailPage = () => {
  const { watchlistId } = useParams();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (watchlistId) {
      fetchWatchlist();
    }
  }, [watchlistId]);

  const fetchWatchlist = async () => {
    if (!watchlistId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await watchlistService.getWatchlistById(watchlistId);
      
      // Transform the data to match the expected frontend structure
      const transformedData = {
        ...data,
        items: data.items?.map((item: any) => ({
          id: item.asset?.id || item.id,
          symbol: item.asset?.symbol || '',
          name: item.asset?.name || '',
          currentPrice: item.asset?.currentPrice || 0,
          addedAt: item.createdAt || item.addedAt || new Date().toISOString()
        })) || []
      };
      
      setWatchlist(transformedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetAdded = async () => {
    await fetchWatchlist();
    setSuccessMessage('Asset added successfully!');
  };

  const handleAssetRemoved = async () => {
    await fetchWatchlist();
    setSuccessMessage('Asset removed successfully!');
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/watchlists')}
        >
          Back to Watchlists
        </Button>
      </Container>
    );
  }

  if (!watchlist) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Watchlist not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/watchlists')}
          sx={{ mt: 2 }}
        >
          Back to Watchlists
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton
            onClick={() => navigate('/watchlists')}
            size="small"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {watchlist.name}
          </Typography>
        </Box>
        
        {watchlist.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {watchlist.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddAssetOpen(true)}
          >
            Add Asset
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/watchlists/${watchlistId}/edit`)}
          >
            Edit Watchlist
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Grid container spacing={3}>
        {/* Metrics */}
        <Grid item xs={12} md={4}>
          <WatchlistMetrics watchlistId={watchlistId!} />
        </Grid>

        {/* Asset List */}
        <Grid item xs={12} md={8}>
          <AssetList
            watchlistId={watchlistId!}
            assets={watchlist.items}
            onAssetRemoved={handleAssetRemoved}
          />
        </Grid>
      </Grid>

      {/* Add Asset Dialog */}
      <AddAssetDialog
        open={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        watchlistId={watchlistId!}
        onAssetAdded={handleAssetAdded}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WatchlistDetailPage; 