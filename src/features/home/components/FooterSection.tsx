import { useMemo } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link as MuiLink,
    IconButton,
  } from '@mui/material';
  import { Twitter, Telegram, LinkedIn } from '@mui/icons-material';
  import { useTheme } from '@mui/material/styles';
  
  const FooterSection = () => {
    const theme = useTheme();
    
    // Memoize theme values to prevent deepmerge recursion
    const dividerColor = useMemo(() => theme.palette.divider, [theme]);
  
    const footerColumns = [
      {
        title: 'Legal',
        links: [
          { text: 'Privacy Policy', href: '/privacy' },
          { text: 'Terms of Service', href: '/terms' },
          { text: 'Cookie Policy', href: '/cookies' },
        ],
      },
      {
        title: 'Company',
        links: [
          { text: 'About Us', href: '/about' },
          { text: 'Contact', href: '/contact' },
          { text: 'Blog', href: '/blog' },
        ],
      },
    ];
  
    const socials = [
      { icon: <Twitter />, label: 'Twitter', href: 'https://twitter.com' },
      { icon: <Telegram />, label: 'Telegram', href: 'https://telegram.org' },
      { icon: <LinkedIn />, label: 'LinkedIn', href: 'https://linkedin.com' },
    ];
  
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderTop: `1px solid ${dividerColor}`,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }}>
            {/* Brand */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                <Box component="span" sx={{ color: '#22d3ee' }}>
                  Crypto
                </Box>
                Folio
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                Empowering investors with comprehensive crypto portfolio management since 2024
              </Typography>
            </Grid>
  
            {/* Link Columns */}
            {footerColumns.map((col, idx) => (
              <Grid item xs={6} md={2} key={idx}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ fontWeight: 600 
                }}>
                  {col.title}
                </Typography>
                <Box 
                  component="nav" 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1 
                  }}>
                  {col.links.map((link, i) => (
                    <MuiLink
                      key={i}
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
  
            {/* Social Icons */}
            <Grid item xs={12} md={4}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600 
                  }}
                >
                Connect With Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {socials.map((social, index) => (
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
                        bgcolor: 'transparent',
                      },
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
    );
  };
  
  export default FooterSection;