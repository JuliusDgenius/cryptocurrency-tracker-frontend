import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Box, CircularProgress, Typography,
  Tabs, Tab, Snackbar, Alert, Button, IconButton
} from '@mui/material';
import { 
  PortfolioHeader, PortfolioSelector, PerformanceChart, 
  PortfolioSummary, AssetDistribution, RecentActivity,
  PortfolioHealth, RiskAnalysis, CorrelationMatrix,
  CsvManagement
} from '../components';
import dashboardService from '../../../api/dashboard';
import { Portfolio } from '@/types/dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddAssetDialog from '../components/AddAssetDialog';
import AddIcon from '@mui/icons-material/Add';
import { usePriceStream } from '../../../hooks/usePriceStream';

const PortfolioDashboard = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeFrame, setTimeFrame] = useState('1M');
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  const prices = usePriceStream();

  const refetchPortfolio = async () => {
    if (portfolioId) {
      const portfolioData = await dashboardService.getPortfolioDetails(portfolioId);
      setPortfolio(portfolioData);
    }
  };

  const refetchAssetDistribution = async () => {
    if (portfolioId) {
      const portfolioData = await dashboardService.getPortfolioDetails(portfolioId);
      setPortfolio(portfolioData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all portfolios
        const allPortfolios = await dashboardService.getPortfolios();
        setPortfolios(allPortfolios);
        
        // If no portfolio ID provided, redirect to first portfolio
        if (!portfolioId && allPortfolios.length > 0) {
          navigate(`/portfolio/${allPortfolios[0].id}`);
          return;
        }
        
        // Fetch portfolio details
        if (portfolioId) {
          const portfolioData = await dashboardService.getPortfolioDetails(portfolioId);
          setPortfolio(portfolioData);
          
          await dashboardService.getPortfolioHealth(portfolioId);
        }
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [portfolioId, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setSelectedTab(newValue);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handlePortfolioChange = (newId: string) => {
    navigate(`/portfolio/${newId}`);
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await dashboardService.setPrimaryPortfolio(id);
      setPortfolios(portfolios.map(p => ({
        ...p,
        isPrimary: p.id === id
      })));
      
      if (portfolio) {
        setPortfolio({
          ...portfolio,
          isPrimary: portfolio.id === id
        });
      }
    } catch (err) {
      setError('Failed to set primary portfolio');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!portfolio) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" gutterBottom>
            Portfolio not found
          </Typography>
          <Typography sx={{ mb: 3 }}>
            The portfolio you're looking for doesn't exist or you don't have permission to view it.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 1, sm: 2 }, pb: { xs: 3, sm: 6 } }}>
      {/* Portfolio Header and Navigation */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: { xs: 2, sm: 3 },
        gap: 1,
        mt: { xs: 6, sm: 8 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: { xs: 1, sm: 0 },
          flex: { sm: 1 },
          gap: 2,
          bgcolor: 'background.paper',
          p: { xs: 1, sm: 2 },
          borderRadius: 2,
          boxShadow: 1
        }}>
          <IconButton 
            onClick={() => navigate('/dashboard')} 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <PortfolioSelector 
              portfolios={portfolios} 
              currentPortfolioId={portfolioId || ''} 
              onChange={handlePortfolioChange} 
              onSetPrimary={handleSetPrimary}
            />
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          position: { sm: 'relative' },
          zIndex: 1
        }}>
          <CsvManagement
            portfolioId={portfolioId || ''}
            onImportSuccess={() => {
              refetchPortfolio();
              refetchAssetDistribution();
            }}
          />
          <Button 
            startIcon={<ShareIcon />} 
            variant="contained"
            fullWidth={false}
            sx={{ 
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
              minWidth: { xs: '120px', sm: 'auto' },
              whiteSpace: 'nowrap',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Share
          </Button>
          <Button 
            startIcon={<CompareArrowsIcon />}
            variant="contained"
            fullWidth={false}
            sx={{ 
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
              minWidth: { xs: '120px', sm: 'auto' },
              whiteSpace: 'nowrap',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Compare
          </Button>
        </Box>
      </Box>
      
      <PortfolioHeader 
        portfolioName={portfolio.name}
        totalValue={portfolio.totalValue}
        twentyFourHourChange={portfolio?.profitLoss?.twentyFourHour}
        profitLoss={portfolio.profitLoss}
      />
      
      {/* Timeframe Selector */}
      <Tabs 
        value={timeFrame} 
        onChange={(_, newValue) => setTimeFrame(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
          },
          '& .MuiTab-root': {
            minWidth: { xs: '60px', sm: '80px' },
            px: { xs: 1, sm: 2 }
          }
        }}
      >
        <Tab label="1D" value="1D" />
        <Tab label="1W" value="1W" />
        <Tab label="1M" value="1M" />
        <Tab label="3M" value="3M" />
        <Tab label="YTD" value="YTD" />
        <Tab label="1Y" value="1Y" />
        <Tab label="All" value="All" />
      </Tabs>
      
      {/* Main Dashboard Tabs */}
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 4,
          '& .MuiTab-root': {
            minWidth: { xs: '100px', sm: '120px' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 }
          }
        }}
      >
        <Tab label="Overview" />
        <Tab label="Assets" />
        <Tab label="Performance" />
        <Tab label="Risk Analysis" />
        <Tab label="Reports" />
      </Tabs>
      
      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
          {/* Performance Chart - Full Width */}
          <Grid item xs={12} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '400px' },
              minHeight: { xs: '300px', sm: '400px' }
            }}>
              <PerformanceChart 
                timeFrame={timeFrame}
                portfolioId={portfolioId || ''}
                onTimeFrameChange={setTimeFrame}
              />
            </Box>
          </Grid>
          
          {/* Summary and Health - Equal Width */}
          <Grid item xs={12} md={6} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              mb: { xs:2, sm: 0 }
            }}>
              <PortfolioSummary 
                portfolioId={portfolioId || ''}
                timeFrame={timeFrame}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <PortfolioHealth portfolioId={portfolioId || ''} />
            </Box>
          </Grid>
          
          {/* Asset Distribution and Recent Activity - 2/3 and 1/3 Split */}
          <Grid item xs={12} md={8} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '500px' },
              minHeight: { xs: '400px', sm: '500px' },
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Asset Distribution</Typography>
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <AssetDistribution portfolioId={portfolioId || ''} />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '500px' },
              minHeight: { xs: '300px', sm: '500px' },
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <RecentActivity portfolioId={portfolioId || ''} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      
      {selectedTab === 1 && (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          p: { xs: 2, sm: 3 },
          boxShadow: 1,
          height: { xs: 'auto', sm: '600px' },
          minHeight: { xs: '400px', sm: '600px' }
        }}>
          <Typography variant="h5" sx={{ mb: 3 }}>Asset Breakdown</Typography>
          <Box sx={{ height: '100%', overflow: 'hidden' }}>
            <AssetDistribution 
              portfolioId={portfolioId || ''} 
              detailedView
            />
          </Box>
        </Box>
      )}
      
      {selectedTab === 2 && (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '500px' },
              minHeight: { xs: '400px', sm: '500px' }
            }}>
              <PerformanceChart 
                timeFrame={timeFrame}
                portfolioId={portfolioId || ''}
                onTimeFrameChange={setTimeFrame}
                detailedView
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '400px' },
              minHeight: { xs: '300px', sm: '400px' }
            }}>
              <Typography variant="h6" gutterBottom>Historical Returns</Typography>
              {/* Historical returns chart would go here */}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '400px' },
              minHeight: { xs: '300px', sm: '400px' }
            }}>
              <Typography variant="h6" gutterBottom>Benchmark Comparison</Typography>
              {/* Benchmark comparison chart would go here */}
            </Box>
          </Grid>
        </Grid>
      )}
      
      {selectedTab === 3 && (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '500px' },
              minHeight: { xs: '400px', sm: '500px' }
            }}>
              <RiskAnalysis portfolioId={portfolioId || ''} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '500px' },
              minHeight: { xs: '400px', sm: '500px' }
            }}>
              <CorrelationMatrix portfolioId={portfolioId || ''} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: { xs: 2, sm: 3 },
              boxShadow: 1,
              height: { xs: 'auto', sm: '400px' },
              minHeight: { xs: '300px', sm: '400px' }
            }}>
              <Typography variant="h6" gutterBottom>Portfolio Stress Test</Typography>
              {/* Stress test visualization would go here */}
            </Box>
          </Grid>
        </Grid>
      )}
      
      {selectedTab === 4 && (
        <Box sx={{ px: { xs: 0, sm: 2 } }}>
          <Typography variant="h5" sx={{ mb: 3 }}>Reports & Analysis</Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Typography variant="h6">Profit & Loss</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Realized and unrealized gains
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Typography variant="h6">Tax Report</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Capital gains for tax filing
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Typography variant="h6">Performance Analysis</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Detailed performance breakdown
                </Typography>
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            mt: 4, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            p: { xs: 2, sm: 3 },
            boxShadow: 1
          }}>
            <Typography variant="h6" gutterBottom>Custom Report Generator</Typography>
            {/* Report generator UI would go here */}
          </Box>
        </Box>
      )}
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3, mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Portfolio Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddAssetOpen(true)}
        >
          Add Asset
        </Button>
      </Box>

      <AddAssetDialog
        open={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        portfolioId={portfolioId || ''}
        onAssetAdded={() => {
          // Refresh portfolio data
          refetchPortfolio();
          // Refresh asset distribution
          refetchAssetDistribution();
        }}
      />

      {/* Live Prices Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Live Prices</Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {prices.length === 0 ? (
            <Typography variant="body2">No live prices available.</Typography>
          ) : (
            prices.map((p) => (
              <li key={p.symbol}>
                <strong>{p.symbol}:</strong> {p.price} (at {new Date(p.timestamp).toLocaleTimeString()})
              </li>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PortfolioDashboard;