import React, { useMemo } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { usePriceStream } from "../../hooks/usePriceStream";
import { PriceUpdate } from "@/providers/PriceStreamProvider";

interface LivePriceTickerProps {
  symbols?: string[]; // e.g. ['BTC', 'ETH']
  compact?: boolean;  // whether to use a minimal design
}

/**
 * Displays live price updates for selected crypto symbols.
 * Pulls from the global PriceStreamProvider.
 */
const LivePriceTicker: React.FC<LivePriceTickerProps> = ({
  symbols,
  compact = false,
}) => {
  const prices = usePriceStream();
  console.log("Prices received in LivePriceTicker", prices)

  // Filter only selected symbols (if provided)
  const filteredPrices = useMemo(() => {
    if (!symbols?.length) return prices;

    // Map each requested symbol to its corresponding price object from the stream
    return symbols.map((symbol) => {
      const usdtPair = `${symbol}USDT`;
      const usdcPair = `${symbol}USDC`;

      // Find the best match, prioritizing USDT as it's most common
      return prices.find(p => p.symbol === usdtPair) || 
      prices.find(p => p.symbol === usdcPair) ||
      prices.find(p => p.symbol.startsWith(symbol));
    })
    .filter((p): p is PriceUpdate => p !== undefined); // Filter out any symbols that weren't found
  }, [symbols, prices]);

  if (!filteredPrices.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        Connecting to live price feed...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {filteredPrices.map((p) => {
        const trend = Math.random() > 0.5 ? "up" : "down";

        return (
          <Card
            key={p.symbol}
            sx={{
              flex: compact ? "0 1 auto" : "1 1 200px",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              minWidth: compact ? 120 : 180,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: compact ? 1 : 2,
              }}
            >
              <Typography
                variant={compact ? "body2" : "subtitle1"}
                sx={{ fontWeight: 600 }}
              >
                {p.symbol.replace(/USDT|USDC/, '')}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant={compact ? "body2" : "body1"}
                  sx={{ fontWeight: 500 }}
                >
                  {p.price.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: p.price > 1 ? 2 : 6,
                  })}
                </Typography>

                {trend === "up" ? (
                  <ArrowDropUpIcon color="success" />
                ) : (
                  <ArrowDropDownIcon color="error" />
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default LivePriceTicker;
