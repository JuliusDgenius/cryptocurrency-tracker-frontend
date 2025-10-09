import { useState, useEffect, useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { Typography, Box } from '@mui/material';


interface StatItemProps {
  stat: { value: number; label: string };
  index: number;
}

export const StatItem = ({ stat, index }: StatItemProps) => {
  const { count, animate, ref: countRef } = useCountUp(stat.value);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animate();
          observer.unobserve(entry.target); // Animate only once
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animate]);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M+`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K+`;
    return `${value}+`;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      <Typography 
        variant="h3" 
        color="primary.main" 
        sx={{ 
            mb: 1, 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } 
        }}>
        <span ref={countRef}>{formatValue(count)}</span>
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ fontSize: { xs: '0.875rem', md: '1rem' }
        }}>
        {stat.label}
      </Typography>
    </Box>
  );
};
