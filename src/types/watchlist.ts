export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  items: WatchlistAsset[];
  createdAt: string;
  updatedAt: string;
  assetIds: string[];
  alertIds: string[];
}

export interface WatchlistAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  addedAt: string;
}

export interface WatchlistMetrics {
  totalAssets: number;
  topPerformers: WatchlistAsset[];
  recentlyAdded: WatchlistAsset[];
  alerts: number;
}

export interface CreateWatchlistDto {
  name: string;
  description?: string;
}

export interface UpdateWatchlistDto {
  name?: string;
  description?: string;
}

export interface AddAssetDto {
  symbol: string;
  notes?: string;
} 

export interface AvailableCrypto {
  symbol: string;
  name: string;
  currentPrice: number;
}