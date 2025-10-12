import { FaBitcoin, FaChartLine, FaEthereum, FaLock, FaGlobe } from 'react-icons/fa';
import { SiLitecoin, SiDogecoin, SiRipple, SiStellar } from 'react-icons/si';
import { BarChart, Lock, AccountBalanceWallet, ListAlt } from '@mui/icons-material';

export const floatingIcons = [
  { icon: FaBitcoin, left: '10%', top: '20%', delay: '0s', size: '4rem' },
  { icon: FaEthereum, right: '15%', top: '30%', delay: '2s', size: '4rem' },
  { icon: SiLitecoin, left: '25%', bottom: '20%', delay: '4s', size: '4rem' },
  { icon: SiDogecoin, right: '25%', bottom: '30%', delay: '1s', size: '3rem' },
  { icon: SiRipple, left: '15%', top: '50%', delay: '3s', size: '4rem' },
  { icon: SiStellar, right: '10%', top: '60%', delay: '5s', size: '2.5rem' },
];

export const heroContent = {
  title: 'Take Control of Your Crypto Portfolio',
  subtitle:
    'Track, analyze, and optimize your cryptocurrency investments across multiple exchanges in one secure platform',
};

export const stats = [
  { value: 10000, label: "Active Users" },
  { value: 500000000, label: "Assets Tracked" },
  { value: 50, label: "Supported Exchanges" },
];

export const features = [
  {
    icon: BarChart,
    title: "Real-time Tracking",
    description: "Monitor portfolio value with live market data updates",
  },
  {
    icon: FaChartLine,
    title: 'Portfolio Analytics',
    description: 'Visualize your growth and performance with detailed analytics.',
  },
  {
    icon: FaLock,
    title: 'Secure Authentication',
    description: 'Your data is safe with advanced encryption and secure login mechanisms.',
  },
  {
    icon: FaGlobe,
    title: 'Multi-Asset Support',
    description: 'Track multiple cryptocurrencies across various exchanges in one place.',
  },
  {
    icon: AccountBalanceWallet,
    title: "Asset Distribution",
    description: "Visual breakdown of your cryptocurrency allocations",
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description: "Military-grade encryption for your sensitive data",
  },
  {
    icon: ListAlt,
    title: "Transaction History",
    description: "Detailed log of all your crypto transactions",
  },
];
