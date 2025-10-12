import { Box, useTheme } from '@mui/material';
import { motion, easeOut } from 'framer-motion';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import StatsSection from './components/StatsSection';
import CTASection from './components/CTASection';
import FooterSection from './components/FooterSection';

const fadeInProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOut },
  viewport: { once: true },
};

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflowX: 'hidden',
      }}
    >
      {/* Hero Section */}
      <motion.div {...fadeInProps}>
        <HeroSection />
      </motion.div>

      {/* Features Section */}
      <motion.div {...fadeInProps}>
        <FeaturesSection />
      </motion.div>

      {/* Stats Section */}
      <motion.div {...fadeInProps}>
        <StatsSection />
      </motion.div>

      {/* CTA Section */}
      <motion.div {...fadeInProps}>
        <CTASection />
      </motion.div>

      {/* Footer Section */}
      <FooterSection />
    </Box>
  );
};

export default HomePage;
