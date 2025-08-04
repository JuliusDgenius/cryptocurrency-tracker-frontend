import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h5" component="div">
            Something went wrong
          </Typography>
        </Alert>
        
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error.message}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 3 }}>
          We've encountered an unexpected error. You can try reloading the page or 
          return to the homepage.
        </Typography>
        
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => window.location.href = '/'}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info: any) => {
        // Log errors to your error reporting service here
        console.error('Error caught by boundary:', error, info);
      }}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}