import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography 
} from '@mui/material';

interface CreatePortfolioDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

const CreatePortfolioDialog: React.FC<CreatePortfolioDialogProps> = ({ 
  open, onClose, onCreate 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Portfolio name is required');
      return;
    }
    onCreate(name, description);
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Create a new portfolio to organize your crypto assets and track performance.
          </Typography>
        </Box>
        
        <TextField
          autoFocus
          margin="dense"
          label="Portfolio Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Description (Optional)"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Portfolio Types
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>General Portfolio:</strong> Track any combination of crypto assets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Yield Portfolio:</strong> Focus on staking and yield-generating assets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>NFT Portfolio:</strong> Track your NFT collection values
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleCreate}
          disabled={!name.trim()}
        >
          Create Portfolio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePortfolioDialog;