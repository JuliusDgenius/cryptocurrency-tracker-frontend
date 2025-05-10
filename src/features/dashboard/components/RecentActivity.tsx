import { Box, Typography, useTheme } from '@mui/material';
import type { Transaction } from '../../../types/dashboard';

interface RecentActivityProps {
  transactions: Transaction[];
}

export default function RecentActivity({ transactions }: RecentActivityProps) {
  const theme = useTheme();

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'Buy': return theme.palette.success.main;
      case 'Sell': return theme.palette.error.main;
      case 'Receive': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 4,
      p: 4,
      boxShadow: 1
    }}>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
        {transactions.map((txn, index) => (
          <Box 
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': { borderBottom: 0 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: getTypeColor(txn.type)
              }} />
              <Box>
                <Typography variant="body1" fontWeight="medium">{txn.type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(txn.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body1" fontWeight="medium" textAlign="right">
                {txn.amount} {txn.asset}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${txn.value.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}