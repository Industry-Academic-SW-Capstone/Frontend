"use client";
import React, { useState } from "react";
import { StockHolding } from "@/lib/types/stock";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/icons/Icons";
import PortfolioDonutChart from "@/components/PortfolioDonutChart";
import { generateLogo } from "@/lib/utils";
import { useAccountAssets, AccountAssetHolding } from "@/lib/hooks/useAccount";
import {
  usePendingOrders,
  useOrderDetail,
  useCancelOrder,
  PendingOrder,
} from "@/lib/hooks/useOrders";
import { Drawer } from "vaul";
import OrderDetailModal from "@/components/OrderDetailModal";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowPathIcon } from "@/components/icons/Icons";

interface PortfolioScreenProps {
  onSelectStock: (ticker: string) => void;
  onNavigateToExplore: () => void;
}

const StockRow: React.FC<{ holding: StockHolding; onClick: () => void }> = ({
  holding,
  onClick,
}) => {
  const totalValue = holding.shares * holding.currentPrice;
  const isTodayPositive = holding.todayChangePercent >= 0;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 px-2 hover:bg-gray-50 transition-colors rounded-2xl group"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={generateLogo(holding)}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = generateLogo(holding, true);
            }}
            alt={`${holding.stockName} logo`}
            className="w-12 h-12 rounded-full bg-white object-cover border border-gray-100 shadow-sm"
          />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-bold text-text-primary text-lg leading-tight">
            {holding.stockName}
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            {holding.shares}주 보유
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-text-primary text-lg">
          {totalValue.toLocaleString()}원
        </p>
        <div className="flex items-center justify-end gap-1 text-sm font-medium mt-0.5">
          <span className={isTodayPositive ? "text-positive" : "text-negative"}>
            {isTodayPositive ? "+" : ""}
            {holding.todayChangePercent.toFixed(1)}%
          </span>
          <span className="text-text-tertiary text-xs">오늘</span>
        </div>
      </div>
    </button>
  );
};

const PendingOrderRow: React.FC<{
  order: PendingOrder;
  onClick: () => void;
}> = ({ order, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg-secondary/50 hover:bg-bg-secondary transition-colors border border-transparent hover:border-border-color"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary">
          <ClockIcon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-bold text-text-primary">{order.stockName}</p>
          <p className="text-sm text-text-secondary">
            <span
              className={
                order.orderMethod === "BUY" ? "text-positive" : "text-negative"
              }
            >
              {order.orderMethod === "BUY" ? "매수" : "매도"}
            </span>{" "}
            대기중 · {order.remainingQuantity}주
          </p>
        </div>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-text-tertiary" />
    </button>
  );
};

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectStock,
  onNavigateToExplore,
}) => {
  const accountId = 1;
  const { data: assets, isLoading: isAssetsLoading } =
    useAccountAssets(accountId);
  const { data: pendingOrdersData } = usePendingOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullCurrentY, setPullCurrentY] = useState(0);
  const PULL_THRESHOLD = 80;
  const queryClient = useQueryClient();

  // Pull to Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollContainer = e.currentTarget.closest(".overflow-y-auto");
    if (scrollContainer && scrollContainer.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    } else if (!scrollContainer && window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    if (pullStartY > 0 && currentY > pullStartY) {
      setPullCurrentY(currentY - pullStartY);
    }
  };

  const handleTouchEnd = async () => {
    if (pullCurrentY > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await queryClient.invalidateQueries();
      } catch (error) {
        console.error("Refresh failed", error);
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullCurrentY(0);
  };

  if (isAssetsLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const holdings: StockHolding[] =
    assets?.holdings.map((h: AccountAssetHolding) => ({
      stockCode: h.stockCode,
      stockName: h.stockName,
      marketType: h.marketType as "KOSPI" | "KOSDAQ",
      shares: h.quantity,
      currentPrice: h.currentPrice,
      avgPrice: h.averagePrice,
      todayChangePercent: 0,
    })) || [];

  const pendingOrders = pendingOrdersData?.orders || [];
  const totalAssets = assets?.totalAssets || 0;
  const totalInvested = assets?.stockValue || 0;
  // Mocking total return for now as it's not in the API response explicitly in the same way
  const totalReturn = totalAssets - (assets?.cash || 0) - totalInvested;
  const totalReturnRate =
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  return (
    <div
      className="space-y-6 pb-10 relative min-h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 w-full flex justify-center pointer-events-none transition-all duration-300 ease-out z-10"
        style={{
          transform: `translateY(${
            pullCurrentY > 0 ? Math.min(pullCurrentY / 2, 60) : 0
          }px)`,
          opacity:
            pullCurrentY > 0 ? Math.min(pullCurrentY / PULL_THRESHOLD, 1) : 0,
        }}
      >
        <div
          className={`p-2 rounded-full bg-bg-secondary shadow-md border border-border-color flex items-center justify-center ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <ArrowPathIcon
            className={`w-6 h-6 text-primary ${
              pullCurrentY > PULL_THRESHOLD
                ? "rotate-180 transition-transform duration-300"
                : ""
            }`}
          />
        </div>
      </div>
      {/* Header Section */}
      <div className="px-2 pt-4 space-y-1">
        <h2 className="text-text-secondary font-medium text-lg">총 자산</h2>
        <div className="flex items-baseline gap-2">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            {totalAssets.toLocaleString()}원
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-sm font-bold px-2 py-1 rounded-lg ${
              totalReturn >= 0
                ? "bg-positive/10 text-positive"
                : "bg-negative/10 text-negative"
            }`}
          >
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn.toLocaleString()}원 ({totalReturnRate.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-2 transition-all duration-300">
        <button
          onClick={() => setIsChartOpen(!isChartOpen)}
          className="w-full flex justify-between items-center group"
        >
          <h3 className="text-xl font-bold text-text-primary">
            포트폴리오 구성
          </h3>
          <div
            className={`p-1 rounded-full bg-gray-50 text-text-secondary group-hover:bg-gray-100 transition-colors ${
              isChartOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isChartOpen
              ? "max-h-[500px] opacity-100 mt-6"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <PortfolioDonutChart holdings={holdings} cash={assets?.cash || 0} />
        </div>
      </div>

      {/* Holdings Section */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-text-primary px-2 mb-4">
          보유 주식
        </h3>
        {holdings.length > 0 ? (
          <div className="space-y-1">
            {holdings.map((holding) => (
              <StockRow
                key={holding.stockCode}
                holding={holding}
                onClick={() => onSelectStock(holding.stockCode)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-3 bg-gray-50 rounded-3xl">
            <p className="text-text-secondary mb-4">보유한 주식이 없어요</p>
            <button
              onClick={onNavigateToExplore}
              className="text-primary font-bold text-sm bg-primary/10 px-6 py-3 rounded-xl hover:bg-primary/20 transition-colors"
            >
              주식 둘러보기
            </button>
          </div>
        )}
      </div>

      {/* Pending Orders Section */}
      {pendingOrders.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xl font-bold text-text-primary px-2">
            주문 내역
          </h3>
          <div className="space-y-2">
            {pendingOrders.map((order) => (
              <PendingOrderRow
                key={order.orderId}
                order={order}
                onClick={() => setSelectedOrderId(order.orderId)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default PortfolioScreen;
