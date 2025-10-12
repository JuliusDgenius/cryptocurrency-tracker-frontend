import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { floatingIcons, heroContent } from '../constants/homeData';
import { keyframes } from '@emotion/react';

// Animation for floating crypto icons
const float = keyframes`
  0% {
    transform: translateY(0px);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-20px);
    opacity: 0.2;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.1;
  }
`;

const HeroSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, sm: 12, md: 15 },
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Floating Icons */}
      <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
        '& > *': {
          position: 'absolute',
          animation: `${float} 8s ease-in-out infinite`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          fontSize: '4rem',
          color: theme.palette.primary.light,
          opacity: 0.1
        }
      }}
      >
      {floatingIcons.map((item, i) => {
        const Icon = item.icon;
        return (
          <Box
            key={i}
            sx={{
              left: item.left,
              right: item.right,
              top: item.top,
              bottom: item.bottom,
              animationDelay: item.delay,
              fontSize: item.size,
            }}
          >
            <Icon />
          </Box>
        );
      })}
      </Box>

      <Typography
        variant="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          position: 'relative',
          zIndex: 1,
          fontSize: {
            xs: '1.8rem',
            sm: '2.5rem',
            md: '3rem',
            lg: '3.75rem'
          },
          lineHeight: {
            xs: 1.3,
            sm: 1.3,
            md: 1.2
          },
        }}
      >
        {heroContent.title.slice(0, 21)} 
        <Box component="span" sx={{
                color: 'primary.main', 
                ml: { xs: 0.5, sm: 1.5 },  // Responsive spacing
                display: 'block', // Force new lines on small screens
                [theme.breakpoints.up('sm')]: { // Inline on larger screens
                  display: 'inline-block'
                }
                }}>
                {heroContent.title.slice(21)}
              </Box>
      </Typography>
      
      <Typography
        variant="h6"
        sx={{ 
          color: 'text.secondary',
          mb: 4,
          maxWidth: 600,
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
          fontSize: {
            xs: '0.875rem',  // Mobile: ~14px
            sm: '1rem',      // Tablet: ~16px
            md: '1.125rem'   // Desktop: ~18px
          },
          // Responsive line heights
          lineHeight: {
            xs: 1.5,
            sm: 1.6
          }
        }}
      >
        {heroContent.subtitle}
      </Typography>
    </Box>
  );
};

export default HeroSection;
