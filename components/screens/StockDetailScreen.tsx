"use client";
import React, { useState } from "react";
import { MOCK_STOCK_DETAILS, MOCK_ACCOUNTS } from "@/lib/constants";
import { StockDetail } from "@/lib/types/types";
import StockChart from "@/components/StockChart";
import OrderModal from "@/components/OrderModal";
import { ArrowLeftIcon } from "@/components/icons/Icons";

interface StockDetailScreenProps {
  ticker: string;
  onBack: () => void;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-3 border-b border-border-color">
    <span className="text-text-secondary">{label}</span>
    <span className="font-semibold text-text-primary">{value}</span>
  </div>
);

const StockDetailScreen: React.FC<StockDetailScreenProps> = ({
  ticker,
  onBack,
}) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  const stock = MOCK_STOCK_DETAILS[ticker];
  const account = MOCK_ACCOUNTS[0];

  const handleOpenOrderModal = (type: "buy" | "sell") => {
    setOrderType(type);
    setIsOrderModalOpen(true);
  };

  if (!stock) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <p>종목 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const isPositive = stock.todayChangePercent >= 0;
  const changeString = `${
    isPositive ? "+" : ""
  }${stock.todayChange.toLocaleString()}원 (${
    isPositive ? "+" : ""
  }${stock.todayChangePercent.toFixed(2)}%)`;

  return (
    <>
      <div className="h-full flex flex-col">
        <header className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-sm p-4 flex items-center gap-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={stock.logo}
              alt={stock.stock_name}
              className="w-8 h-8 rounded-full bg-white object-cover"
            />
            <h1 className="text-xl font-bold text-text-primary">
              {stock.stock_name}
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="pt-4 pb-8">
            <p className="text-4xl font-bold text-text-primary">
              {stock.current_price.toLocaleString()}원
            </p>
            <p
              className={`text-lg font-semibold ${
                isPositive ? "text-positive" : "text-negative"
              }`}
            >
              {changeString}
            </p>
          </div>

          <StockChart data={stock.chartData} isPositive={isPositive} />

          <div className="mt-8">
            <InfoRow
              label="시가총액"
              value={` ${(stock.marketCap / 1000000000000).toFixed(2)}조원`}
            />
            <InfoRow
              label="주가수익비율(PER)"
              value={stock.peRatio.toFixed(2)}
            />
            <InfoRow label="보유 수량" value={`${stock.shares}주`} />
          </div>

          <div className="mt-8 p-4 bg-bg-secondary rounded-2xl border border-border-color">
            <h3 className="font-bold text-lg mb-2">기업 정보</h3>
            <p className="text-text-secondary text-sm">{stock.description}</p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto p-4 bg-bg-primary border-t border-border-color">
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenOrderModal("sell")}
              className="w-full py-3 bg-negative text-white font-bold rounded-lg"
            >
              매도
            </button>
            <button
              onClick={() => handleOpenOrderModal("buy")}
              className="w-full py-3 bg-positive text-white font-bold rounded-lg"
            >
              매수
            </button>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        stock={stock}
        orderType={orderType}
        cashBalance={account.cashBalance}
      />
    </>
  );
};

export default StockDetailScreen;
