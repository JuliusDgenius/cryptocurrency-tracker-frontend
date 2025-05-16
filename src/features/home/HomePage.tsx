import { useState } from 'react';
import { Button, Container, Box, Typography, Grid, Card,
    CardContent, useTheme, IconButton, Link
} from '@mui/material';
import { BarChart, Lock, AccountBalanceWallet, ListAlt,
    ArrowRightAlt, Twitter, Telegram, LinkedIn,
 } from '@mui/icons-material';
 import { keyframes } from '@emotion/react';

//  Animation for floating crypto icons
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const HomePage = () => {
    const theme = useTheme();
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const features = [
        {
          icon: <BarChart fontSize="large" />,
          title: "Real-time Tracking",
          description: "Monitor portfolio value with live market data updates"
        },
        {
          icon: <AccountBalanceWallet fontSize="large" />,
          title: "Asset Distribution",
          description: "Visual breakdown of your cryptocurrency allocations"
        },
        {
          icon: <Lock fontSize="large" />,
          title: "Secure Storage",
          description: "Military-grade encryption for your sensitive data"
        },
        {
            icon: <ListAlt fontSize="large" />,
            title: "Transaction History",
            description: "Detailed log of all your crypto transactions"
          }
        ];
      
    return (
        <Box sx={{ 
            bgcolor: 'background.default',
            color: 'text.primary',
            overflowX: 'hidden'
          }}>
            {/* Hero Section */}
            <Container maxWidth="lg">
              <Box sx={{ 
                textAlign: 'center', 
                py: 15,
                position: 'relative'
              }}>
                {/* Animated background elements */}
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0.1,
                    zIndex: 0,
                    '& > *': {
                    position: 'absolute',
                    animation: `${float} 6s ease-in-out infinite`
                    }
                }}>
                  <Typography sx={{ left: '10%', top: '20%' }}>₿</Typography>
                  <Typography sx={{ right: '15%', top: '30%' }}>Ξ</Typography>
                  <Typography sx={{ left: '25%', bottom: '20%' }}>⚡</Typography>
                </Box>

                <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 1
                    }}
                >
                  Take Control of Your
                  <Box component="span" sx={{ color: 'primary.main', ml: 1.5 }}>
                    Crypto Portfolio
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
                  zIndex: 1
                }}
                >
                  Track, analyze, and optimize your cryptocurrency investments across multiple exchanges in one secure platform
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', zIndex: 1 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    endIcon={<ArrowRightAlt />}
                    href="/register"
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    href="/demo"
                    >
                    Live Demo
                  </Button>
                </Box>
              </Box>
            </Container>
      
            {/* Features Grid */}
            <Container maxWidth="lg">
              <Grid container spacing={6} sx={{ py: 10 }}>
                {features.map((feature, index) => (
                  <Grid xs={12} md={6} key={index}>
                    <Card 
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                      sx={{
                        height: '100%',
                        transition: 'transform 0.3s',
                        transform: hoveredFeature === index ? 'translateY(-10px)' : 'none',
                        bgcolor: 'background.paper'
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ 
                          color: hoveredFeature === index ? 'primary.main' : 'text.primary',
                          mb: 2
                        }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h5" gutterBottom>
                           {feature.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {feature.description}
                        </Typography>
                        </CardContent>
                    </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
              {/* Stats Section */}
              <Box sx={{ 
                bgcolor: 'background.paper',
                py: 10 
              }}>
                <Container maxWidth="lg">
                  <Grid container spacing={8} justifyContent="center">
                    <Grid xs={6} sm={3}>
                      <Typography variant="h3" align="center" color="primary.main">
                        10K+
                      </Typography>
                      <Typography align="center">Active Users</Typography>
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <Typography variant="h3" align="center" color="primary.main">
                        $500M+
                      </Typography>
                      <Typography align="center">Assets Tracked</Typography>
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <Typography variant="h3" align="center" color="primary.main">
                        50+
                      </Typography>
                      <Typography align="center">Supported Exchanges</Typography>
                    </Grid>
                  </Grid>
                </Container>
              </Box>

              {/* Footer */}
              <Box sx={{ 
                bgcolor: 'background.paper',
                borderTop: `1px solid ${theme.palette.divider}`,
                py: 8 
              }}>
                <Container maxWidth="lg">
                  <Grid container spacing={8}>
                    <Grid xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        CryptoFolio
                      </Typography>
                      <Typography color="text.secondary">
                        Empowering investors with comprehensive crypto portfolio management since 2024
                      </Typography>
                    </Grid>

                    <Grid xs={6} md={3}>
                      <Typography variant="subtitle1" gutterBottom>
                        Legal
                      </Typography>
                      <Box display="flex" flexDirection="column">
                        <Link href="/privacy" color="text.secondary">Privacy Policy</Link>
                        <Link href="/terms" color="text.secondary">Terms of Service</Link>
                        <Link href="/cookies" color="text.secondary">Cookie Policy</Link>
                      </Box>
                    </Grid>

                    <Grid xs={6} md={3}>
                      <Typography variant="subtitle1" gutterBottom>
                        Connect
                      </Typography>
                      <Box display="flex" gap={2}>
                        <IconButton href="https://twitter.com" target="_blank">
                          <Twitter />
                        </IconButton>
                        <IconButton href="https://telegram.org" target="_blank">
                          <Telegram />
                        </IconButton>
                        <IconButton href="https://linkedin.com" target="_blank">
                          <LinkedIn />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </Box>
    );
};

export default HomePage;