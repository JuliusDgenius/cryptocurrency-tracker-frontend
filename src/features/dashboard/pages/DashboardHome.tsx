import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Container, Box, Typography, Button, Grid, 
  CircularProgress, Alert, Card, CardContent
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material'
import PortfolioGrid from '../components/PortfolioGrid';
import CreatePortfolioDialog from '../components/CreatePortfolioDialog';
import dashboardService from '../../../api/dashboard';
import { Portfolio } from '@/types/dashboard';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getPortfolios();
        setPortfolios(data);
      } catch (err) {
        setError('Failed to load portfolios. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleCreatePortfolio = async (name: string, description: string = '') => {
    try {
      const newPortfolio = await dashboardService.createPortfolio(name, description);
      setPortfolios([...portfolios, newPortfolio]);
      setOpenCreateDialog(false);
    } catch (err) {
      setError('Failed to create portfolio. Please try again.');
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await dashboardService.deletePortfolio(id);
      setPortfolios(portfolios.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete portfolio. Please try again.');
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await dashboardService.setPrimaryPortfolio(id);
      setPortfolios(portfolios.map(p => ({
        ...p,
        isPrimary: p.id === id
      })));
    } catch (err) {
      setError('Failed to set primary portfolio. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '50vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 10, px: 2, pb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Manage your cryptocurrency portfolios
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {portfolios.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          bgcolor: 'background.paper', 
          borderRadius: 4,
          p: 6,
          boxShadow: 1,
          mt: 4
        }}>
          <Typography variant="h5" gutterBottom>
            No portfolios yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create your first portfolio to start tracking your cryptocurrency investments
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setOpenCreateDialog(true)}
            sx={{ mr: 2 }}
          >
            Create Portfolio
          </Button>
          <Button 
            variant="outlined"
            component={Link}
            to="/learn"
          >
            Learn How It Works
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Your Portfolios</Typography>
            <Button 
              variant="outlined"
              onClick={() => setOpenCreateDialog(true)}
              startIcon={<AddIcon />}
            >
              New Portfolio
            </Button>
          </Box>
          <PortfolioGrid 
            portfolios={portfolios} 
            onCreateNew={() => setOpenCreateDialog(true)}
            onDelete={handleDeletePortfolio}
            onSetPrimary={handleSetPrimary}
          />
        </>
      )}

      <CreatePortfolioDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={handleCreatePortfolio}
      />
    </Container>
  );
};

export default DashboardHome;