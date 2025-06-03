import { api } from './axios';
import type {
  Portfolio,
  PortfolioSummaryData,
  AssetDistributionData,
  RecentActivityData,
  PortfolioHealthMetrics,
  RiskAnalysisData,
  CorrelationMatrixData
} from '@/types/dashboard';

const dashboardService = {
  async getPortfolios(): Promise<Portfolio[]> {
    try {
      const response = await api.get('/portfolio/portfolios');
      console.log('Porfolio:', response.data.portfolios[0])
      return response.data.portfolios;
    } catch (error) {
      throw new Error('Failed to fetch portfolios');
    }
  },

  async getPortfolioDetails(portfolioId: string): Promise<Portfolio> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/details`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch portfolio details');
    }
  },

  async createPortfolio(name: string, description: string = ''): Promise<Portfolio> {
    try {
      const response = await api.post('/portfolio/create', { name, description });
      return response.data.portfolio;
    } catch (error) {
      throw new Error('Failed to create portfolio');
    }
  },

  async setPrimaryPortfolio(portfolioId: string): Promise<void> {
    try {
      await api.patch(`/portfolio/${portfolioId}/set-primary`);
    } catch (error) {
      throw new Error('Failed to set primary portfolio');
    }
  },

  async getPortfolioSummary(portfolioId: string, timeframe: string): Promise<PortfolioSummaryData> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/summary?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch portfolio summary');
    }
  },

  async getAssetDistribution(portfolioId: string): Promise<AssetDistributionData[]> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/assets`);
      return response.data.assets;
    } catch (error) {
      throw new Error('Failed to fetch asset distribution');
    }
  },

  async getRecentActivity(portfolioId: string): Promise<RecentActivityData[]> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/recent-activity`);
      return response.data.transactions;
    } catch (error) {
      throw new Error('Failed to fetch recent activity');
    }
  },

  async getPerformanceData(portfolioId: string, timeframe: string): Promise<any> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/performance?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch performance data');
    }
  },

  async getPortfolioHealth(portfolioId: string): Promise<PortfolioHealthMetrics> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/health`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch portfolio health metrics');
    }
  },

  async getRiskAnalysis(portfolioId: string): Promise<RiskAnalysisData> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/risk-analysis`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch risk analysis');
    }
  },

  async getCorrelationMatrix(portfolioId: string): Promise<CorrelationMatrixData> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/correlation`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch correlation matrix');
    }
  },

  async deletePortfolio(portfolioId: string): Promise<void> {
    try {
      await api.delete(`/portfolio/${portfolioId}`);
    } catch (error) {
      throw new Error('Failed to delete portfolio');
    }
  },
  
  async generateReport(portfolioId: string, reportType: string): Promise<any> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/reports/${reportType}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to generate report');
    }
  },

  async updatePortfolio(portfolioId: string, name: string, description: string): Promise<Portfolio> {
    const response = await api.patch(`/portfolio/${portfolioId}`, { name, description });
    return response.data;
  }
};

export default dashboardService;