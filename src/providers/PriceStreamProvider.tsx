import React, { createContext, useEffect, useState } from "react";
import { EventSourcePolyfill } from 'event-source-polyfill';

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

export const PriceStreamContext = createContext<PriceUpdate[]>([]);

export const PriceStreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<PriceUpdate[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("AccessToken")
    const url = new URL(`${import.meta.env.VITE_API_URL}/api/stream/prices`);
    const eventSource = new EventSourcePolyfill(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setPrices(parsed);
      } catch (e) {
        // Optionally handle error
        console.error("Failed to parse SSE data:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
                                                                                                                        
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <PriceStreamContext.Provider value={prices}>
      {children}
    </PriceStreamContext.Provider>
  );
}; 