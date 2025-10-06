import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { WatchlistCard, CreateWatchlistDialog } from '../components';
import watchlistService from '../../../api/watchlist';
import type { Watchlist } from '../../../types/watchlist';

const WatchlistPage = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await watchlistService.getWatchlists();
      setWatchlists(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWatchlist = async (watchlist: Watchlist) => {
    setWatchlists([watchlist, ...watchlists]);
    setSuccessMessage('Watchlist created successfully!');
  };

  const handleDeleteWatchlist = async (id: string) => {
    setWatchlists(watchlists.filter(w => w.id !== id));
    setSuccessMessage('Watchlist deleted successfully!');
  };

  const handleUpdateWatchlist = async (updatedWatchlist: Watchlist) => {
    setWatchlists(watchlists.map(w =>
      w.id === updatedWatchlist.id ? updatedWatchlist : w
    ));
    setSuccessMessage('Watchlist updated successfully!');
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, md: 6 },
          mt: { xs: 8, md: 10 } // ✅ Offset for fixed Navbar
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 6 },
        mt: { xs: 8, md: 10 } // ✅ Offset for fixed Navbar
      }}
    >
      <Box
        sx={{
          mb: 4,
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.6rem', sm: '2rem' }
          }}
        >
          My Watchlists
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Create and manage watchlists to track your favorite cryptocurrencies
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            mb: 3,
            fontSize: { xs: '0.85rem', sm: '1rem' },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.2 }
          }}
        >
          Create Watchlist
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {watchlists.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Watchlists Yet
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Create your first watchlist to start tracking cryptocurrencies
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Your First Watchlist
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {watchlists.map((watchlist) => (
            <Grid item xs={12} sm={6} md={4} key={watchlist.id}>
              <WatchlistCard
                watchlist={watchlist}
                onDeleted={handleDeleteWatchlist}
                onUpdated={handleUpdateWatchlist}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateWatchlistDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreated={handleCreateWatchlist}
      />

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

export default WatchlistPage;
