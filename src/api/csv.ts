import { api } from './axios';

export interface CsvImportResponse {
  message: string;
  success: number;
  errors: string[];
}

export interface CsvExportOptions {
  startDate?: string;
  endDate?: string;
  includeAssets?: boolean;
  includeTransactions?: boolean;
}

const csvService = {
  /**
   * Import transactions from CSV file
   */
  async importTransactions(portfolioId: string, file: File): Promise<CsvImportResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/csv/import/${portfolioId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Export portfolio data to CSV
   */
  async exportPortfolio(portfolioId: string, options: CsvExportOptions = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.includeAssets !== undefined) params.append('includeAssets', options.includeAssets.toString());
    if (options.includeTransactions !== undefined) params.append('includeTransactions', options.includeTransactions.toString());

    const response = await api.get(`/csv/export/portfolio/${portfolioId}?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },

  /**
   * Export transactions to CSV
   */
  async exportTransactions(portfolioId: string, startDate?: string, endDate?: string): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/csv/export/transactions/${portfolioId}?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },

  /**
   * Download CSV template
   */
  async downloadTemplate(): Promise<Blob> {
    const response = await api.get('/csv/template', {
      responseType: 'blob',
    });

    return response.data;
  },
};

export default csvService; 