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
    subscribeOrderBook(stockCode);
    return () => {
      unsubscribeOrderBook(stockCode);
    };
  }, [stockCode, subscribeOrderBook, unsubscribeOrderBook]);

  if (!orderBook) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-bg-primary animate-pulse">
        {/* Asks Skeleton */}
        <div className="flex flex-col-reverse">
          {[...Array(10)].map((_, i) => (
            <div
              key={`ask-skeleton-${i}`}
              className="flex h-12 border-b border-border-color relative bg-bg-third"
            >
              <div className="flex w-full z-10 items-center px-4">
                <div className="flex-1 text-right">
                  <div className="h-4 bg-bg-secondary rounded w-20 ml-auto" />
                </div>
                <div className="flex-1 text-right">
                  <div className="h-4 bg-bg-secondary rounded w-12 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Skeleton */}
        <div className="py-2 text-center border-y border-border-color bg-bg-primary">
          <div className="h-6 bg-bg-secondary rounded w-32 mx-auto" />
        </div>

        {/* Bids Skeleton */}
        <div className="flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div
              key={`bid-skeleton-${i}`}
              className="flex h-12 border-b border-border-color relative bg-bg-secondary"
            >
              <div className="flex w-full z-10 items-center px-4">
                <div className="flex-1 text-left">
                  <div className="h-4 bg-bg-secondary rounded w-12" />
                </div>
                <div className="flex-1 text-left">
                  <div className="h-4 bg-bg-secondary rounded w-20" />
                </div>
              </div>
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

  const renderRow = (
    level: OrderBookLevel,
    type: "ask" | "bid",
    isBest: boolean = false
  ) => {
    const barWidth = `${(level.quantity / maxQuantity) * 100}%`;
    const bgColor = type === "ask" ? "bg-blue-100" : "bg-red-100"; // Toss style: Ask=Blue, Bid=Red (Wait, Korea is opposite usually? No, Toss follows global or Korea? Korea: Red=Rise/Bid? No.
    // Standard Korea: Red = Rise, Blue = Fall.
    // Order Book:
    // Ask (Sell) -> Blue background usually (associated with price going down/selling pressure? or just distinct).
    // Bid (Buy) -> Red background usually (associated with price going up/buying pressure).
    // Let's check the user's HTML.
    // HTML: Ask-row: #ffebee (Red-ish), Bid-row: #e3f2fd (Blue-ish).
    // HTML Price-ask: #d32f2f (Red), Price-bid: #1976d2 (Blue).
    // Wait, the HTML says: Ask-row (Sell) is Red-ish, Bid-row (Buy) is Blue-ish.
    // But usually in Korea: Red is UP (Buy/Bid support), Blue is DOWN (Sell/Ask resistance).
    // Let's follow the HTML sample provided by the user to be safe.
    // HTML: Ask -> #ffebee (Red tint), Bid -> #e3f2fd (Blue tint).
    // This is slightly confusing vs standard Korean stocks where Red = Rise.
    // But I will follow the HTML styles: Ask = Red tint, Bid = Blue tint.

    const rowBg = type === "ask" ? "bg-[#ffebee]" : "bg-[#e3f2fd]";
    const barColor = type === "ask" ? "bg-[#ffcdd2]" : "bg-[#bbdefb]";
    const priceColor = type === "ask" ? "text-[#d32f2f]" : "text-[#1976d2]";

    return (
      <div
        key={`${type}-${level.price}`}
        className={`flex h-12 border-b border-border-color cursor-pointer relative ${rowBg}`}
        onClick={() =>
          onPriceClick(level.price, type === "ask" ? "buy" : "sell")
        } // Clicking Ask means I want to Buy. Clicking Bid means I want to Sell.
      >
        {/* Quantity Bar Background */}
        <div
          className={`absolute top-0 ${
            type === "ask" ? "right-0" : "left-0"
          } h-full ${barColor} opacity-50`}
          style={{ width: barWidth }}
        />

        {/* Content */}
        <div className="flex w-full z-10 items-center px-4">
          {type === "ask" ? (
            <>
              <div className={`flex-1 text-right font-bold ${priceColor}`}>
                {level.price.toLocaleString()}
              </div>
              <div className="flex-1 text-right text-text-primary">
                {level.quantity.toLocaleString()}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 text-left text-text-primary">
                {level.quantity.toLocaleString()}
              </div>
              <div className={`flex-1 text-left font-bold ${priceColor}`}>
                {level.price.toLocaleString()}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Sort Asks descending (highest price on top? No, usually lowest ask is closest to center).
  // Order Book Layout:
  // Asks (Sell Orders) - High Price
  // ...
  // Asks (Sell Orders) - Low Price (Best Ask)
  // -----------------------------
  // Bids (Buy Orders) - High Price (Best Bid)
  // ...
  // Bids (Buy Orders) - Low Price

  const asks = [...(orderBook.ask_levels || [])].sort(
    (a, b) => b.price - a.price
  );
  const bids = [...(orderBook.bid_levels || [])].sort(
    (a, b) => b.price - a.price
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-primary">
      {/* Asks */}
      <div className="flex flex-col-reverse">
        {asks.map((level) => renderRow(level, "ask"))}
      </div>

      {/* Summary / Current Price Indicator could go here */}
      <div className="py-2 text-center font-bold text-lg border-y border-border-color bg-bg-primary">
        {orderBook.expected_price?.toLocaleString() || "-"}
      </div>

      {/* Bids */}
      <div className="flex flex-col">
        {bids.map((level) => renderRow(level, "bid"))}
      </div>
    </div>
  );
};

export default OrderBook;
