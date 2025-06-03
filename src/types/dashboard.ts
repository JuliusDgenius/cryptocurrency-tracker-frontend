export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  twentyFourHourChange: number;
  isPrimary: boolean;
  createdAt: string;
  lastUpdated: string;
  profitLoss: {
    day: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
    twentyFourHour: number;
  };
}

export interface PortfolioSummaryData {
  totalValue: number;
  twentyFourHourChange: number;
  profitLoss: {
    day: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
  };
  topPerformers: {
    symbol: string;
    name: string;
    change: number;
  }[];
  worstPerformers: {
    symbol: string;
    name: string;
    change: number;
  }[];
}

export interface AssetDistributionData {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  value: number;
  allocation: number;
  category: string;
  marketCap: string;
  twentyFourHourChange: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface RecentActivityData {
  id: string;
  type: 'BUY' | 'SELL' | 'TRANSFER' | 'STAKING' | 'DIVIDEND';
  asset: string;
  symbol: string;
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface PortfolioHealthMetrics {
  diversificationScore: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  valueAtRisk: number;
  beta: number;
}

export interface RiskAnalysisData {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  volatility: number;
  liquidityRisk: number;
  concentrationRisk: number;
  marketRisk: number;
  stressTestResults: {
    scenario: string;
    portfolioImpact: number;
  }[];
}

export interface CorrelationMatrixData {
  assets: string[];
  correlations: number[][];
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  benchmark?: number;
}

export interface PortfolioHealthMetrics {
  diversificationScore: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  valueAtRisk: number;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
  benchmark?: number;
}