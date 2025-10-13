import React, { useMemo } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { usePriceStream } from "../../hooks/usePriceStream";

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

  // Filter only selected symbols (if provided)
  const filteredPrices = useMemo(() => {
    if (!symbols?.length) return prices;
    return prices.filter((p) => symbols.includes(p.symbol));
  }, [symbols, prices]);

  if (!filteredPrices.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No live prices available.
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
        // Optional: simulate trend (price up/down)
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
                {p.symbol}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant={compact ? "body2" : "body1"}
                  sx={{ fontWeight: 500 }}
                >
                  {p.price.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
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
