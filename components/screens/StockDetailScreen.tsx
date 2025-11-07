"use client";
import React, { useEffect, useState } from "react";
import { MOCK_STOCK_DETAILS, MOCK_ACCOUNTS } from "@/lib/constants";
import { StockDetailMockType } from "@/lib/types/types";
import StockChart from "@/components/StockChart";
import OrderModal from "@/components/OrderModal";
import { ArrowLeftIcon } from "@/components/icons/Icons";
import { useStockDetail } from "@/lib/hooks/stock/useStockDetail";
import { generateLogo } from "@/lib/utils";
import { useStockChart } from "@/lib/hooks/stock/useStockChart";

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
  const [chartStartPrice, setChartStartPrice] = useState<number | null>(null);
  const [chartChangedRate, setChartChangedRate] = useState<number | null>(null);
  const [chartChangedAmount, setChartChangedAmount] = useState<number | null>(
    null
  );
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [changeString, setChangeString] = useState<string>("");

  const {
    data: stock,
    isLoading: isStockLoading,
    refetch: refetchStockDetail,
  } = useStockDetail(ticker);

  const account = MOCK_ACCOUNTS[0];

  const handleOpenOrderModal = (type: "buy" | "sell") => {
    setOrderType(type);
    setIsOrderModalOpen(true);
  };

  useEffect(() => {
    if (chartStartPrice === null && stock) {
      setChartChangedAmount(stock.changeAmount);
      setChartChangedRate(stock.changeRate);
      setIsPositive(stock.changeAmount >= 0);
      setChangeString(
        `${
          stock.changeAmount >= 0 ? "+" : ""
        }${stock.changeAmount.toLocaleString()}원 (${
          stock.changeRate >= 0 ? "+" : ""
        }${stock.changeRate}%)`
      );
    } else if (chartStartPrice !== null && stock) {
      const changedAmount = stock.currentPrice - chartStartPrice;
      const changedRate = (changedAmount / chartStartPrice) * 100;

      setChartChangedAmount(changedAmount);
      setChartChangedRate(changedRate);
      setIsPositive(changedAmount >= 0);
      setChangeString(
        `${changedAmount >= 0 ? "+" : ""}${changedAmount.toLocaleString()}원 (${
          changedAmount >= 0 ? "+" : ""
        }${changedRate.toFixed(2)}%)`
      );
    }
  }, [chartStartPrice, stock]);

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

  return (
    <>
      <div className="h-full flex flex-col">
        <header className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-sm p-4 flex items-center gap-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={generateLogo(stock)}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = generateLogo(stock, true);
              }}
              alt={stock.stockName}
              className="w-8 h-8 rounded-full bg-white object-cover"
            />
            <h1 className="text-xl font-bold text-text-primary">
              {stock.stockName}
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="pt-4 pb-8">
            <p className="text-4xl font-bold text-text-primary">
              {stock.currentPrice.toLocaleString()}원
            </p>
            <p
              className={`text-lg font-semibold ${
                isPositive ? "text-positive" : "text-negative"
              }`}
            >
              {changeString}
            </p>
          </div>

          <StockChart
            setChartStartPrice={setChartStartPrice}
            stockCode={stock.stockCode}
            isPositive={isPositive}
          />
          <div className="mt-8">
            {(() => {
              const formatMarketCap = (v: number) => {
                if (v >= 1e10) {
                  return `${(v / 1e10).toFixed(2).replace(/\.00$/, "")}조`;
                }
                if (v >= 1e6) {
                  return `${(v / 1e6).toFixed(2).replace(/\.00$/, "")}억`;
                }
                if (v >= 1e5) {
                  return `${(v / 1e5).toFixed(2).replace(/\.00$/, "")}천만`;
                }
                return `${v.toLocaleString()}원`;
              };

              return (
                <>
                  <InfoRow
                    label="시가총액"
                    value={formatMarketCap(stock.marketCap)}
                  />
                  <InfoRow label="주가수익비율(PER)" value={stock.per} />
                </>
              );
            })()}
          </div>

          <div className="mt-8 p-4 bg-bg-secondary rounded-2xl border border-border-color">
            <h3 className="font-bold text-lg mb-2">기업 정보</h3>
            <p className="text-text-secondary text-sm">
              {
                // stock.description
                "설명이 들어갑니다"
              }
            </p>
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
