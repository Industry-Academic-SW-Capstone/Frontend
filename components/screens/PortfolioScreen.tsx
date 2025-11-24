"use client";
import React, { useState } from "react";
import { AccountAssetHolding } from "@/lib/types/stock";
import {
  ClockIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@/components/icons/Icons";
import PortfolioDonutChart from "@/components/PortfolioDonutChart";
import { generateLogo } from "@/lib/utils";
import { useAccountAssets } from "@/lib/hooks/useAccount";
import { usePendingOrders, PendingOrder } from "@/lib/hooks/useOrders";
import OrderDetailModal from "@/components/OrderDetailModal";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowPathIcon } from "@/components/icons/Icons";
import { useAccountStore } from "@/lib/store/useAccountStore";
import CountUp from "react-countup";

interface PortfolioScreenProps {
  onSelectStock: (ticker: string) => void;
  onNavigateToExplore: () => void;
  isActive: boolean;
}

const StockRow: React.FC<{
  holding: AccountAssetHolding;
  onClick: () => void;
}> = ({ holding, onClick }) => {
  const investedValue = holding.quantity * holding.averagePrice;
  const todayChange = holding.totalValue - investedValue;
  const todayChangePercent = (todayChange / investedValue) * 100;
  const isTodayPositive = todayChange > 0;

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
            {holding.quantity}주 보유
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-text-primary text-lg">
          {holding.totalValue.toLocaleString()}원
        </p>
        <div className="flex items-center justify-end gap-1 text-sm font-medium mt-0.5">
          <span className={isTodayPositive ? "text-positive" : "text-negative"}>
            {isTodayPositive ? "+" : ""}
            {todayChangePercent.toFixed(1)}%
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
  isActive,
}) => {
  const { selectedAccount } = useAccountStore();

  const {
    data: assets,
    isFetching: isAssetsLoading,
    refetch,
  } = useAccountAssets(selectedAccount?.id);
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
        refetch();
      } catch (error) {
        console.error("Refresh failed", error);
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullCurrentY(0);
  };

  const pendingOrders = pendingOrdersData?.orders || [];
  const totalAssets = assets?.totalAssets || 0;
  const totalInvested = assets?.stockValue || 0;
  // Mocking total return for now as it's not in the API response explicitly in the same way
  const totalReturn = totalAssets - (assets?.cash || 0) - totalInvested;
  const totalReturnRate =
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  return (
    <div
      className="space-y-2 pb-10 relative min-h-full"
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
      <div className="px-6 -mx-4 bg-bg-secondary pt-4 pb-4 space-y-0">
        <div>
          <h2 className="text-text-secondary font-medium text-lg">총 자산</h2>
          <div
            className={`text-4xl font-extrabold text-text-primary transition-all duration-500 ease-in-out origin-left
            ${
              isAssetsLoading
                ? "opacity-80 scale-[0.98]"
                : "opacity-100 scale-100"
            }`}
          >
            <CountUp
              start={Number(assets?.totalAssets)} // 첫 렌더링 시 시작 숫자
              end={Number(assets?.totalAssets)} // 목표 숫자 (이 값이 바뀌면 애니메이션 실행)
              duration={0.5} // 애니메이션 지속 시간 (초)
              separator="," // 천 단위 구분자
              preserveValue={true} // 업데이트 시 0부터 다시 세지 않고 현재 값에서 이어서 카운팅
            />
            <span className="text-2xl font-bold ml-1">원</span>
          </div>
          <div
            className={`flex items-center text-sm font-medium ${
              Number(assets?.totalProfit) >= 0
                ? "text-positive"
                : "text-negative"
            }`}
          >
            {Number(assets?.totalProfit) >= 0 ? "+" : ""}
            <CountUp
              start={Number(assets?.totalProfit)}
              end={Number(assets?.totalProfit)}
              duration={0.5}
              separator=","
              preserveValue={true}
            />
            원{Number(assets?.totalProfit) >= 0 ? " (+" : " ("}
            <CountUp
              start={Number(assets?.returnRate)}
              end={Number(assets?.returnRate)}
              duration={0.5}
              separator=","
              preserveValue={true}
            />
            {"%)"}
          </div>
        </div>
        {/* Chart Section */}
        <div className="pt-6 transition-all duration-300">
          <button
            onClick={() => setIsChartOpen(!isChartOpen)}
            className="w-full flex justify-between items-center group"
          >
            <h3 className="text-xl font-bold text-text-primary">
              포트폴리오 구성
            </h3>
            <div
              className={`p-1 rounded-full bg-bg-secondary text-text-secondary group-active:bg-bg-primary transition-colors ${
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
            <PortfolioDonutChart
              holdings={assets?.holdings || []}
              cash={assets?.cash || 0}
            />
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="px-6 -mx-4 pt-4 pb-2 bg-bg-secondary space-y-2">
        <h3 className="text-xl font-bold text-text-primary mb-4">보유 주식</h3>
        {assets?.holdings && assets?.holdings.length > 0 ? (
          <div className="space-y-1">
            {assets?.holdings.map((holding) => (
              <StockRow
                key={holding.stockCode}
                holding={holding}
                onClick={() => onSelectStock(holding.stockCode)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-3 rounded-3xl">
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
        <div className="space-y-3 pt-4 px-6 pb-6 -mx-4 bg-bg-secondary">
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
