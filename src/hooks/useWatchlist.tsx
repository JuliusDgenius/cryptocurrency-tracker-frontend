import { useState, useEffect, useCallback } from 'react';
import watchlistService from '../api/watchlist';
import type { Watchlist, WatchlistMetrics } from '@/types/watchlist';

export const useWatchlist = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await watchlistService.getWatchlists();
      setWatchlists(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  }, []);

  const createWatchlist = useCallback(async (name: string, description?: string) => {
    try {
      setError(null);
      const newWatchlist = await watchlistService.createWatchlist({ name, description });
      setWatchlists(prev => [newWatchlist, ...prev]);
      return newWatchlist;
    } catch (err: any) {
      setError(err.message || 'Failed to create watchlist');
      throw err;
    }
  }, []);

  const deleteWatchlist = useCallback(async (id: string) => {
    try {
      setError(null);
      await watchlistService.deleteWatchlist(id);
      setWatchlists(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete watchlist');
      throw err;
    }
  }, []);

  const addAssetToWatchlist = useCallback(async (watchlistId: string, symbol: string) => {
    try {
      setError(null);
      const updatedWatchlist = await watchlistService.addAssetToWatchlist(watchlistId, { symbol });
      setWatchlists(prev => prev.map(w => 
        w.id === watchlistId ? updatedWatchlist : w
      ));
      return updatedWatchlist;
    } catch (err: any) {
      setError(err.message || 'Failed to add asset to watchlist');
      throw err;
    }
  }, []);

  const removeAssetFromWatchlist = useCallback(async (watchlistId: string, symbol: string) => {
    try {
      setError(null);
      const updatedWatchlist = await watchlistService.removeAssetFromWatchlist(watchlistId, symbol);
      setWatchlists(prev => prev.map(w => 
        w.id === watchlistId ? updatedWatchlist : w
      ));
      return updatedWatchlist;
    } catch (err: any) {
      setError(err.message || 'Failed to remove asset from watchlist');
      throw err;
    }
  }, []);

  const getWatchlistMetrics = useCallback(async (watchlistId: string): Promise<WatchlistMetrics> => {
    try {
      return await watchlistService.getWatchlistMetrics(watchlistId);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch watchlist metrics');
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  return {
    watchlists,
    loading,
    error,
    createWatchlist,
    deleteWatchlist,
    addAssetToWatchlist,
    removeAssetFromWatchlist,
    getWatchlistMetrics,
    fetchWatchlists,
    clearError
  };
}; 