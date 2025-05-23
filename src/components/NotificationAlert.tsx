import { Alert, Snackbar } from '@mui/material';
import { useError } from '../providers/ErrorProvider';

export const ErrorNotification = () => {
  const { error } = useError();

  return (
    <Snackbar
      open={!!error}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        severity="error" 
        variant="filled" 
        sx={{ width: '100%' }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};