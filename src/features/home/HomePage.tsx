import { useMemo, useState, useEffect, useRef } from 'react';
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
import { SiLitecoin, SiDogecoin, SiRipple, SiStellar } from 'react-icons/si';
import { GiCash, GiPayMoney, GiTakeMyMoney } from 'react-icons/gi';

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

// Helper function
const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
  const range = end - start;
  const capDuration = Math.min(duration, range > 10000 ? 2000 : duration);
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / capDuration, 1);
    const value = Math.floor(progress * range + start);

    // Format numbers
    if (end >= 1000000) {
      element.textContent = `$${(value/1000000).toFixed(0)}M+`;
    } else if (end >= 1000) {
      element.textContent = `${(value/1000).toFixed(0)}K+`;
    } else {
      element.textContent = `${value}+`;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }
};

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
                  {/* Crypto Icons */}
                  <Box sx={{ left: '10%', top: '20%', animationDelay: '0s' }}>
                    <FaBitcoin />
                  </Box>
                  <Box sx={{ right: '15%', top: '30%', animationDelay: '2s' }}>
                    <FaEthereum />
                  </Box>
                  <Box sx={{ left: '25%', bottom: '20%', animationDelay: '4s' }}>
                    <SiLitecoin />
                  </Box>
                  <Box sx={{ right: '25%', bottom: '30%', animationDelay: '1s', fontSize: '3rem' }}>
                  <SiDogecoin />
                  </Box>
                  <Box sx={{ left: '15%', top: '50%', animationDelay: '3s', fontSize: '3rem' }}>
                    <SiRipple />
                  </Box>
                  <Box sx={{ right: '10%', top: '60%', animationDelay: '5s', fontSize: '2.5rem' }}>
                    <SiStellar />
                  </Box>
                  <Box sx={{ left: '30%', top: '10%', animationDelay: '6s', fontSize: '3.5rem' }}>
                    <GiCash />
                  </Box>
                  <Box sx={{ left: '30%', top: '10%', animationDelay: '6s', fontSize: '3.5rem' }}>
                    <GiPayMoney />
                  </Box>
                  <Box sx={{ left: '30%', top: '10%', animationDelay: '6s', fontSize: '3.5rem' }}>
                    <GiTakeMyMoney />
                  </Box>

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
              <Typography variant='h3' align='center' sx={{
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
                        transition: 'transform 0.3s',
                        boxShadow: hoveredFeature === index ? 3 : 1,
                        transform: hoveredFeature === index ? 'translateY(-10px)' : 'none',
                        bgcolor: 'background.paper'
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
                    {[
                      { value: 10000, label: "Active Users" },
                      { value: 500000000, label: "Assets Tracked" },
                      { value: 50, label: "Supported Exchanges" }
                    ].map((stat, index) => {
                      const statRef = useRef<HTMLSpanElement>(null);
                      const containerRef = useRef<HTMLDivElement>(null);
                      const [animated, setAnimated] = useState(false);

                      useEffect(() => {
                        if (typeof window === 'undefined') return // SSR check

                        const prefersReducedMotion = window.matchMedia(
                          'prefers-reduced-motion: reduce'
                        ).matches;

                        const observer = new IntersectionObserver(
                        ([entry]) => {
                          if (entry.isIntersecting && !animated) {
                            setAnimated(true);
                            // Skip motion for reduced motion preference
                            if (prefersReducedMotion && statRef.current) {
                              statRef.current.textContent = 
                                stat.value >= 1000000 ? `$${(stat.value/1000000).toFixed(0)}M+` :
                                stat.value >= 1000 ? `${(stat.value/1000).toFixed(0)}K+` :
                                `${stat.value}+`;
                            }
                            if (statRef.current) {
                              animateValue(statRef.current, 0, stat.value, 1500)
                            } else {
                              animateValue(statRef.current, 0, stat.value, 1000);
                            }
                          }
                        },
                        { threshold: 0.1 }
                        );

                        if (containerRef.current) {
                          observer.observe(containerRef.current)
                        }

                        return () => {
                          if (containerRef.current) {
                            observer.unobserve(containerRef.current);
                          }
                        };
                      }, [stat.value, animated]);

                      return (
                        <Grid item xs={12} sm={4} key={index} ref={containerRef}>
                          <Box 
                            sx={{ 
                              textAlign: 'center',
                              px: { xs: 2, sm: 3 },
                              py: { xs: 2, sm: 0 },
                              opacity: animated ? 1 : 0,
                              transform: animated ? 'translateY(0)' : 'translateY(20px)',
                              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                              transitionDelay: `${index * 0.15}s`
                            }}>
                              <Typography 
                                variant="h3" 
                                color="primary.main" 
                                sx={{ 
                                  mb: 1,
                                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                }}
                              >

                                {/* Fallback for no-JS and initial render */}
                                <span ref={statRef}>
                                  {stat.value >= 1000000 ? `$${(stat.value/1000000).toFixed(0)}M+` :
                                  stat.value >= 1000 ? `${(stat.value/1000).toFixed(0)}K+` :
                                  `${stat.value}+`}
                                </span>
                                <noscript>
                                  {stat.value >= 1000000 ? `$${(stat.value/1000000).toFixed(0)}M+` :
                                  stat.value >= 1000 ? `${(stat.value/1000).toFixed(0)}K+` :
                                  `${stat.value}+`}
                                </noscript>
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                opacity: animated ? 1 : 0,
                                transition: 'opacity 0.4s ease-out',
                                transitionDelay: `${index * 0.15 + 0.3}s`
                              }}>
                                {stat.label}
                              </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
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