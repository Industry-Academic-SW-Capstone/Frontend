"use client";
import React, { useState, useEffect } from "react";
import { Competition } from "@/lib/types/stock";
import {
  TrophyIcon,
  CalendarIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@/components/icons/Icons";
import MissionPanel from "@/components/MissionPanel";
import HomeScreenSkeleton from "@/components/screens/HomeScreenSkeleton";
import { useAccounts } from "@/lib/hooks/useAccounts";
import { useAccountAssets, AccountAssetHolding } from "@/lib/hooks/useAccount";
import { useContests } from "@/lib/hooks/useContest";
import { useMyRanking, useRanking } from "@/lib/hooks/useRanking";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { useFetchInfo } from "@/lib/hooks/me/useInfo";
import { useFavoriteStocks } from "@/lib/hooks/stock/useFavoriteStock";
import { usePendingOrders } from "@/lib/hooks/useOrders";
import { generateLogo } from "@/lib/utils";

const FeaturedCompetition: React.FC<{ competition: Competition }> = ({
  competition,
}) => {
  const totalDays = 31;
  const elapsedDays = 15;
  const progress = (elapsedDays / totalDays) * 100;
  const returnPercent = competition.returnPercent ?? 0;

  return (
    <div className="bg-primary p-6 rounded-2xl text-white space-y-4 cursor-pointer overflow-hidden relative group">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <TrophyIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">
              {competition.contestName}
            </h3>
            <p className="text-xs opacity-80">현재 진행중인 대회</p>
          </div>
        </div>
        <ChevronRightIcon className="w-5 h-5 opacity-70" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm relative z-10 pt-2">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
          <p className="opacity-80 text-xs mb-1">나의 순위</p>
          <p className="font-bold text-2xl">
            {competition.rank}
            <span className="text-sm font-normal opacity-80 ml-1">위</span>
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
          <p className="opacity-80 text-xs mb-1">수익률</p>
          <p className="font-bold text-2xl">
            {returnPercent > 0 ? "+" : ""}
            {Number(returnPercent).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-1">
        <div className="flex justify-between items-center text-xs opacity-90 mb-2">
          <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-full">
            <CalendarIcon className="w-3 h-3" />
            <span>D-{totalDays - elapsedDays}</span>
          </div>
          <span className="font-medium">
            {Number(progress).toFixed(0)}% 진행
          </span>
        </div>
        <div className="w-full bg-black/10 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-white h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const MissionSummary: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-bg-secondary p-5 rounded-2xl cursor-pointer group transition-colors hover:bg-bg-tertiary"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary text-lg">
            오늘의 미션
          </span>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-medium text-text-secondary">
            연속 출석
          </span>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-text-primary">12일째</span>
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-sm text-text-secondary">남은 미션</span>
          <span className="font-semibold text-text-primary">3개</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: "40%" }}
          />
        </div>
      </div>
    </div>
  );
};

const StockLogo: React.FC<{ stock: any }> = ({ stock }) => {
  const [imgSrc, setImgSrc] = useState(generateLogo(stock, false));

  return (
    <img
      src={imgSrc}
      alt={stock.stockName}
      className="w-10 h-10 rounded-full object-cover bg-white"
      onError={() => setImgSrc(generateLogo(stock, true))}
    />
  );
};

import { useCancelOrder } from "@/lib/hooks/useOrders";
import { Screen, Account } from "@/lib/types/stock";

// ... (keep existing imports)

import { useStockStore } from "@/lib/stores/useStockStore";
import SlidingScreen from "@/components/navigation/SlidingScreen";
import StockDetailScreen from "@/components/screens/StockDetailScreen";
import OrderDetailModal from "@/components/OrderDetailModal";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowPathIcon } from "@/components/icons/Icons";

interface HomeScreenProps {
  selectedAccount: Account | null;
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedAccount,
  onNavigate,
}) => {
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStockTicker, setSelectedStockTicker] = useState<string | null>(
    null
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullCurrentY, setPullCurrentY] = useState(0);
  const PULL_THRESHOLD = 80;

  const { setStocksView } = useStockStore();
  const { isLoading } = useAccounts();
  const queryClient = useQueryClient();

  const handleNavigateToPortfolio = () => {
    setStocksView("portfolio");
    onNavigate("stocks");
  };

  const handleNavigateToExplore = () => {
    setStocksView("explore");
    onNavigate("stocks");
  };

  const handleStockClick = (ticker: string) => {
    setSelectedStockTicker(ticker);
  };

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  // Pull to Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh if we are at the top of the page
    // We need to check if the container is scrolled to top.
    // Since HomeScreen is inside a scrollable div in MainSwiper, checking window.scrollY might not be enough if the scroll is on the parent.
    // However, MainSwiper has `overflow-y-auto` on the wrapper div.
    // We might need to check that wrapper's scrollTop.
    // But here we only have access to the component.
    // Let's assume for now the user pulls when the scroll is at 0.
    // We can check `e.currentTarget.scrollTop === 0` if we attach it to the scrolling container, but HomeScreen is a child.
    // Let's try checking if the closest scrollable parent is at 0.
    // For simplicity, let's just use the logic from ProfileScreen, but note that ProfileScreen might be relying on window scroll or body scroll.
    // In MainSwiper, the scroll is on the div wrapping HomeScreen.
    // So `window.scrollY` will always be 0 if the body isn't scrolling.
    // We need to be careful.
    // Let's attach the handlers to the main div of HomeScreen.
    // And we need to know if we are at the top.
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
      // Prevent default only if we are pulling down to refresh?
      // No, we shouldn't prevent default indiscriminately.
      setPullCurrentY(currentY - pullStartY);
    }
  };

  const handleTouchEnd = async () => {
    if (pullCurrentY > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await queryClient.invalidateQueries();
        // Optional: Show toast? ProfileScreen does.
      } catch (error) {
        console.error("Refresh failed", error);
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullCurrentY(0);
  };

  const { data: contests } = useContests();
  const { data: userInfo } = useFetchInfo();
  const { data: assets } = useAccountAssets(selectedAccount?.id);
  const { data: myRanking } = useMyRanking();
  const { data: favoriteStocks } = useFavoriteStocks();
  const { data: pendingOrders } = usePendingOrders();
  const { data: mainRanking } = useRanking("returnRate");
  const { mutate: cancelOrder } = useCancelOrder();

  const selectedCompetition = contests?.find(
    (c) => c.contestId === selectedAccount?.contestId
  );

  const displayCompetition = selectedCompetition
    ? {
        ...selectedCompetition,
        rank: myRanking?.returnRateRank ?? 0,
        returnPercent: myRanking?.myReturnRate ?? 0,
      }
    : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !selectedAccount) {
    return <HomeScreenSkeleton />;
  }

  // Calculate real values from assets
  const totalAssets = assets?.totalAssets ?? selectedAccount.totalValue;
  const totalInvested =
    assets?.holdings.reduce(
      (sum: number, h: AccountAssetHolding) =>
        sum + h.averagePrice * h.quantity,
      0
    ) ?? 0;
  const currentStockValue = assets?.stockValue ?? 0;
  const totalProfit = currentStockValue - totalInvested;
  const returnRate =
    totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const isPositive = totalProfit >= 0;
  const changeString = `${isPositive ? "+" : ""}${Number(
    totalProfit
  ).toLocaleString()}원 (${isPositive ? "+" : ""}${Number(returnRate).toFixed(
    2
  )}%)`;
  const isMainAccount = selectedAccount.type === "regular";

  // Ranking Logic
  const topRankings = mainRanking?.rankings.slice(0, 3) || [];
  const myRankEntry = myRanking
    ? {
        rank: myRanking.returnRateRank,
        nickname: userInfo?.name || "나",
        balance: myRanking.myBalance,
        returnRate: myRanking.myReturnRate,
        memberId: selectedAccount.memberId,
        isMe: true,
      }
    : null;

  const showMyRankingSeparately =
    myRankEntry && !topRankings.some((r) => r.rank === myRankEntry.rank);

  return (
    <>
      <div
        className="space-y-3 pb-24 relative min-h-full"
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

        {/* Greeting Section */}
        <div
          className={`p-6 py-3 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-500 ${
            isMounted ? "animate-fadeInUp opacity-100" : "opacity-0"
          }`}
          onClick={() => onNavigate("profile")}
        >
          <h1 className="text-2xl font-bold text-text-primary">
            안녕하세요, {userInfo?.name || "투자자"}님 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            오늘도 스톡잇과 함께 배워봐요!
          </p>
        </div>

        {/* Total Assets Section */}
        <div
          className={`p-6 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-200 active:bg-border-color active:scale-95 ${
            isMounted ? "animate-fadeInUp opacity-100" : "opacity-0"
          }`}
          onClick={handleNavigateToPortfolio}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-text-secondary text-sm font-medium">총 자산</p>
            <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <p className="text-4xl font-extrabold text-text-primary tracking-tight">
            {Number(totalAssets).toLocaleString()}
            <span className="text-2xl font-bold ml-1">원</span>
          </p>
        </div>

        {/* Featured Competition or Mission */}
        <div
          className={`transition-opacity duration-500 ${
            isMounted ? "animate-fadeInUp opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: "100ms" }}
        >
          {!isMainAccount && displayCompetition ? (
            <div onClick={() => onNavigate("competitions")}>
              <FeaturedCompetition competition={displayCompetition} />
            </div>
          ) : (
            <MissionSummary onClick={() => setIsMissionPanelOpen(true)} />
          )}
        </div>

        {/* Favorites Section */}
        {favoriteStocks && favoriteStocks.length > 0 && (
          <div className="bg-bg-secondary rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">관심 주식</h2>
              <button
                className="text-xs text-text-secondary hover:text-primary transition-colors"
                onClick={handleNavigateToExplore}
              >
                전체보기
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide swiper-no-swiping">
              {favoriteStocks.map((stock) => (
                <div
                  key={stock.stockCode}
                  className="min-w-[140px] flex flex-col gap-3 cursor-pointer group transition-all duration-200 active:scale-95"
                  onClick={() => handleStockClick(stock.stockCode)}
                >
                  <div className="flex items-center gap-3">
                    <StockLogo stock={stock} />
                    <div>
                      <p className="font-bold text-text-primary truncate text-sm">
                        {stock.stockName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {stock.stockCode}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">
                      {Number(stock.currentPrice).toLocaleString()}원
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        Number(stock.changeRate) >= 0
                          ? "text-positive"
                          : "text-negative"
                      }`}
                    >
                      {Number(stock.changeRate) > 0 ? "+" : ""}
                      {Number(stock.changeRate).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Orders Section */}
        {pendingOrders?.orders && pendingOrders.orders.length > 0 && (
          <div className="bg-bg-secondary rounded-2xl p-5">
            <h2 className="text-lg font-bold text-text-primary mb-2">
              대기 중인 주문
            </h2>
            <div className="space-y-4">
              {pendingOrders.orders.slice(0, 3).map((order) => {
                const isMarketOrder =
                  !order.price || order.price <= 0 || isNaN(order.price);
                return (
                  <div
                    key={order.orderId}
                    className="flex justify-between items-center cursor-pointer p-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-bg-tertiary active:bg-border-color active:scale-95"
                    onClick={() => handleOrderClick(order.orderId)}
                  >
                    <div>
                      <p className="font-bold text-text-primary text-sm">
                        {order.stockName}
                      </p>
                      <div className="flex gap-2 text-xs mt-0.5">
                        <span
                          className={`font-medium ${
                            order.orderMethod === "BUY"
                              ? "text-positive"
                              : "text-negative"
                          }`}
                        >
                          {order.orderMethod === "BUY" ? "매수" : "매도"}
                        </span>
                        <span className="text-text-secondary">
                          {Number(order.remainingQuantity).toLocaleString()}주
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-primary text-sm">
                        {isMarketOrder
                          ? "시장가"
                          : `${Number(order.price).toLocaleString()}원`}
                      </p>
                      <button
                        className="text-xs text-text-secondary bg-bg-primary px-2 py-1 rounded-lg mt-1 hover:bg-border-color transition-colors"
                        onClick={() => cancelOrder(order.orderId)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rankings Preview */}
        {mainRanking && mainRanking.rankings && (
          <div className="bg-bg-secondary rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                실시간 랭킹
              </h2>
              <button
                className="text-xs text-text-secondary hover:text-primary transition-colors"
                onClick={() => onNavigate("rankings")}
              >
                더보기
              </button>
            </div>
            <div className="space-y-4">
              {topRankings.map((rank, index) => (
                <div
                  key={rank.memberId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-bold ${
                        index === 0
                          ? "text-yellow-500 text-lg"
                          : index === 1
                          ? "text-gray-400 text-lg"
                          : index === 2
                          ? "text-orange-400 text-lg"
                          : "text-text-secondary"
                      }`}
                    >
                      {rank.rank}
                    </span>
                    <p className="font-bold text-text-primary text-sm">
                      {rank.nickname}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text-primary text-sm">
                      {Number(rank.balance).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}

              {/* My Ranking Separator and Item */}
              {showMyRankingSeparately && myRankEntry && (
                <>
                  <div className="h-px bg-border-color my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-primary text-lg">
                        {myRankEntry.rank}
                      </span>
                      <p className="font-bold text-text-primary text-sm">
                        {myRankEntry.nickname} (나)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-primary text-sm">
                        {Number(myRankEntry.balance).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mission Panel */}
      <MissionPanel
        isOpen={isMissionPanelOpen}
        onClose={() => setIsMissionPanelOpen(false)}
      />

      {/* Stock Detail Sliding Screen */}
      <SlidingScreen
        isOpen={!!selectedStockTicker}
        onClose={() => setSelectedStockTicker(null)}
      >
        {selectedStockTicker && (
          <StockDetailScreen
            ticker={selectedStockTicker}
            onBack={() => setSelectedStockTicker(null)}
          />
        )}
      </SlidingScreen>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </>
  );
};

export default HomeScreen;
