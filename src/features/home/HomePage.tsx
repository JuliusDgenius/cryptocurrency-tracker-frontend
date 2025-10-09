import { useMemo, useState, } from 'react';
import { Button, Container, Box, Typography, Grid, Card,
    CardContent, useTheme as muiUseTheme, IconButton, Link as MuiLink
} from '@mui/material';
import { BarChart, Lock, AccountBalanceWallet, ListAlt,
    ArrowRightAlt, Twitter, Telegram, LinkedIn,
 } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { 
  SiLitecoin, SiDogecoin, SiRipple, SiStellar 
} from 'react-icons/si';
import { StatItem } from '@/components/stats';

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

const floatingIcons = [
  { icon: <FaBitcoin />, left: '10%', top: '20%', delay: '0s', size: '4rem' },
  { icon: <FaEthereum />, right: '15%', top: '30%', delay: '2s', size: '4rem' },
  { icon: <SiLitecoin />, left: '25%', bottom: '20%', delay: '4s', size: '4rem' },
  { icon: <SiDogecoin />, right: '25%', bottom: '30%', delay: '1s', size: '3rem' },
  { icon: <SiRipple />, left: '15%', top: '50%', delay: '3s', size: '3rem' },
  { icon: <SiStellar />, right: '10%', top: '60%', delay: '5s', size: '2.5rem' }
  // Note: I removed the duplicate Gi icons that were stacked on top of each other
];

// Stats array
const stats = [
  { value: 10000, label: "Active Users" },
  { value: 500000000, label: "Assets Tracked" },
  { value: 50, label: "Supported Exchanges" }
];

const HomePage = () => {
  const theme = muiUseTheme();
  const { user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = useMemo(() => [
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
    ], []);
      
    return (
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflowX: 'hidden'
        }}>
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 8, sm: 12, md: 15 },
            position: 'relative'
          }}>
            {/* Animated background elements */}
            <Box sx={{
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
            }}>
              {floatingIcons.map((item, index) => (
              <Box
                key={index}
                sx={{
                  left: item.left,
                  right: item.right,
                  top: item.top,
                  bottom: item.bottom,
                  animationDelay: item.delay,
                  fontSize: item.size,
                }}
              >
                {item.icon}
              </Box>
              ))}
            </Box>

            <Typography 
                variant="h1" 
                gutterBottom 
                sx={{ 
                fontWeight: 700,
                position: 'relative',
                zIndex: 1,
                fontSize: {
                  xs: '1.8rem',    // Mobile: ~28px
                  sm: '2.5rem',    // Small tablet: ~40px
                  md: '3rem',      // Tablet: ~48px
                  lg: '3.75rem'    // Desktop: ~60px (default h2 size)
                },
                lineHeight: {
                  xs: 1.3,
                  sm: 1.3,
                  md: 1.2
                }
                }}
            >
              Take Control of Your
              <Box component="span" sx={{
                color: 'primary.main', 
                ml: { xs: 0.5, sm: 1.5 },  // Responsive spacing
                display: 'block', // Force new lines on small screens
                [theme.breakpoints.up('sm')]: { // Inline on larger screens
                  display: 'inline-block'
                }
                }}>
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
              Track, analyze, and optimize your cryptocurrency investments across multiple exchanges in one secure platform
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', zIndex: 1, flexWrap: 'wrap' }}>
              {user ? (
                <Button
                  variant='contained'
                  size='large'
                  endIcon={<ArrowRightAlt />}
                  component={Link}
                  to='/dashboard'
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="contained" 
                    size="large"
		    sx={{
    		    transform: 'scale(1)',
		    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                       transform: 'scale(1.05)',
                       },
                    }}
                    endIcon={<ArrowRightAlt />}
                    component={Link}
                    to="/register"
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    component={Link}
                    to="/demo"
                  >
                    Live Demo
                  </Button>    
                </>
              )}
            </Box>
          </Box>
          </Container>
    
          {/* Features Grid */}
          <Container maxWidth="lg" id='features'>
            <Typography 
              variant='h3' 
              align='center' 
              sx={{
                mb: 2,
                fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem'
              } 
            }}>
                Powerful Portfolio Management
            </Typography>
            <Typography variant='subtitle1' align='center' color='text.secondary' sx={{
              mb: 6,
              fontSize: {
                xs: '0.875rem',
                sm: '1rem',
                md: '1.125rem'
              }
              }}>
                Everything you need to manage your crypto investments
            </Typography>
            <Grid container spacing={{ xs: 4, md: 6 }} sx={{ py: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card 
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                      boxShadow: hoveredFeature === index ? theme.shadows[4] : theme.shadows[1],
                      transform: hoveredFeature === index ? 'translateY(-10px)' : 'none',
                      bgcolor: hoveredFeature === index ? 'action.hover' : 'background.paper',
		      cursor: 'pointer',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                      <Box sx={{ 
                        color: hoveredFeature === index ? 'primary.main' : 'text.primary',
                        mb: 2
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{
                        fontSize: {
                          xs: '1.1rem',
                          sm: '1.25rem',
                          md: '1.5rem'
                        }
                      }}>
                          {feature.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{
                        fontSize: {
                          xs: '0.8rem',
                          sm: '0.9rem',
                          md: '1rem'
                        }
                      }}>
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
              py: { xs: 6, md: 10 },
              mb: { xs: 4, md: 6 },
              overflow: 'hidden', // Prevent animation overflow
            }}>
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

            {/* CTA */}
            <Container sx={{
              py: { xs: 8, md: 10 },
              mb: { xs: 4, md: 6 },
              textAlign: 'center',
              bgcolor: 'background.default' 
            }}>
              <Typography variant="h4" gutterBottom sx={{
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
              }}>
                Ready to optimize your crypto portfolio?
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowRightAlt />}
                component={Link}
                to={user ? '/dashboard' : '/register'}
                sx={{ 
                  mt: 3,
                  px: 4,
                  py: 1.5 
                }}
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
            </Container>

            {/* Footer */}
            <Box sx={{ 
              bgcolor: 'background.paper',
              borderTop: `1px solid ${theme.palette.divider}`,
              py: { xs: 6, md: 8 }
            }}>
              <Container maxWidth="lg">
                <Grid container spacing={{ xs: 4, md: 8 }}>
                  {/* Brand column */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                      <Box component="span" sx={{ color: '#22d3ee' }}>Crypto</Box>Folio
                      {/* CryptoFolio */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Empowering investors with comprehensive crypto portfolio management since 2024
                    </Typography>
                  </Grid>

                  {/* Links Columns */}
                  {[
                    {
                      title: "Legal",
                      links: [
                        { text: "Privacy Policy", href: "/privacy" },
                        { text: "Terms of Service", href: "/terms" },
                        { text: "Cookie Policy", href: "/cookies" }
                      ]
                    },
                    {
                      title: "Company",
                      links: [
                        { text: "About Us", href: "/about" },
                        { text: "Contact", href: "/contact" },
                        { text: "Blog", href: "/blog" }
                      ]
                    }
                  ].map((column, colIndex) => (
                    <Grid item xs={6} md={2} key={colIndex}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        {column.title}
                      </Typography>
                      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {column.links.map((link, linkIndex) => (
                          <MuiLink 
                            key={linkIndex}
                            href={link.href}
                            color="text.secondary"
                            variant="body2"
                            sx={{ '&:hover': { color: 'primary.main' } }}
                          >
                            {link.text}
                          </MuiLink>
                        ))}
                      </Box>
                    </Grid>
                  ))}

                  {/* Social Links Column */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Connect With Us
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    {[
                      { icon: <Twitter />, label: "Twitter", href: "https://twitter.com" },
                      { icon: <Telegram />, label: "Telegram", href: "https://telegram.org" },
                      { icon: <LinkedIn />, label: "LinkedIn", href: "https://linkedin.com" }
                    ].map((social, index) => (
                      <IconButton 
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { 
                            color: 'primary.main',
                            bgcolor: 'transparent' 
                          }
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
            </Box>
    );
};

export default HomePage;
