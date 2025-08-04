import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import watchlistService from '../../../api/watchlist';
import type { CreateWatchlistDto } from '../../../types/watchlist';

interface CreateWatchlistDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (watchlist: any) => void;
}

const CreateWatchlistDialog: React.FC<CreateWatchlistDialogProps> = ({
  open,
  onClose,
  onCreated
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Watchlist name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data: CreateWatchlistDto = {
        name: name.trim(),
        description: description.trim() || undefined
      };

      const newWatchlist = await watchlistService.createWatchlist(data);
      onCreated(newWatchlist);
      
      // Reset form
      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName('');
      setDescription('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Watchlist</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Watchlist Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={isLoading}
              autoFocus
            />
            
            <TextField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              disabled={isLoading}
              placeholder="Describe the purpose of this watchlist..."
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Creating...' : 'Create Watchlist'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export { CreateWatchlistDialog }; 