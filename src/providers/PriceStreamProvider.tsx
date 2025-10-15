import React, { createContext, useEffect, useState, useMemo } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAuth } from "@/hooks/useAuth";

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

const CONNECTION_TIMEOUT_MS = 60000;

export const PriceStreamContext = createContext<PriceUpdate[]>([]);

export const PriceStreamProvider: React.FC<{ children: React.ReactNode }> = (
  { children }
) => {
  // Use a map for efficient lookups and updates
  const [priceMap, setPriceMap] = useState<Map<string, PriceUpdate>>(
    new Map()
  );
  const {isAuthenticated, isLoading} = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      console.log(
        `
        SSE: Waiting for Auth. isLoading: ${isLoading}, 
        isAuthenticated: ${isAuthenticated}
        `
      );
      return; 
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.error("No access token found for SSE connection.");
        return;
    }
    const API_BASE = import.meta.env.VITE_API_URL?.trim() ||
      (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
    const url = `${API_BASE}/api/stream/prices`;

    const eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        heartbeatTimeout: CONNECTION_TIMEOUT_MS,
      }
    );

    if (eventSource) {
      console.log(
        "Initialized EventSource and listening for message events..."
      );
    }

    eventSource.onmessage = (event) => {
      try {
        // Receive a full array of tickers in each message
        const priceUpdates: PriceUpdate[] = JSON.parse(event.data);
        console.log("Price updated from SSE:", priceUpdates.length, "updates");

        // Check if the data is an array
        if (Array.isArray(priceUpdates)) {
          setPriceMap(prevMap => {
            const newMap = new Map(prevMap);
            priceUpdates.forEach(update => {
              // Validate the update structure
              if (update && update.symbol && typeof update.price === 'number') {
                newMap.set(update.symbol, update);
              } else {
                console.warn("Invalid price update structure:", update);
              }
            });
            return newMap;
          });
        } else {
           console.warn("Received non-array data from SSE:", priceUpdates);
        }
      } catch (e) {
        console.error("Failed to parse SSE data:", e, "Raw data:", event.data);
      }
    };

    eventSource.onopen = () => {
      console.log("SSE connection opened successfully");
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      console.error("EventSource readyState:", eventSource.readyState);
      // Don't close on every error, SSE has built-in retry logic.
      // eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, isLoading]);

  // Convert the map to an array for consumers of the context
  const prices = useMemo(() => Array.from(priceMap.values()), [priceMap]);

  return (
    <PriceStreamContext.Provider value={prices}>
      {children}
    </PriceStreamContext.Provider>
  );
};
