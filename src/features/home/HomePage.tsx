import { Box, useTheme } from '@mui/material';
import { motion, easeOut } from 'framer-motion';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import StatsSection from './components/StatsSection';
import CTASection from './components/CTASection';

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
      <Box py={8}>
        <motion.div {...fadeInProps}>
          <HeroSection />
        </motion.div>
      </Box>

      {/* Features Section */}
      <Box py={8}>
        <motion.div {...fadeInProps}>
          <FeaturesSection />
        </motion.div>
      </Box>

      {/* Stats Section */}
      <Box py={8}>
        <motion.div {...fadeInProps}>
          <StatsSection />
        </motion.div>
      </Box>

      {/* CTA Section */}
      <Box py={8}>
        <motion.div {...fadeInProps}>
          <CTASection />
        </motion.div>
      </Box>
    </Box>
  );
};

export default HomePage;
