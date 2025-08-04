import { api } from './axios';
import type {
  Watchlist,
  WatchlistMetrics,
  CreateWatchlistDto,
  UpdateWatchlistDto,
  AddAssetDto,
  AvailableCrypto
} from '../types/watchlist';

const watchlistService = {
  async getWatchlists(): Promise<Watchlist[]> {
    try {
      const response = await api.get('/watchlists');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch watchlists');
    }
  },

  async getWatchlistById(watchlistId: string): Promise<Watchlist> {
    try {
      const response = await api.get(`/watchlists/${watchlistId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch watchlist');
    }
  },

  async createWatchlist(data: CreateWatchlistDto): Promise<Watchlist> {
    try {
      const response = await api.post('/watchlists/create', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create watchlist');
    }
  },

  async updateWatchlist(watchlistId: string, data: UpdateWatchlistDto): Promise<Watchlist> {
    try {
      const response = await api.put(`/watchlists/${watchlistId}/update`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update watchlist');
    }
  },

  async deleteWatchlist(watchlistId: string): Promise<void> {
    try {
      await api.delete(`/watchlists/delete/${watchlistId}`);
    } catch (error) {
      throw new Error('Failed to delete watchlist');
    }
  },

  async addAssetToWatchlist(watchlistId: string, data: AddAssetDto): Promise<Watchlist> {
    try {
      const response = await api.post(`/watchlists/${watchlistId}/assets`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add asset to watchlist');
    }
  },

  async removeAssetFromWatchlist(watchlistId: string, assetId: string): Promise<Watchlist> {
    try {
      const response = await api.delete(`/watchlists/${watchlistId}/assets/${assetId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to remove asset from watchlist');
    }
  },

  async getWatchlistMetrics(watchlistId: string): Promise<WatchlistMetrics> {
    try {
      const response = await api.get(`/watchlists/${watchlistId}/metrics`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch watchlist metrics');
    }
  },

  async getAvailableCryptos(): Promise<AvailableCrypto[]> {
    const response = await api.get('/prices/available');
    return response.data;
  },
};

export default watchlistService; 