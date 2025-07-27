import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Security,
  Person,
  Notifications,
  Lock,
  QrCode2,
  Smartphone
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { authApi } from '../../../api/auth';
import { handleApiError } from '../../../utils/errorHandler';
import { TwoFactorSetupForm } from '../../auth/components/TwoFactorSetupForm';

const SettingsPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  const handleEnable2FA = () => {
    setShowSetupDialog(true);
  };

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true);
      setError('');
      await authApi.disable2FA();
      setSuccess('Two-factor authentication has been disabled successfully.');
      setShowDisableDialog(false);
      // Refresh user data to update 2FA status
      await refreshUser();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASetupSuccess = async () => {
    setSuccess('Two-factor authentication has been set up successfully!');
    // Refresh user data to update 2FA status
    await refreshUser();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    // Clear messages when component mounts
    clearMessages();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={clearMessages}>
          {success}
        </Alert>
      )}

      {/* Security Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Security
            </Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Smartphone />
              </ListItemIcon>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary={
                  user?.twoFactorEnabled 
                    ? "Two-factor authentication is enabled for your account"
                    : "Add an extra layer of security to your account"
                }
              />
              <Box>
                {user?.twoFactorEnabled ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setShowDisableDialog(true)}
                    disabled={isLoading}
                  >
                    Disable 2FA
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<QrCode2 />}
                    onClick={handleEnable2FA}
                  >
                    Enable 2FA
                  </Button>
                )}
              </Box>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Profile
            </Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={user?.email}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Name"
                secondary={user?.name || 'Not set'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email Verification"
                secondary={user?.verified ? "Verified" : "Not verified"}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Notifications sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Notifications
            </Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive notifications via email"
              />
              <Switch
                edge="end"
                checked={user?.preferences?.notificationsEnabled || false}
                onChange={() => {
                  // TODO: Implement notification toggle
                }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Lock sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h2">
              Account Actions
            </Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Sign Out"
                secondary="Sign out of your account"
              />
              <Button
                variant="outlined"
                onClick={logout}
              >
                Sign Out
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* 2FA Setup Dialog */}
      <TwoFactorSetupForm
        open={showSetupDialog}
        onClose={() => setShowSetupDialog(false)}
        onSuccess={handle2FASetupSuccess}
      />

      {/* Disable 2FA Confirmation Dialog */}
      <Dialog open={showDisableDialog} onClose={() => setShowDisableDialog(false)}>
        <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disable two-factor authentication? This will make your account less secure.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDisableDialog(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDisable2FA}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Disable 2FA'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;