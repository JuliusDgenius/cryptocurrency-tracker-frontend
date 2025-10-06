import { useEffect, useState } from 'react';
import {
  Box, Tabs, Tab, Button, Typography, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddExchangeDialog from './AddExchangeDialog';
import AddWalletDialog from './AddWalletDialog';
import dashboardService from '../../api/dashboard';

const AccountsPage = () => {
  const [tab, setTab] = useState(0);
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addExchangeOpen, setAddExchangeOpen] = useState(false);
  const [addWalletOpen, setAddWalletOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.getExchangeAccounts(),
      dashboardService.getWalletAddresses()
    ])
      .then(([ex, wa]) => {
        setExchanges(ex);
        setWallets(wa);
      })
      .catch(() => setError('Failed to load accounts'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddExchange = async (data: any) => {
    try {
      setActionError(null);
      setLoading(true);
      await dashboardService.addExchangeAccount(data);
      setExchanges(await dashboardService.getExchangeAccounts());
      setAddExchangeOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to add exchange');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExchange = async (id: string) => {
    try {
      setActionError(null);
      setLoading(true);
      await dashboardService.deleteExchangeAccount(id);
      setExchanges(await dashboardService.getExchangeAccounts());
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete exchange');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async (data: any) => {
    try {
      setActionError(null);
      setLoading(true);
      await dashboardService.addWalletAddress(data);
      setWallets(await dashboardService.getWalletAddresses());
      setAddWalletOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to add wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      setActionError(null);
      setLoading(true);
      await dashboardService.deleteWalletAddress(id);
      setWallets(await dashboardService.getWalletAddresses());
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        mt: { xs: 8, md: 10 }, // Offset for fixed Navbar
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          fontSize: { xs: '1.6rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        Connected Accounts
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Exchanges" />
        <Tab label="Wallets" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {tab === 0 && (
            <Box>
              <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => setAddExchangeOpen(true)}
              >
                Add Exchange
              </Button>
              <TableContainer
                component={Paper}
                sx={{
                  overflowX: 'auto', // ✅ Enables horizontal scroll on small screens
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Exchange</TableCell>
                      <TableCell>Label</TableCell>
                      <TableCell>Last Sync</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exchanges.map((ex) => (
                      <TableRow key={ex.id}>
                        <TableCell>{ex.exchange}</TableCell>
                        <TableCell>{ex.name || ex.label}</TableCell>
                        <TableCell>
                          {ex.lastSync
                            ? new Date(ex.lastSync).toLocaleString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDeleteExchange(ex.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => setAddWalletOpen(true)}
              >
                Add Wallet
              </Button>
              <TableContainer
                component={Paper}
                sx={{
                  overflowX: 'auto',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Blockchain</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Label</TableCell>
                      <TableCell>Last Sync</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wallets.map((wa) => (
                      <TableRow key={wa.id}>
                        <TableCell>{wa.blockchain}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: { xs: 120, sm: 200 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {wa.address}
                        </TableCell>
                        <TableCell>{wa.label}</TableCell>
                        <TableCell>
                          {wa.lastSync
                            ? new Date(wa.lastSync).toLocaleString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDeleteWallet(wa.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}

      {actionError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {actionError}
        </Alert>
      )}

      <AddExchangeDialog
        open={addExchangeOpen}
        onClose={() => setAddExchangeOpen(false)}
        onAdd={handleAddExchange}
      />
      <AddWalletDialog
        open={addWalletOpen}
        onClose={() => setAddWalletOpen(false)}
        onAdd={handleAddWallet}
      />
    </Box>
  );
};

export default AccountsPage;
