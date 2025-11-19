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

const OrderDetailModal: React.FC<{
  orderId: number | null;
  onClose: () => void;
}> = ({ orderId, onClose }) => {
  const { data: order, isLoading } = useOrderDetail(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (!orderId) return null;

  const handleCancel = () => {
    if (confirm("주문을 취소하시겠습니까?")) {
      cancelOrder(orderId, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          alert("주문 취소에 실패했습니다.");
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-bg-primary w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6 relative shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 sm:hidden" />

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-text-primary">주문 상세</h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-text-secondary hover:bg-bg-secondary rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border-color">
              <img
                src={generateLogo({
                  stockCode: order.stockCode,
                  marketType: "KOSPI", // Defaulting as type info might be missing in detail
                })}
                alt=""
                className="w-14 h-14 rounded-full bg-gray-50 object-cover"
              />
              <div>
                <h4 className="text-xl font-bold text-text-primary">
                  {order.stockCode}
                </h4>
                <p className="text-text-secondary text-sm">{order.stockCode}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-1">
                <span className="text-text-secondary">주문 유형</span>
                <span
                  className={`font-bold ${
                    order.orderMethod === "BUY"
                      ? "text-positive"
                      : "text-negative"
                  }`}
                >
                  {order.orderMethod === "BUY" ? "매수" : "매도"} /{" "}
                  {order.orderType === "MARKET" ? "시장가" : "지정가"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-text-secondary">주문 가격</span>
                <span className="font-bold text-text-primary">
                  {order.price > 0
                    ? `${order.price.toLocaleString()}원`
                    : "시장가"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-text-secondary">주문 수량</span>
                <span className="font-bold text-text-primary">
                  {order.quantity}주
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-text-secondary">미체결</span>
                <span className="font-bold text-text-primary">
                  {order.remainingQuantity}주
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-text-secondary">주문 시간</span>
                <span className="font-medium text-text-primary text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full py-4 rounded-2xl bg-bg-secondary text-negative font-bold text-lg hover:bg-negative/10 transition-colors disabled:opacity-50"
              >
                {isCancelling ? "취소 중..." : "주문 취소하기"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            주문 정보를 불러올 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectStock,
  onNavigateToExplore,
}) => {
  const accountId = 1;
  const { data: assets, isLoading: isAssetsLoading } =
    useAccountAssets(accountId);
  const { data: pendingOrdersData } = usePendingOrders(accountId);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(true);

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
    <div className="space-y-8 pb-10">
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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
        <button
          onClick={() => setIsChartOpen(!isChartOpen)}
          className="w-full flex justify-between items-center group"
        >
          <h3 className="text-lg font-bold text-text-primary">
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
          <div className="text-center py-12 bg-gray-50 rounded-3xl">
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
