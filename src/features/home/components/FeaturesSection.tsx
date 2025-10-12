import { 
  Box, Grid, Card,
   CardContent, Typography, Container 
  } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { features } from '../constants/homeData';

const FeaturesSection = () => {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const themeValues = {
    paperBg: theme.palette.background.paper,
    hoverBg: theme.palette.action.hover,
    shadow1: theme.shadows[1],
    shadow4: theme.shadows[4],
  };

  return (
    <Box 
      sx={{ py: { xs: 8, md: 10 }, 
      backgroundColor: theme.palette.background.default
      }}
    >
    <Container maxWidth="lg" id='features'>
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 2,
          fontSize: {
          xs: '1.5rem',
          sm: '2rem',
          md: '2.5rem'
        } 
      }}
      >
        Powerful Portfolio Management Features
      </Typography>
      <Typography 
        variant='subtitle1' 
        align='center' 
        color='text.secondary' 
        sx={{
        mb: 6,
        fontSize: {
          xs: '0.875rem',
          sm: '1rem',
          md: '1.125rem'
        }
        }}
        >
          Everything you need to manage your crypto investments
      </Typography>

      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ py: 4 }}>
        {features.map((feature, index) => {
          const isHovered = hoveredIndex === index;
          const Icon = feature.icon;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: isHovered ? themeValues.shadow4 : themeValues.shadow1,
                  transform: isHovered ? 'translateY(-10px)' : 'none',
                  backgroundColor: isHovered ? themeValues.hoverBg : themeValues.paperBg,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ fontSize: 48, mb: 2, color: theme.palette.primary.main }}>
                    <Icon />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  </Box>
);
};

export default FeaturesSection;
