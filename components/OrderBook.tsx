import React, { useEffect } from "react";
import { useOrderBookStore } from "@/lib/stores/useOrderBookStore";
import { useWebSocket } from "@/lib/providers/SocketProvider";
import { OrderBookLevel } from "@/lib/types/stock";

interface OrderBookProps {
  stockCode: string;
  onPriceClick: (price: number, type: "buy" | "sell") => void;
}

const OrderBook: React.FC<OrderBookProps> = ({ stockCode, onPriceClick }) => {
  const { orderBook } = useOrderBookStore();
  const { subscribeOrderBook, unsubscribeOrderBook } = useWebSocket();

  useEffect(() => {
    console.log(orderBook);
  }, [orderBook]);

  useEffect(() => {
    subscribeOrderBook(stockCode);
    return () => {
      unsubscribeOrderBook(stockCode);
    };
  }, [stockCode, subscribeOrderBook, unsubscribeOrderBook]);

  if (!orderBook) {
    return (
      <div className="flex flex-col h-full bg-bg-primary animate-pulse">
        {/* Asks Skeleton */}
        <div className="flex flex-col-reverse">
          {[...Array(10)].map((_, i) => (
            <div
              key={`ask-skeleton-${i}`}
              className="grid grid-cols-3 h-10 border-b border-border-color bg-bg-primary"
            >
              <div className="col-span-1" />
              <div className="col-span-1 flex items-center justify-center bg-blue-50/50 dark:bg-blue-900/10">
                <div className="h-4 w-16 bg-blue-100 dark:bg-blue-800 rounded" />
              </div>
              <div className="col-span-1 flex items-center justify-end px-2">
                <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Bids Skeleton */}
        <div className="flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div
              key={`bid-skeleton-${i}`}
              className="grid grid-cols-3 h-10 border-b border-border-color bg-bg-primary"
            >
              <div className="col-span-1 flex items-center justify-start px-2">
                <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
              <div className="col-span-1 flex items-center justify-center bg-red-50/50 dark:bg-red-900/10">
                <div className="h-4 w-16 bg-red-100 dark:bg-red-800 rounded" />
              </div>
              <div className="col-span-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxQuantity = Math.max(
    ...(orderBook.ask_levels?.map((l) => l.quantity) || []),
    ...(orderBook.bid_levels?.map((l) => l.quantity) || [])
  );

  // Sort Asks: Price Descending (Highest -> Lowest)
  // The lowest ask is the "Best Ask", which should be at the bottom of the Asks list (closest to center).
  // So we render Asks in normal order (if they come sorted Ascending, we reverse? No, usually API returns Best Ask first).
  // Let's assume API returns levels. We want to display:
  // Top: High Price
  // Bottom: Low Price

  const asks = orderBook.ask_levels?.reverse() || [];

  const bids = orderBook.bid_levels || [];

  const renderAskRow = (level: OrderBookLevel) => {
    const barWidth = `${(level.quantity / maxQuantity) * 100}%`;

    return (
      <div
        key={`ask-${level.price}`}
        className="grid grid-cols-3 h-11 border-b border-border-color cursor-pointer bg-bg-primary hover:brightness-95 transition-all"
        onClick={() => onPriceClick(level.price, "buy")}
      >
        {/* Left: Empty (or could show diff) */}
        <div className="col-span-1 border-r border-border-color/50" />

        {/* Center: Price */}
        <div className="col-span-1 flex items-center justify-center bg-blue-50/30 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold relative">
          {level.price.toLocaleString()}
        </div>

        {/* Right: Volume */}
        <div className="col-span-1 relative flex items-center justify-end px-2">
          <div
            className="absolute top-1 bottom-1 right-0 bg-blue-100 dark:bg-blue-500/20 transition-all duration-300"
            style={{ width: barWidth }}
          />
          <span className="relative z-10 text-xs text-text-primary font-medium">
            {level.quantity.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const renderBidRow = (level: OrderBookLevel) => {
    const barWidth = `${(level.quantity / maxQuantity) * 100}%`;

    return (
      <div
        key={`bid-${level.price}`}
        className="grid grid-cols-3 h-11 border-b border-border-color cursor-pointer bg-bg-primary hover:brightness-95 transition-all"
        onClick={() => onPriceClick(level.price, "sell")}
      >
        {/* Left: Volume */}
        <div className="col-span-1 relative flex items-center justify-start px-2">
          <div
            className="absolute top-1 bottom-1 left-0 bg-red-100 dark:bg-red-500/20 transition-all duration-300"
            style={{ width: barWidth }}
          />
          <span className="relative z-10 text-xs text-text-primary font-medium">
            {level.quantity.toLocaleString()}
          </span>
        </div>

        {/* Center: Price */}
        <div className="col-span-1 flex items-center justify-center bg-red-50/30 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold border-x border-border-color/50">
          {level.price.toLocaleString()}
        </div>

        {/* Right: Empty */}
        <div className="col-span-1" />
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full bg-bg-primary select-none">
      {/* Asks List */}
      <div className="flex flex-col w-full">
        {asks.map((level) => renderAskRow(level))}
      </div>

      {/* Bids List */}
      <div className="flex flex-col w-full">
        {bids.map((level) => renderBidRow(level))}
      </div>
    </div>
  );
};

export default OrderBook;
