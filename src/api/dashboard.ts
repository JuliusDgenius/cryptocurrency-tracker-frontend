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
      const response = await api.get(`/portfolio/${portfolioId}`);
      return response.data.portfolio;
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
      console.log(`Fetching portfolio summary for portfolio ${portfolioId} with timeframe ${timeframe}`);
      const response = await api.get(`/portfolio/${portfolioId}/metrics`, {
        params: { timeframe }
      });
      console.log('Portfolio summary response:', response.data);
      if (!response.data) {
        throw new Error('No data received from portfolio metrics endpoint');
      }
      return {
        totalValue: response.data.totalValue,
        profitLoss: response.data.profitLoss,
        assetAllocation: response.data.assetAllocation,
        performance: response.data.performance
      };
    } catch (error: any) {
      console.error('Error fetching portfolio summary:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(`Failed to fetch portfolio summary: ${error.response.data.message || 'Unknown error'}`);
      }
      throw new Error('Failed to fetch portfolio summary: Network error');
    }
  },

  async getAssetDistribution(portfolioId: string): Promise<AssetDistributionData[]> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/assets`);
      console.log('Assets response:', response.data)
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch asset distribution');
    }
  },

  async getRecentActivity(portfolioId: string): Promise<RecentActivityData[]> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/transaction/transactions`, {
        params: {
          page: 1,
          limit: 10,
          sort: 'date:desc'
        }
      });
      return response.data.transactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        asset: tx.asset.name,
        symbol: tx.cryptocurrency,
        amount: tx.amount,
        price: tx.pricePerUnit,
        totalValue: tx.amount * tx.pricePerUnit,
        timestamp: tx.date,
        status: 'COMPLETED'
      }));
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
      const data = response.data;
      
      // Transform risk levels to numeric values
      type RiskLevel = 'LOW' | 'MODERATE' | 'MODERATE_HIGH' | 'HIGH' | 'VERY_HIGH';
      const riskLevelMap: Record<RiskLevel, number> = {
        'LOW': 20,
        'MODERATE': 40,
        'MODERATE_HIGH': 60,
        'HIGH': 80,
        'VERY_HIGH': 100
      };

      interface StressTestResult {
        scenario: string;
        impact: number;
      }

      return {
        riskLevel: data.overallRisk,
        volatility: data.volatility * 100, // Convert to percentage
        liquidityRisk: riskLevelMap[data.liquidityRisk as RiskLevel] || 0,
        concentrationRisk: riskLevelMap[data.concentrationRisk as RiskLevel] || 0,
        marketRisk: riskLevelMap[data.marketRisk as RiskLevel] || 0,
        stressTestResults: (data.stressTestResults as StressTestResult[]).map(test => ({
          scenario: test.scenario,
          portfolioImpact: test.impact
        }))
      };
    } catch (error) {
      throw new Error('Failed to fetch risk analysis');
    }
  },

  async getCorrelationMatrix(portfolioId: string): Promise<CorrelationMatrixData> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/correlation-matrix`);
      const matrix = response.data;
      
      // Transform the matrix into the expected format
      const assets = Object.keys(matrix);
      const correlations = assets.map(asset1 => 
        assets.map(asset2 => matrix[asset1][asset2])
      );
      
      return {
        assets,
        correlations
      };
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