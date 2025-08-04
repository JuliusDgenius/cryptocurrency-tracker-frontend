import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert } from '@mui/material';

interface AddExchangeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { exchange: string; apiKey: string; apiSecret: string; label: string }) => void;
}

const AddExchangeDialog: React.FC<AddExchangeDialogProps> = ({ open, onClose, onAdd }) => {
  const [exchange, setExchange] = useState('binance');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!exchange || !apiKey || !apiSecret) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAdd({ exchange, apiKey, apiSecret, label });
      setApiKey('');
      setApiSecret('');
      setLabel('');
      setExchange('binance');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add exchange');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApiKey('');
    setApiSecret('');
    setLabel('');
    setExchange('binance');
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Exchange Account</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Exchange"
            value={exchange}
            disabled
            fullWidth
          />
          <TextField
            label="API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="API Secret"
            value={apiSecret}
            onChange={e => setApiSecret(e.target.value)}
            fullWidth
            type="password"
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

export default AddExchangeDialog; 