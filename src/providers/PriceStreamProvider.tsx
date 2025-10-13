import React, { createContext, useEffect, useState, useMemo } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.error("No access token found for SSE connection.");
        return;
    }
    
    const url = '/api/stream/prices';
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
        console.log("Price updated from SSE:", priceUpdates);

        // Check if the data is an array
        if (Array.isArray(priceUpdates)) {
          setPriceMap(prevMap => {
            const newMap = new Map(prevMap);
            priceUpdates.forEach(update => {
              newMap.set(update.symbol, update);
            });
            return newMap;
          });
        } else {
           console.warn("Received non-array data from SSE:", priceUpdates);
        }
      } catch (e) {
        console.error("Failed to parse SSE data:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);                                                                                                                      
      // Don't close on every error, SSE has built-in retry logic.
      // eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Convert the map to an array for consumers of the context
  const prices = useMemo(() => Array.from(priceMap.values()), [priceMap]);

  return (
    <PriceStreamContext.Provider value={prices}>
      {children}
    </PriceStreamContext.Provider>
  );
};
