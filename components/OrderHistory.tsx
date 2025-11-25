import React from "react";
import { useStockHistory } from "@/lib/hooks/stocks/useStockHistory";
import { StockOrderHistory } from "@/lib/types/stock";

interface OrderHistoryProps {
  stockCode: string;
  accountId: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  stockCode,
  accountId,
}) => {
  const { data, isLoading } = useStockHistory(accountId, stockCode);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse flex justify-between items-center"
          >
            <div className="space-y-2">
              <div className="h-4 w-12 bg-bg-third rounded" />
              <div className="h-5 w-24 bg-bg-third rounded" />
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <div className="h-4 w-20 bg-bg-third rounded" />
              <div className="h-4 w-16 bg-bg-third rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || !data.orderHistory || data.orderHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-bg-third rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">
          거래 내역이 없어요
        </h3>
        <p className="text-text-secondary text-sm">
          이 종목을 거래한 기록이 없습니다.
        </p>
      </div>
    );
  }

  // Group by year
  const groupedHistory = data.orderHistory.reduce((acc, order) => {
    const year = new Date(order.createdAt).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(order);
    return acc;
  }, {} as Record<number, StockOrderHistory[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedHistory)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="pb-24 px-2 pt-2">
      {/* Summary Section - Optional, based on screenshot "보유 수량", "총 금액" etc could go here but might be redundant if already shown in "My Stock" tab header or similar. 
          For now, we just list the history as requested. 
      */}

      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-text-primary mb-4">주문 내역</h2>

        {sortedYears.map((year) => (
          <div key={year} className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              {year}년
            </h3>
            <div className="space-y-6">
              {groupedHistory[year]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((order) => {
                  const date = new Date(order.createdAt);
                  const dateStr = `${date.getMonth() + 1}.${date.getDate()}`;
                  return (
                    <div
                      key={order.orderId}
                      className="flex justify-between items-start"
                    >
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-text-secondary text-sm font-medium mb-0.5">
                            {dateStr}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-base font-bold mb-0.5 ${
                              order.orderMethod === "BUY"
                                ? "text-[#ea4f4f]" // Red for Buy
                                : "text-[#335eea]" // Blue for Sell
                            }`}
                          >
                            {order.orderMethod === "BUY" ? "구매" : "판매"}{" "}
                            {order.executedQuantity
                              ? order.executedQuantity
                              : order.quantity}
                            주
                          </span>
                          {order.status === "PENDING" && (
                            <span className="text-xs text-text-secondary bg-bg-third px-1.5 py-0.5 rounded w-fit">
                              체결 대기
                            </span>
                          )}
                          {order.status === "CANCELLED" && (
                            <span className="text-xs text-text-secondary line-through">
                              취소됨
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-text-primary font-medium">
                          주당{" "}
                          {order.executionPrice
                            ? order.executionPrice
                            : order.orderPrice}
                          원
                        </span>
                        <span className="text-text-secondary text-xs mt-0.5">
                          {order.status === "COMPLETED"
                            ? "체결완료"
                            : "주문접수"}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="text-center py-8 text-text-secondary text-sm">
          모든 주문 내역을 불러왔어요
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
