import React, { createContext, useEffect, useState } from "react";

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

export const PriceStreamContext = createContext<PriceUpdate[]>([]);

export const PriceStreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<PriceUpdate[]>([]);

  useEffect(() => {
    const url = new URL('http://localhost:3000/api/stream/prices');
    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setPrices(parsed);
      } catch (e) {
        // Optionally handle error
      }
    };

    eventSource.onerror = () => {
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