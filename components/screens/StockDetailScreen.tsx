"use client";
import React, { useEffect, useState } from "react";
import StockChart from "@/components/StockChart";
import OrderModal from "@/components/OrderModal";
import { ArrowLeftIcon, HeartIcon } from "@/components/icons/Icons";
import { useStockDetail } from "@/lib/hooks/stock/useStockDetail";
import {
  useFavoriteStocks,
  useAddFavorite,
  useDeleteFavorite,
} from "@/lib/hooks/stock/useFavoriteStock";
import { useAccountAssets } from "@/lib/hooks/useAccount";
import Toast, { ToastType } from "@/components/ui/Toast";
import OrderBook from "@/components/OrderBook";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { SlidingTabs } from "../ui/SlidingTabs";
import { useStockAnalyze } from "@/lib/hooks/stock/useStockAnalyze";
import { ChevronDownIcon } from "lucide-react";

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
  const { selectedAccount, setSelectedAccount, accounts } = useAccountStore();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [chartStartPrice, setChartStartPrice] = useState<number | null>(null);
  const [chartChangedRate, setChartChangedRate] = useState<number | null>(null);
  const [chartChangedAmount, setChartChangedAmount] = useState<number | null>(
    null
  );
  const [isDetailInfoOpen, setIsDetailInfoOpen] = useState<boolean>(false);
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [changeString, setChangeString] = useState<string>("");
  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [activeTab, setActiveTab] = useState<"chart" | "orderbook">("chart");

  const showToast = (message: string, type: ToastType = "success") => {
    setToastState({ isVisible: true, message, type });
  };

  const {
    data: stock,
    isLoading: isStockLoading,
    refetch: refetchStockDetail,
  } = useStockDetail(ticker);

  const { data: stockAnalyze } = useStockAnalyze(ticker);

  const { data: favoriteStocks } = useFavoriteStocks();
  const addFavoriteMutation = useAddFavorite();
  const deleteFavoriteMutation = useDeleteFavorite();

  const isFavorite =
    favoriteStocks?.some((fav) => fav.stockCode === ticker) ?? false;

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      deleteFavoriteMutation.mutate(ticker, {
        onSuccess: () => {
          showToast("관심 종목에서 삭제되었습니다.", "success");
        },
        onError: () => {
          showToast("관심 종목 삭제에 실패했습니다.", "error");
        },
      });
    } else {
      addFavoriteMutation.mutate(ticker, {
        onSuccess: () => {
          showToast("관심 종목에 추가되었습니다.", "success");
        },
        onError: () => {
          showToast("관심 종목 추가에 실패했습니다.", "error");
        },
      });
    }
  };

  const { data: accountAssets } = useAccountAssets(selectedAccount?.id); // Assuming accountId 1 for now
  const cashBalance = accountAssets?.cash || 0;
  const ownedStock = accountAssets?.holdings.find(
    (h) => h.stockCode === ticker
  );
  const ownedQuantity = ownedStock?.quantity || 0;

  const handleOpenOrderModal = (type: "buy" | "sell", price?: number) => {
    setOrderType(type);
    // If price is provided, we might want to set it in the modal state (not implemented in modal yet, but prepared)
    setIsOrderModalOpen(true);
  };

  const handleOrderBookPriceClick = (price: number, type: "buy" | "sell") => {
    handleOpenOrderModal(type, price); // Open order modal
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

  // 스켈레톤 UI
  if (isStockLoading || !stock) {
    return (
      <>
        <div className="h-full flex flex-col">
          <header className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-sm p-4 flex items-center gap-4">
            <button onClick={onBack} className="p-1">
              <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-bg-secondary animate-pulse" />
              <div className="h-6 w-24 bg-bg-secondary rounded animate-pulse" />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 pb-24">
            <div className="pt-4 pb-8">
              <div className="h-10 w-48 bg-bg-secondary rounded animate-pulse mb-2" />
              <div className="h-6 w-36 bg-bg-secondary rounded animate-pulse" />
            </div>

            {/* StockChart 스켈레톤 */}
            <StockChart
              setChartStartPrice={setChartStartPrice}
              stockCode=""
              isPositive={true}
            />

            <div className="mt-8">
              <div className="flex justify-between items-center py-3 border-b border-border-color">
                <div className="h-5 w-20 bg-bg-secondary rounded animate-pulse" />
                <div className="h-5 w-24 bg-bg-secondary rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border-color">
                <div className="h-5 w-32 bg-bg-secondary rounded animate-pulse" />
                <div className="h-5 w-16 bg-bg-secondary rounded animate-pulse" />
              </div>
            </div>

            <div className="mt-8 p-4 bg-bg-secondary rounded-2xl border border-border-color">
              <div className="h-6 w-24 bg-bg-secondary rounded animate-pulse mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-bg-secondary rounded animate-pulse" />
                <div className="h-4 w-full bg-bg-secondary rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-bg-secondary rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto p-4 bg-bg-primary border-t border-border-color">
            <div className="flex gap-3">
              <div className="w-full h-12 bg-bg-secondary rounded-lg animate-pulse" />
              <div className="w-full h-12 bg-bg-secondary rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </>
    );
  }

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
      <div className="h-full flex flex-col bg-bg-primary">
        <header className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-sm p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1">
              <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
            </button>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="p-2 rounded-full hover:bg-bg-secondary transition-colors"
          >
            {isFavorite ? (
              <HeartIcon className="w-6 h-6 text-red-500 fill-current" />
            ) : (
              <HeartIcon className="w-6 h-6 text-text-tertiary" />
            )}
          </button>
        </header>

        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          <div className="px-4 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary">
                {stock.stockName}
              </h1>
            </div>
            <p className="text-4xl font-bold text-text-primary">
              {stock.currentPrice.toLocaleString()}원
            </p>
            <p
              className={`text-md font-semibold ${
                isPositive ? "text-positive" : "text-negative"
              }`}
            >
              {changeString}
            </p>
          </div>

          {/* Tab Navigation */}
          <SlidingTabs
            tabs={[
              { id: "chart", label: "차트" },
              { id: "orderbook", label: "호가" },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as "chart" | "orderbook")}
            isBlack
          />

          {/* Content Area */}
          <div className="flex-1 relative bg-bg-secondary">
            {activeTab === "chart" ? (
              <div className="px-4 pb-24 mt-8">
                <StockChart
                  setChartStartPrice={setChartStartPrice}
                  stockCode={stock.stockCode}
                  isPositive={isPositive}
                />
                <div className="mt-8">
                  {(() => {
                    const formatMarketCap = (v: number) => {
                      if (v >= 1e8) {
                        return `${(v / 1e8)
                          .toFixed(2)
                          .replace(/\.00$/, "")}경원`;
                      }
                      if (v >= 1e4) {
                        return `${(v / 1e4)
                          .toFixed(2)
                          .replace(/\.00$/, "")}조원`;
                      }
                      return `${v.toLocaleString()}억원`;
                    };

                    return (
                      <>
                        <div
                          className="flex justify-between items-center py-3 border-b border-t border-border-color"
                          onClick={() => setIsDetailInfoOpen(!isDetailInfoOpen)}
                        >
                          <span className="text-text-primary font-semibold">
                            주가 지표 보기
                          </span>
                          <div
                            className={`p-1 rounded-full bg-bg-secondary text-text-secondary group-active:bg-bg-primary transition-colors ${
                              isDetailInfoOpen ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDownIcon className="w-5 h-5" />
                          </div>
                        </div>
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isDetailInfoOpen ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <InfoRow
                            label="시가총액"
                            value={formatMarketCap(stock.marketCap)}
                          />

                          <InfoRow
                            label="주가수익비율(PER)"
                            value={stock.per}
                          />
                          <InfoRow label="주당순이익 (EPS)" value={stock.eps} />
                          <InfoRow
                            label="주가순자산비율 (PBR)"
                            value={stock.pbr}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="mt-4 p-4 bg-bg-secondary rounded-2xl border border-border-color">
                  <p className="text-text-primary font-semibold">
                    기업 타입:{" "}
                    {stockAnalyze?.finalStyleTag.replaceAll(/\[|\]/g, "")}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {stockAnalyze?.styleDescription}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <OrderBook
                  stockCode={stock.stockCode}
                  onPriceClick={handleOrderBookPriceClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons - Only visible in Chart tab */}
        {activeTab === "chart" && (
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
        )}
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        stock={stock}
        orderType={orderType}
        cashBalance={cashBalance}
        ownedQuantity={ownedQuantity}
        accountId={1}
      />
      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={() => setToastState((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
};

export default StockDetailScreen;
