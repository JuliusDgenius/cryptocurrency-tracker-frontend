import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, Typography, Box, Button, 
  Chip, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Snackbar, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Portfolio } from '@/types/dashboard';
import dashboardService from '../../../api/dashboard';
import { useAuth } from '../../../hooks/useAuth';

interface PortfolioGridProps {
  portfolios: Portfolio[];
  onCreateNew: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onUpdate: (portfolio: Portfolio) => void;
}

const PortfolioGrid = ({ 
  portfolios, onCreateNew, onDelete, onSetPrimary, onUpdate 
}: PortfolioGridProps) => {
  const { user } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editPortfolioId, setEditPortfolioId] = useState<string | null>(null);
  const [editPortfolioName, setEditPortfolioName] = useState('');
  const [editPortfolioDesc, setEditPortfolioDesc] = useState('');
  const navigate = useNavigate();

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) {
      setError('Portfolio name is required');
      return;
    }

    try {
      const newPortfolio = await dashboardService.createPortfolio(
        portfolioName, 
        portfolioDesc
      );
      onCreateNew(newPortfolio);
      setSuccess('Portfolio created successfully');
      setPortfolioName('');
      setPortfolioDesc('');
      setOpenCreate(false);
    } catch (err) {
      setError('Failed to create portfolio');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await dashboardService.deletePortfolio(deleteId);
        onDelete(deleteId);
        setSuccess('Portfolio deleted successfully');
      } catch (err) {
        setError('Failed to delete portfolio');
      }
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  const handleEditPortfolio = async () => {
    if (!editPortfolioName.trim()) {
      setError('Portfolio name is required');
      return;
    }

    if (!editPortfolioId) {
      setError('Portfolio ID is missing');
      return;
    }

    try {
      const updatedPortfolio = await dashboardService.updatePortfolio(editPortfolioId, editPortfolioName, editPortfolioDesc);
      onUpdate(updatedPortfolio);
      setSuccess('Portfolio updated successfully');
      setOpenEdit(false);
      setEditPortfolioId(null);
      setEditPortfolioName('');
      setEditPortfolioDesc('');
    } catch (err) {
      setError('Failed to update portfolio');
    }
  };

  return (
    <>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {portfolios.map((portfolio) => (
          <Grid key={portfolio.id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              onClick={() => navigate(`/portfolio/${portfolio.id}`)}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: portfolio.isPrimary ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.12)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px) scale(1.02)',
                },
                bgcolor: 'background.paper',
                m: { xs: 0, sm: 1 },
              }}
            >
              {portfolio.isPrimary && (
                <Chip 
                  label="Primary" 
                  color="primary" 
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    fontWeight: 'bold'
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography variant="h6" component="div">
                    {portfolio.name}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetPrimary(portfolio.id);
                    }}
                    size="small"
                  >
                    {portfolio.isPrimary ? (
                      <StarIcon color="primary" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {portfolio.description || 'No description'}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                  borderRadius: 1,
                  p: 1.5,
                  mb: 2
                }}>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Portfolio Value
                    </Typography>
                    <Typography variant="h6">
                      ${portfolio.totalValue.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" align="right">
                      24h Change
                    </Typography>
                    <Typography 
                      variant="h6" 
                      align="right"
                      sx={{ 
                        color: portfolio.twentyFourHourChange !== undefined && portfolio.twentyFourHourChange >= 0 ? 
                              '#4caf50' : '#f44336' 
                      }}
                    >
                      {portfolio?.profitLoss?.twentyFourHour !== undefined && portfolio?.profitLoss?.twentyFourHour >= 0 ? '+' : ''}
                      {portfolio?.profitLoss?.twentyFourHour !== undefined ? portfolio?.profitLoss?.twentyFourHour.toFixed(2) : 'N/A'}%
                    </Typography>
                  </div>
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: { xs: 1, md: 2 }, gap: 1 }}>
                <Button 
                  size="small" 
                  variant="outlined"
                  startIcon={<EditIcon fontSize="small" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditPortfolioId(portfolio.id);
                    setEditPortfolioName(portfolio.name);
                    setEditPortfolioDesc(portfolio.description || '');
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="error"
                  startIcon={<DeleteIcon fontSize="small" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(portfolio.id);
                    setOpenDelete(true);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Create Portfolio Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Portfolio Name"
            fullWidth
            variant="outlined"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={portfolioDesc}
            onChange={(e) => setPortfolioDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePortfolio}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth maxWidth="xs">
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this portfolio? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Portfolio Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Portfolio Name"
            fullWidth
            variant="outlined"
            value={editPortfolioName}
            onChange={(e) => setEditPortfolioName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editPortfolioDesc}
            onChange={(e) => setEditPortfolioDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditPortfolio}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </>
  );
};

export default PortfolioGrid;