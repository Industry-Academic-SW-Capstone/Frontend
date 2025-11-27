"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import StockChart from "@/components/StockChart";
import OrderModal from "@/components/OrderModal";
import { ArrowLeftIcon, HeartIcon } from "@/components/icons/Icons";
import { useStockDetail } from "@/lib/hooks/stocks/useStockDetail";
import {
  useFavoriteStocks,
  useAddFavorite,
  useDeleteFavorite,
} from "@/lib/hooks/stocks/useFavoriteStock";
import { useFetchInfo, usePutInfo } from "@/lib/hooks/me/useInfo";
import { useAccountAssets } from "@/lib/hooks/useAccount";
import Toast, { ToastType } from "@/components/ui/Toast";
import OrderBook from "@/components/OrderBook";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { SlidingTabs } from "../ui/SlidingTabs";
import { useStockAnalyze } from "@/lib/hooks/stocks/useStockAnalyze";
import { useCompanyDescribe } from "@/lib/hooks/stocks/useCompanyDescribe";
import { ChevronDownIcon, Sparkles } from "lucide-react";
import { useTutorialStore } from "@/lib/store/useTutorialStore";
import StockDetailTutorialOverlay from "../tutorial/StockDetailTutorialOverlay";
import OrderHistory from "@/components/OrderHistory";
import { motion } from "framer-motion";
import { useWebSocket } from "@/lib/providers/SocketProvider";
import { useChartStore } from "@/lib/stores/useChartStore";
import { PeriodType } from "@/lib/types/stock";
import { useStockChart } from "@/lib/hooks/stocks/useStockChart";

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
  const { mutate: updateInfo } = usePutInfo();
  const { data: userInfo } = useFetchInfo();
  const { startStockDetailTutorial } = useTutorialStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(false);
    setTimeout(() => {
      setIsMounted(true);
    }, 300);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isPriceVisible, setIsPriceVisible] = useState(true);

  const handleTutorialComplete = () => {
    updateInfo({ stockDetailTutorialCompleted: true });
  };

  // Trigger tutorial on mount
  useEffect(() => {
    if (userInfo && !userInfo.stockDetailTutorialCompleted) {
      const timer = setTimeout(() => {
        startStockDetailTutorial();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userInfo, startStockDetailTutorial]);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [chartStartPrice, setChartStartPrice] = useState<number | null>(null);
  const [chartChangedRate, setChartChangedRate] = useState<number | null>(null);
  const [chartChangedAmount, setChartChangedAmount] = useState<number | null>(
    null
  );
  const [isDetailInfoOpen, setIsDetailInfoOpen] = useState<boolean>(false);
  const [isCompanyDescOpen, setIsCompanyDescOpen] = useState<boolean>(true);
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [changeString, setChangeString] = useState<string>("");
  const [simpleChangeString, setSimpleChangeString] = useState<string>("");
  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [activeTab, setActiveTab] = useState<
    "chart" | "orderbook" | "my_stock"
  >("chart");

  const showToast = (message: string, type: ToastType = "success") => {
    setToastState({ isVisible: true, message, type });
  };

  const {
    data: stock,
    isLoading: isStockLoading,
    refetch: refetchStockDetail,
  } = useStockDetail(ticker);

  const { data: stockAnalyze } = useStockAnalyze(ticker);
  const { data: companyDesc, isLoading: isCompanyDescLoading } =
    useCompanyDescribe(stock?.stockName || "");

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

  const { data: accountAssets } = useAccountAssets(selectedAccount?.id);
  const cashBalance = accountAssets?.cash || 0;
  const ownedStock = accountAssets?.holdings.find(
    (h) => h.stockCode === ticker
  );
  const ownedQuantity = ownedStock?.quantity || 0;

  const handleOpenOrderModal = (type: "buy" | "sell", price?: number) => {
    setOrderType(type);
    setIsOrderModalOpen(true);
  };

  const [selectedOrderType, setSelectedOrderType] = useState<
    "market" | "limit"
  >("market");
  const [limitPrice, setLimitPrice] = useState("");

  const handleOrderBookPriceClick = (price: number, type: "buy" | "sell") => {
    if (price) {
      setSelectedOrderType("limit");
      setLimitPrice(price.toString());
    } else setSelectedOrderType("market");

    handleOpenOrderModal(type, price); // Open order modal
  };

  // --- Data Fetching & Stores ---
  const { setSubscribeSet } = useWebSocket();
  const {
    chartDatas: realTimeChartDatas,
    setPeriodType,
    initializeChartData,
  } = useChartStore();
  const [period, setPeriod] = useState<PeriodType>("1day");

  useEffect(() => {
    if (stock?.stockCode) setSubscribeSet([stock.stockCode]);
    return () => {
      setSubscribeSet([]);
    };
  }, [stock, setSubscribeSet]);

  const { data: chartDatas } = useStockChart(stock?.stockCode || "", period);
  useEffect(() => {
    if (chartDatas && chartDatas.length > 0) {
      initializeChartData(chartDatas);
    }
  }, [chartDatas, initializeChartData]);

  // --- Data Merging ---
  const mergedChartDatas = useMemo(() => {
    let historical = chartDatas || [];
    let merged = historical;
    if (realTimeChartDatas.length > 0) {
      merged =
        historical.length > 0
          ? [...historical.slice(0, -1), ...realTimeChartDatas]
          : realTimeChartDatas;
    }
    return merged;
  }, [chartDatas, realTimeChartDatas]);

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
      setSimpleChangeString(
        `${stock.changeRate >= 0 ? "+" : ""}${stock.changeRate}%`
      );
    } else if (chartStartPrice !== null && stock) {
      const currentPrice =
        mergedChartDatas[mergedChartDatas.length - 1]?.closePrice ||
        stock.currentPrice;
      const changedAmount = currentPrice - chartStartPrice;
      const changedRate = (changedAmount / chartStartPrice) * 100;

      setChartChangedAmount(changedAmount);
      setChartChangedRate(changedRate);
      setIsPositive(changedAmount >= 0);
      setChangeString(
        `${changedAmount >= 0 ? "+" : ""}${changedAmount.toLocaleString()}원 (${
          changedAmount >= 0 ? "+" : ""
        }${changedRate.toFixed(2)}%)`
      );
      setSimpleChangeString(
        `${changedRate >= 0 ? "+" : ""}${changedRate.toFixed(2)}%`
      );
    }
  }, [chartStartPrice, stock, mergedChartDatas]);

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

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-24">
            <div className="pt-4 pb-8">
              <div className="h-10 w-48 bg-bg-secondary rounded animate-pulse mb-2" />
              <div className="h-6 w-36 bg-bg-secondary rounded animate-pulse" />
            </div>

            {/* StockChart 스켈레톤 */}
            <StockChart
              stockCode=""
              isPositive={true}
              period={period}
              setPeriod={setPeriod}
              setPeriodType={setPeriodType}
              mergedChartDatas={mergedChartDatas}
              setChartStartPrice={setChartStartPrice}
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
        <header className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-sm p-4 pb-2 flex items-center justify-between border-b border-transparent transition-colors duration-200">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={onBack} className="p-1">
              <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
            </button>

            {/* Sticky Header Info */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: !isPriceVisible ? 1 : 0,
                y: !isPriceVisible ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm text-text-secondary font-medium">
                {stock.stockName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-text-primary">
                  {mergedChartDatas[mergedChartDatas.length - 1]?.closePrice
                    ? mergedChartDatas[
                        mergedChartDatas.length - 1
                      ].closePrice.toLocaleString()
                    : stock.currentPrice.toLocaleString()}
                  원
                </span>
                <span
                  className={`text-xs font-medium ${
                    isPositive ? "text-positive" : "text-negative"
                  }`}
                >
                  {simpleChangeString}
                </span>
              </div>
            </motion.div>
          </div>

          <button
            id="stock-favorite-button"
            onClick={handleToggleFavorite}
            className="p-2 rounded-full active-transition transition-colors"
          >
            {isFavorite ? (
              <HeartIcon className="w-6 h-6 text-red-500 fill-current" />
            ) : (
              <HeartIcon className="w-6 h-6 text-text-tertiary" />
            )}
          </button>
        </header>

        <motion.div
          ref={scrollRef}
          className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden"
        >
          <div className="px-4 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary">
                {stock.stockName}
              </h1>
            </div>
            <motion.p
              onViewportEnter={() => setIsPriceVisible(true)}
              onViewportLeave={() => setIsPriceVisible(false)}
              viewport={{ margin: "-60px 0px 0px 0px" }}
              className="text-4xl font-bold text-text-primary"
            >
              {mergedChartDatas[mergedChartDatas.length - 1]?.closePrice
                ? mergedChartDatas[
                    mergedChartDatas.length - 1
                  ].closePrice.toLocaleString()
                : stock.currentPrice.toLocaleString()}
              원
            </motion.p>
            <p
              className={`text-md font-semibold ${
                isPositive ? "text-positive" : "text-negative"
              }`}
            >
              {changeString}
            </p>
          </div>

          {/* Tab Navigation */}
          <div ref={tabsRef}>
            <SlidingTabs
              tabs={[
                { id: "chart", label: "차트", elementId: "stock-tab-chart" },
                {
                  id: "orderbook",
                  label: "호가",
                  elementId: "stock-tab-orderbook",
                },
                {
                  id: "my_stock",
                  label: "내 주식",
                  elementId: "stock-tab-mystock",
                },
              ]}
              activeTab={activeTab}
              onTabChange={(id) => {
                setActiveTab(id as "chart" | "orderbook" | "my_stock");
                const now = new Date();
                const isMarketOpen = now.getHours() >= 9 && now.getHours() < 15;
                if (id === "orderbook" && !isMarketOpen) {
                  showToast("호가는 내일 9시부터 다시 볼 수 있어요!");
                }

                // Scroll to tabs if not chart
                if (id !== "chart" && tabsRef.current && scrollRef.current) {
                  const headerHeight = 60;
                  const tabsTop = tabsRef.current.offsetTop;

                  scrollRef.current.scrollTo({
                    top: tabsTop - headerHeight,
                    behavior: "smooth",
                  });
                }
              }}
              isBlack
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 relative bg-bg-secondary min-h-[500px]">
            {activeTab === "chart" ? (
              <div className="px-4 pb-24 mt-8">
                <StockChart
                  stockCode={stock.stockCode}
                  isPositive={isPositive}
                  period={period}
                  setPeriod={setPeriod}
                  setPeriodType={setPeriodType}
                  mergedChartDatas={mergedChartDatas}
                  setChartStartPrice={setChartStartPrice}
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

                <div className="mt-8">
                  <div
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => setIsCompanyDescOpen(!isCompanyDescOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-text-primary">
                        기업 개요
                      </h3>
                      {isCompanyDescLoading && (
                        <div className="flex items-center gap-1 text-xs text-blue-500 animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          <span>AI가 개요를 작성중이에요...</span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`p-1 rounded-full bg-bg-secondary text-text-secondary transition-transform duration-300 ${
                        isCompanyDescOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isCompanyDescOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {isCompanyDescLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-border-color rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-border-color rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-border-color rounded animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-text-secondary text-base leading-relaxed">
                        {companyDesc?.description ||
                          "기업 설명을 불러올 수 없습니다."}
                      </p>
                    )}
                  </div>
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
            ) : activeTab === "orderbook" ? (
              <div className="h-full">
                <OrderBook
                  stockCode={stock.stockCode}
                  onPriceClick={handleOrderBookPriceClick}
                />
              </div>
            ) : (
              <div className="h-full bg-bg-primary">
                <OrderHistory
                  stockCode={stock.stockCode}
                  accountId={selectedAccount?.id.toString() || ""}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Buttons - Only visible in Chart tab */}
        {activeTab === "chart" && (
          <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto p-4 bg-bg-primary border-t border-border-color">
            <div className="flex gap-3">
              <button
                id="stock-buy-button"
                onClick={() => handleOpenOrderModal("buy")}
                className="w-full py-3 bg-positive active:scale-95 transition-transform duration-200 text-white font-bold rounded-xl"
              >
                구매하기
              </button>
              <button
                id="stock-sell-button"
                onClick={() => handleOpenOrderModal("sell")}
                className="w-full py-3 bg-negative active:scale-95 transition-transform duration-200 text-white font-bold rounded-xl"
              >
                판매하기
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
        setSelectedOrderType={setSelectedOrderType}
        selectedOrderType={selectedOrderType}
        setLimitPrice={setLimitPrice}
        limitPrice={limitPrice}
      />
      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={() => setToastState((prev) => ({ ...prev, isVisible: false }))}
      />
      <StockDetailTutorialOverlay onComplete={handleTutorialComplete} />
    </>
  );
};

export default StockDetailScreen;
