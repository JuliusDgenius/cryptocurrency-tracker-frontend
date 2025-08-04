import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import watchlistService from '../../../api/watchlist';
import type { WatchlistMetrics } from '../../../types/watchlist';

interface WatchlistMetricsProps {
  watchlistId: string;
}

const WatchlistMetricsComponent: React.FC<WatchlistMetricsProps> = ({ watchlistId }) => {
  const [metrics, setMetrics] = useState<WatchlistMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await watchlistService.getWatchlistMetrics(watchlistId);
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [watchlistId]);

  if (isLoading) {
    return (
      <Card sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Alert severity="error">{error}</Alert>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Typography color="text.secondary">No metrics available</Typography>
      </Card>
    );
  }

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

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Watchlist Metrics
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {metrics.totalAssets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assets
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {metrics.alerts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Alerts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {metrics.topPerformers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top Performers
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {metrics.topPerformers.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" />
              Top Performers
            </Typography>
            <List dense>
              {metrics.topPerformers.map((asset, index) => (
                <ListItem key={asset.symbol} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={asset.symbol}
                    secondary={`${asset.name} • ${formatPrice(asset.currentPrice)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {metrics.recentlyAdded.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon color="primary" />
              Recently Added
            </Typography>
            <List dense>
              {metrics.recentlyAdded.map((asset) => (
                <ListItem key={asset.symbol} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Chip 
                      label={asset.symbol} 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={asset.name}
                    secondary={`Added ${formatDate(asset.addedAt)} • ${formatPrice(asset.currentPrice)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {metrics.alerts > 0 && (
          <Box sx={{ mt: 2 }}>
            <Alert 
              severity="info" 
              icon={<NotificationsIcon />}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {metrics.alerts} active alert{metrics.alerts !== 1 ? 's' : ''} configured
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export { WatchlistMetricsComponent as WatchlistMetrics }; 