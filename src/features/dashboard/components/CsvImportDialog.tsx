import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Download,
  Close
} from '@mui/icons-material';
import csvService, { CsvImportResponse } from '../../../api/csv';

interface CsvImportDialogProps {
  open: boolean;
  onClose: () => void;
  portfolioId: string;
  onImportSuccess: () => void;
}

const CsvImportDialog: React.FC<CsvImportDialogProps> = ({
  open,
  onClose,
  portfolioId,
  onImportSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<CsvImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a valid CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setImportResult(null);

    try {
      const result = await csvService.importTransactions(portfolioId, file);
      setImportResult(result);
      
      if (result.success > 0) {
        onImportSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await csvService.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transaction-template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError('Failed to download template');
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Import Transactions from CSV</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!importResult && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload a CSV file with your transaction data. The file should include columns for date, type, cryptocurrency, amount, and price per unit.
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                sx={{ mb: 2 }}
              >
                Download Template
              </Button>
            </Box>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: 'action.hover',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.selected'
                }
              }}
              onClick={() => document.getElementById('csv-file-input')?.click()}
            >
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              {file ? (
                <Box>
                  <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" color="success.main">
                    File Selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Click to select CSV file
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or drag and drop here
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}

        {importResult && (
          <Box>
            <Alert 
              severity={importResult.success > 0 ? 'success' : 'warning'}
              sx={{ mb: 2 }}
            >
              {importResult.message}
            </Alert>

            {importResult.errors.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Import Errors ({importResult.errors.length}):
                </Typography>
                <List dense>
                  {importResult.errors.map((error, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Error color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={error}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        {isUploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Uploading and processing CSV file...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {importResult ? 'Close' : 'Cancel'}
        </Button>
        {!importResult && file && (
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={isUploading}
            startIcon={<CloudUpload />}
          >
            {isUploading ? 'Uploading...' : 'Import Transactions'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export { CsvImportDialog }; 