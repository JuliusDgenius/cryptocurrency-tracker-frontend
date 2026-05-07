import { Box, Container, Grid } from '@mui/material';
import { stats } from '../constants/homeData';
import { StatItem } from '@/components/Stats';

const StatsSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        py: { xs: 6, md: 10 },
        mb: { xs: 4, md: 6 },
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} justifyContent="center" alignItems="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <StatItem stat={stat} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;