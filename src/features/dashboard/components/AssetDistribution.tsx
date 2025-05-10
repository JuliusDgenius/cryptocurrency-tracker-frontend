import { Box, Typography, LinearProgress, useTheme } from '@mui/material';
import type { Asset } from '../../../types/dashboard';

interface AssetDistributionProps {
  assets: Asset[];
}

export default function AssetDistribution({ assets }: AssetDistributionProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 4,
      p: 4,
      boxShadow: 1
    }}>
      <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
      <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
        {assets.map((asset) => (
          <Box key={asset.symbol} sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'primary.main'
                }} />
                <Box>
                  <Typography variant="body1" component="span" fontWeight="medium">
                    {asset.name}
                  </Typography>
                  <Typography variant="body2" component="span" color="text.secondary" ml={1}>
                    {asset.symbol}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {asset.percentage}%
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={asset.percentage}
              sx={{ 
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.grey[800],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 'primary.main'
                }
              }}
            />
            
            <Typography variant="body2" color="text.secondary" textAlign="right" mt={1}>
              ${asset.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}