import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Container, Box, Typography, Button, 
  CircularProgress, Alert,
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

  const handleUpdatePortfolio = async (updatedPortfolio: Portfolio) => {
    setPortfolios(portfolios.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
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
    <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 10 }, px: { xs: 1, sm: 2, md: 4 }, pb: { xs: 3, md: 6 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Manage your cryptocurrency portfolios
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1rem' } }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {portfolios.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          bgcolor: 'background.paper', 
          borderRadius: 4,
          p: { xs: 4, sm: 6 },
          boxShadow: 2,
          mt: { xs: 3, md: 4 },
          mx: 'auto',
          maxWidth: 500
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            No portfolios yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
            Create your first portfolio to start tracking your cryptocurrency investments
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setOpenCreateDialog(true)}
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, px: 4, py: 1.5, fontSize: { xs: '1rem', md: '1.1rem' } }}
          >
            Create Portfolio
          </Button>
          <Button 
            variant="outlined"
            component={Link}
            to="/learn"
            sx={{ px: 4, py: 1.5, fontSize: { xs: '1rem', md: '1.1rem' } }}
          >
            Learn How It Works
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>Your Portfolios</Typography>
            <Button 
              variant="outlined"
              onClick={() => setOpenCreateDialog(true)}
              startIcon={<AddIcon />}
              sx={{ px: 3, py: 1, fontSize: { xs: '0.95rem', md: '1.05rem' } }}
            >
              New Portfolio
            </Button>
          </Box>
          <PortfolioGrid 
            portfolios={portfolios} 
            onCreateNew={() => setOpenCreateDialog(true)}
            onDelete={handleDeletePortfolio}
            onSetPrimary={handleSetPrimary}
            onUpdate={handleUpdatePortfolio}
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