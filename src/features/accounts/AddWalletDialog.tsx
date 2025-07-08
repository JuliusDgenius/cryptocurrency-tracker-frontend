import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert, MenuItem } from '@mui/material';

interface AddWalletDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { blockchain: string; address: string; label?: string }) => void;
}

const BLOCKCHAINS = [
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'bsc', label: 'Binance Smart Chain' },
  // Add more as needed
];

const AddWalletDialog: React.FC<AddWalletDialogProps> = ({ open, onClose, onAdd }) => {
  const [blockchain, setBlockchain] = useState('bitcoin');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!blockchain || !address) {
      setError('Blockchain and address are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAdd({ blockchain, address, label });
      setAddress('');
      setLabel('');
    } catch (err: any) {
      setError(err.message || 'Failed to add wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAddress('');
    setLabel('');
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Wallet Address</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            select
            label="Blockchain"
            value={blockchain}
            onChange={e => setBlockchain(e.target.value)}
            fullWidth
          >
            {BLOCKCHAINS.map((b) => (
              <MenuItem key={b.value} value={b.value}>{b.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Label (optional)"
            value={label}
            onChange={e => setLabel(e.target.value)}
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWalletDialog; 