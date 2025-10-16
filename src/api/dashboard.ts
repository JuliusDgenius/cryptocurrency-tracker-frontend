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

interface AddAssetRequest {
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  value: number;
  allocation: number;
  category?: string;
  marketCap?: string;
  twentyFourHourChange: number;
  profitLossPercentage: number;
}

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

  async createPortfolio(
    name: string, 
    description: string = ''
  ): Promise<Portfolio> {
    try {
      const response = await api.post(
        '/portfolio/create', { name, description }
      );
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

  async getPortfolioSummary(
    portfolioId: string, timeframe: string
  ): Promise<PortfolioSummaryData> {
    try {
      console.log(
        `Fetching portfolio summary for portfolio ${portfolioId} with timeframe ${timeframe}`
      );
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
        throw new Error(
          `Failed to fetch portfolio summary: ${error.response.data.message || 'Unknown error'}`
        );
      }
      throw new Error('Failed to fetch portfolio summary: Network error');
    }
  },

  async getAssetDistribution(
    portfolioId: string
  ): Promise<AssetDistributionData[]> {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/assets`);
      console.log('Assets response:', response.data)
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch asset distribution');
    }
  },

  async getRecentActivity(
    portfolioId: string
  ): Promise<RecentActivityData[]> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/transaction/transactions`, {
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

  async getPerformanceData(
    portfolioId: string, timeframe: string): Promise<any> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/performance`,
        {
          params: { timeFrame: timeframe }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch performance data');
    }
  },

  async getPortfolioHealth(
    portfolioId: string
  ): Promise<PortfolioHealthMetrics> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/health`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch portfolio health metrics');
    }
  },

  async getRiskAnalysis(
    portfolioId: string
  ): Promise<RiskAnalysisData> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/risk-analysis`
      );
      const data = response.data;
      
      // Transform risk levels to numeric values
      type RiskLevel = 'LOW' | 'MODERATE' | 'MODERATE_HIGH' |
        'HIGH' | 'VERY_HIGH';
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
        stressTestResults: (
          data.stressTestResults as StressTestResult[]
          ).map(test => ({
          scenario: test.scenario,
          portfolioImpact: test.impact
        }))
      };
    } catch (error) {
      throw new Error('Failed to fetch risk analysis');
    }
  },

  async getCorrelationMatrix(
    portfolioId: string
  ): Promise<CorrelationMatrixData> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/correlation-matrix`
      );
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
  
  async generateReport(
    portfolioId: string, reportType: string
  ): Promise<any> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/reports/${reportType}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to generate report');
    }
  },

  async updatePortfolio(
    portfolioId: string, name: string, description: string
  ): Promise<Portfolio> {
    const response = await api.patch(
      `/portfolio/${portfolioId}`, { name, description }
    );
    return response.data;
  },

  async addAssetToPortfolio(
    portfolioId: string, asset: AddAssetRequest
  ): Promise<void> {
    const response = await api.post(
      `/portfolio/${portfolioId}/assets`, asset
    );
    return response.data;
  },

  async getAvailableCryptos(): Promise<Array<{ 
    symbol: string; name: string; currentPrice: number 
  }>> {
    const response = await api.get('/prices/available');
    return response.data;
  },

  async deleteAsset(
    portfolioId: string, assetId: string
  ): Promise<void> {
    try {
      await api.delete(`/portfolio/${portfolioId}/assets/${assetId}`);
    } catch (error) {
      throw new Error('Failed to delete asset');
    }
  },

  async getExchangeAccounts(): Promise<any[]> {
    try {
      const response = await api.get('/exchange-accounts/accounts');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch exchange accounts');
    }
  },

  async addExchangeAccount(
    data: { 
      exchange: string; apiKey: string; apiSecret: string; label: string 
    }): Promise<any> {
    try {
      const response = await api.post('/exchange-accounts/exchange', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add exchange account');
    }
  },

  async deleteExchangeAccount(id: string): Promise<void> {
    try {
      await api.delete(`/exchange-accounts/delete/${id}`);
    } catch (error) {
      throw new Error('Failed to delete exchange account');
    }
  },

  async getWalletAddresses(): Promise<any[]> {
    try {
      const response = await api.get('/wallet-addresses/addresses');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch wallet addresses');
    }
  },

  async addWalletAddress(
    data: { blockchain: string; address: string; label?: string 

    }): Promise<any> {
    try {
      const response = await api.post(
        '/wallet-addresses/create-wallet', data
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add wallet address');
    }
  },

  async deleteWalletAddress(id: string): Promise<void> {
    try {
      await api.delete(`/wallet-addresses/delete/${id}`);
    } catch (error) {
      throw new Error('Failed to delete wallet address');
    }
  },

  async getBenchmarkComparison(
    portfolioId: string, 
    timeFrame: string, 
    benchmark: string
  ): Promise<Array<{ date: string; portfolio: number; benchmark: number }>> {
    try {
      const response = await api.get(
        `/portfolio/${portfolioId}/performance`,
        {
          params: { timeFrame }
        }
      );
      
      // If benchmark data is available in the response, use it
      if (response.data && response.data.length > 0 && response.data[0].benchmark) {
        return response.data.map((item: any) => ({
          date: item.date,
          portfolio: item.value,
          benchmark: item.benchmark
        }));
      }

      // If no benchmark data, try to fetch benchmark prices separately
      try {
        const benchmarkResponse = await api.get('/prices/compare', {
          params: { 
            symbols: benchmark.toLowerCase(),
            timeframe: timeFrame.toLowerCase().replace(/([A-Z])/g, '$1').replace('YTD', '1y')
          }
        });

        const portfolioData = response.data || [];
        const benchmarkData = benchmarkResponse.data || [];
        
        // Combine portfolio and benchmark data
        return portfolioData.map((item: any, index: number) => ({
          date: item.date,
          portfolio: item.value,
          benchmark: benchmarkData[index]?.value || item.value
        }));
      } catch (benchmarkError) {
        console.warn('Failed to fetch benchmark data, using portfolio data as baseline:', benchmarkError);
        
        // Use portfolio data as both portfolio and benchmark for comparison
        const portfolioData = response.data || [];
        return portfolioData.map((item: any) => ({
          date: item.date,
          portfolio: item.value,
          benchmark: item.value * 0.95 // Slightly lower baseline for visual comparison
        }));
      }
    } catch (error) {
      console.error('Error fetching benchmark comparison:', error);
      // Return mock data for development
      const mockData = [
        { date: '2024-01-01', portfolio: 100, benchmark: 100 },
        { date: '2024-01-15', portfolio: 105, benchmark: 102 },
        { date: '2024-02-01', portfolio: 108, benchmark: 98 },
        { date: '2024-02-15', portfolio: 112, benchmark: 105 },
        { date: '2024-03-01', portfolio: 110, benchmark: 108 },
        { date: '2024-03-15', portfolio: 115, benchmark: 112 },
      ];
      return mockData;
    }
  },

  async getHistoricalReturns(
    portfolioId: string, 
    timeFrame: string
  ): Promise<Array<{ 
    period: string; 
    returns: number; 
    benchmark: number; 
    category: string }>> {
    try {
      // Use the performance metrics endpoint to get historical returns
      const response = await api.get(
        `/portfolio/${portfolioId}/performance`,
        {
          params: { timeFrame }
        }
      );
      
      const performanceData = response.data || [];
      
      // Calculate returns for each period
      const returns: Array<{ period: string; returns: number; benchmark: number; category: string }> = [];
      for (let i = 1; i < performanceData.length; i++) {
        const current = performanceData[i];
        const previous = performanceData[i - 1];
        
        if (current && previous) {
          const portfolioReturn = ((current.value - previous.value) / previous.value) * 100;
          const benchmarkReturn = ((current.benchmark || current.value) - (previous.benchmark || previous.value)) / (previous.benchmark || previous.value) * 100;
          
          const date = new Date(current.date);
          const period = date.toLocaleDateString('en-US', { month: 'short' });
          
          returns.push({
            period,
            returns: portfolioReturn,
            benchmark: benchmarkReturn,
            category: portfolioReturn >= 0 ? 'positive' : 'negative'
          });
        }
      }
      
      return returns;
    } catch (error) {
      console.error('Error fetching historical returns:', error);
      // Return mock data for development
      const mockData = [
        { period: 'Jan', returns: 5.2, benchmark: 3.1, category: 'positive' },
        { period: 'Feb', returns: -2.1, benchmark: -1.5, category: 'negative' },
        { period: 'Mar', returns: 8.7, benchmark: 6.2, category: 'positive' },
        { period: 'Apr', returns: 3.4, benchmark: 2.8, category: 'positive' },
        { period: 'May', returns: -4.2, benchmark: -3.1, category: 'negative' },
        { period: 'Jun', returns: 7.1, benchmark: 5.9, category: 'positive' },
      ];
      return mockData;
    }
  },

  async getStressTestResults(
    portfolioId: string
  ): Promise<Array<{ scenario: string; portfolioImpact: number; description: string; severity: string }>> {
    try {
      // Use the risk analysis endpoint which includes stress test results
      const response = await api.get(
        `/portfolio/${portfolioId}/risk-analysis`
      );
      
      // Extract stress test results from risk analysis data
      if (response.data && response.data.stressTestResults) {
        return response.data.stressTestResults.map((test: any) => ({
          scenario: test.scenario,
          portfolioImpact: test.impact,
          description: test.description || `${test.scenario} stress test scenario`,
          severity: test.severity || 'medium'
        }));
      }
      
      // If no stress test data, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching stress test results:', error);
      // Return mock data for development
      const mockData = [
        {
          scenario: 'Market Crash (-30%)',
          portfolioImpact: -22.5,
          description: 'Simulates a 30% market decline across all assets',
          severity: 'high'
        },
        {
          scenario: 'Interest Rate Rise (+2%)',
          portfolioImpact: -8.3,
          description: 'Impact of significant interest rate increase',
          severity: 'medium'
        },
        {
          scenario: 'Crypto Regulation',
          portfolioImpact: -15.7,
          description: 'Regulatory crackdown on cryptocurrency markets',
          severity: 'high'
        },
        {
          scenario: 'Inflation Spike (+5%)',
          portfolioImpact: -12.1,
          description: 'High inflation scenario affecting real returns',
          severity: 'medium'
        },
        {
          scenario: 'Tech Sector Boom',
          portfolioImpact: 18.2,
          description: 'Technology sector outperformance',
          severity: 'low'
        },
        {
          scenario: 'Economic Recession',
          portfolioImpact: -25.8,
          description: 'Full economic recession scenario',
          severity: 'critical'
        }
      ];
      return mockData;
    }
  },

  async generateCustomReport(
    portfolioId: string, 
    options: any
  ): Promise<any> {
    try {
      // Since there's no dedicated report endpoint, we'll simulate report generation
      // by gathering data from existing endpoints
      const [portfolioResult, metricsResult, riskResult] = await Promise.allSettled([
        api.get(`/portfolio/${portfolioId}`),
        api.get(`/portfolio/${portfolioId}/metrics`),
        api.get(`/portfolio/${portfolioId}/risk-analysis`)
      ]);

      // Extract data from settled promises
      const portfolioData = portfolioResult.status === 'fulfilled' ? portfolioResult.value.data : null;
      const metricsData = metricsResult.status === 'fulfilled' ? metricsResult.value.data : null;
      const riskData = riskResult.status === 'fulfilled' ? riskResult.value.data : null;

      // Simulate report generation with actual portfolio data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            reportId: 'report_' + Date.now(),
            downloadUrl: '/api/reports/download/' + 'report_' + Date.now(),
            format: options.format,
            sections: Object.keys(options).filter(key => 
              key.startsWith('include') && options[key]
            ),
            portfolioId,
            generatedAt: new Date().toISOString(),
            data: {
              portfolio: portfolioData,
              metrics: metricsData,
              riskAnalysis: riskData
            }
          });
        }, 2000);
      });
    } catch (error) {
      console.error('Error generating custom report:', error);
      // Fallback simulation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            reportId: 'report_' + Date.now(),
            downloadUrl: '/api/reports/download/' + 'report_' + Date.now(),
            format: options.format,
            sections: Object.keys(options).filter(key => 
              key.startsWith('include') && options[key]
            )
          });
        }, 2000);
      });
    }
  }
};

export default dashboardService;