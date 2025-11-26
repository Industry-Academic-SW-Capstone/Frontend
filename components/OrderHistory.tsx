import React, { useState } from "react";
import { useStockHistory } from "@/lib/hooks/stocks/useStockHistory";
import { StockOrderHistory } from "@/lib/types/stock";
import { FaQuestion } from "react-icons/fa6";
import WateringCalculator from "./WateringCalculator";

interface OrderHistoryProps {
  stockCode: string;
  accountId: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  stockCode,
  accountId,
}) => {
  const { data, isLoading } = useStockHistory(accountId, stockCode);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

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
        <div className="w-16 h-16 bg-bg-third text-text-secondary rounded-full flex items-center justify-center mb-4">
          <FaQuestion size={32} />
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
      {/* Holdings Section */}
      {data?.holding && data.holding.quantity > 0 && (
        <div className="px-4 py-4 mb-2">
          <div className="mb-6">
            <p className="text-text-secondary text-sm mb-1">1주 평균금액</p>
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-3xl font-bold text-text-primary">
                {data.holding.averagePricePerShare.toLocaleString()}원
              </h1>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="bg-bg-third active-transition text-text-primary px-3 py-2 rounded-lg text-sm font-medium"
              >
                물타기 계산기
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-2 border-b border-border-color pb-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">보유 수량</span>
              <span className="text-text-primary font-medium text-lg">
                {data.holding.quantity}주
              </span>
            </div>

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1">
                <span className="text-text-secondary">총 금액</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-text-primary font-medium text-lg">
                  {data.holding.totalValue.toLocaleString()}원
                </span>
                <span
                  className={`text-sm font-medium ${
                    data.holding.profitRate >= 0
                      ? "text-[#ea4f4f]"
                      : "text-[#335eea]"
                  }`}
                >
                  {data.holding.profitLoss > 0 ? "+" : ""}
                  {data.holding.profitLoss.toLocaleString()} (
                  {data.holding.profitRate.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-secondary">투자 원금</span>
              <span className="text-text-primary font-medium text-lg">
                {data.holding.investmentPrincipal.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      )}

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
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-text-primary font-medium">
                          {order.executionPrice
                            ? "주당 " +
                              Number(order.executionPrice).toLocaleString() +
                              "원"
                            : order.orderPrice
                            ? Number(order.orderPrice).toLocaleString() + "원"
                            : "시장가"}
                        </span>
                        <span
                          className={`text-text-secondary text-xs mt-0.5 ${
                            order.status === "CANCELLED" ? "line-through" : ""
                          }`}
                        >
                          {order.status === "FILLED"
                            ? "체결완료"
                            : order.status === "PENDING"
                            ? "체결 대기"
                            : order.status === "CANCELLED"
                            ? "취소됨"
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

      {data && data.holding && (
        <WateringCalculator
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          currentPrice={data.currentPrice}
          averagePrice={data.holding.averagePricePerShare}
          currentQuantity={data.holding.quantity}
          stockName={data.stockName}
        />
      )}
    </div>
  );
};

export default OrderHistory;
