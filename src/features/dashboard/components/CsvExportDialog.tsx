import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Download,
  Description,
  TableChart,
  Close
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import csvService, { CsvExportOptions } from '../../../api/csv';

interface CsvExportDialogProps {
  open: boolean;
  onClose: () => void;
  portfolioId: string;
}

const CsvExportDialog: React.FC<CsvExportDialogProps> = ({
  open,
  onClose,
  portfolioId
}) => {
  const [exportType, setExportType] = useState<'portfolio' | 'transactions'>('portfolio');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      let blob: Blob;
      const startDateStr = startDate?.toISOString();
      const endDateStr = endDate?.toISOString();

      if (exportType === 'portfolio') {
        const options: CsvExportOptions = {
          startDate: startDateStr,
          endDate: endDateStr,
          includeAssets,
          includeTransactions
        };
        blob = await csvService.exportPortfolio(portfolioId, options);
      } else {
        blob = await csvService.exportTransactions(portfolioId, startDateStr, endDateStr);
      }

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}-${portfolioId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    setExportType('portfolio');
    setStartDate(null);
    setEndDate(null);
    setIncludeAssets(true);
    setIncludeTransactions(true);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Export Data to CSV</Typography>
          <Button onClick={handleClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose what data you want to export and customize the export options.
        </Typography>

        {/* Export Type Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Export Type
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: exportType === 'portfolio' ? 2 : 1,
                  borderColor: exportType === 'portfolio' ? 'primary.main' : 'divider'
                }}
                onClick={() => setExportType('portfolio')}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Description color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">Portfolio Data</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete portfolio with assets and transactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: exportType === 'transactions' ? 2 : 1,
                  borderColor: exportType === 'transactions' ? 'primary.main' : 'divider'
                }}
                onClick={() => setExportType('transactions')}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <TableChart color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">Transactions Only</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transaction history with detailed records
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Date Range */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Date Range (Optional)
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>

        {/* Portfolio Export Options */}
        {exportType === 'portfolio' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Include in Export
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeAssets}
                      onChange={(e) => setIncludeAssets(e.target.checked)}
                    />
                  }
                  label="Current Assets"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeTransactions}
                      onChange={(e) => setIncludeTransactions(e.target.checked)}
                    />
                  }
                  label="Transaction History"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {isExporting && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Preparing export...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={isExporting}
          startIcon={<Download />}
        >
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { CsvExportDialog }; 