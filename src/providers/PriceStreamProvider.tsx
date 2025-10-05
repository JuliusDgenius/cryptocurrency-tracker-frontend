import React, { createContext, useEffect, useState } from "react";

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

export const PriceStreamContext = createContext<PriceUpdate[]>([]);

export const PriceStreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<PriceUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/stream/api/prices`);
    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = (event) => {
      setError(null);
      try {
        const parsed = JSON.parse(event.data);
        setPrices(parsed);
      } catch (e) {
        // Optionally handle error
        console.error("Failed to parse SSE data:", e);
        setError("Received invalid data from server.");
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      setError("Connection lost. Retrying...");

      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <PriceStreamContext.Provider value={prices}>
      {children}
      {error && <div className="text-red-500 text-sm p-2">{error}</div>}
    </PriceStreamContext.Provider>
  );
}; 