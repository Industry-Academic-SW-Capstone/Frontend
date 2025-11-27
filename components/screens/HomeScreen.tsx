"use client";
import React, { useState, useEffect } from "react";
import { Competition } from "@/lib/types/stock";
import {
  TrophyIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "@/components/icons/Icons";
import MissionPanel from "@/components/MissionPanel";
import HomeScreenSkeleton from "@/components/screens/HomeScreenSkeleton";
import { useAccounts } from "@/lib/hooks/useAccounts";
import { useAccountAssets } from "@/lib/hooks/useAccount";
import { useContests } from "@/lib/hooks/useContest";
import { useMyRanking, useRanking } from "@/lib/hooks/useRanking";
import { useFetchInfo } from "@/lib/hooks/me/useInfo";
import { useFavoriteStocks } from "@/lib/hooks/stocks/useFavoriteStock";
import { usePendingOrders } from "@/lib/hooks/useOrders";
import { generateLogo } from "@/lib/utils";
import CountUp from "react-countup";
import { useMissionDashboard } from "@/lib/hooks/missions/useMissionDashboard";
import { MissionDashboard } from "@/lib/types/mission";

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

const MissionSummary: React.FC<{
  onClick: () => void;
  data?: MissionDashboard;
}> = ({ onClick, data }) => {
  return (
    <div
      id="mission-card"
      onClick={onClick}
      className="bg-bg-secondary p-5 pb-3 pt-3 rounded-2xl cursor-pointer group transition-colors active-transition"
    >
      <div className="flex justify-between items-center mb-2">
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
            <span className="font-semibold text-text-primary">
              {data?.consecutiveAttendanceDays ?? 0}일째
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-sm text-text-secondary">남은 미션</span>
          <span className="font-semibold text-text-primary">
            {data?.remainingDailyMissions ?? 0}개
          </span>
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
  const [visibleStage, setVisibleStage] = useState("hello");
  const [helloVisible, setHelloVisible] = useState(false);
  const [eventVisible, setEventVisible] = useState(false);
  const [advertiseVisible, setAdvertiseVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHelloVisible(true);
    }, 300);
  }, []);

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
      // Prevent default only if we are pulling down to refresh?
      // No, we shouldn't prevent default indiscriminately.
      setPullCurrentY(currentY - pullStartY);
    }
  };

  const handleTouchEnd = async () => {
    if (pullCurrentY > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        refetchUserInfo();
        refetchAssets();
        refetchMyRanking();
        refetchFavoriteStocks();
        refetchPendingOrders();
        refetchMainRanking();
        refetchContests();
        refetchMissionDashboard();
        switch (visibleStage) {
          case "hello":
            setHelloVisible(false);
            setTimeout(() => {
              setVisibleStage("event");
              setEventVisible(true);
            }, 800);
            break;
          case "event":
            setEventVisible(false);
            setTimeout(() => {
              setVisibleStage("advertise");
              setAdvertiseVisible(true);
            }, 800);
            break;
          case "advertise":
            setAdvertiseVisible(false);
            setTimeout(() => {
              setVisibleStage("hello");
            }, 800);
            break;
        }
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

  const {
    data: contests,
    isFetching: contestsLoading,
    refetch: refetchContests,
  } = useContests();
  const {
    data: userInfo,
    isFetching: userInfoLoading,
    refetch: refetchUserInfo,
  } = useFetchInfo();
  const {
    data: assets,
    isFetching: assetsLoading,
    refetch: refetchAssets,
  } = useAccountAssets(selectedAccount?.id);
  const {
    data: myRanking,
    isFetching: myRankingLoading,
    refetch: refetchMyRanking,
  } = useMyRanking();
  const {
    data: favoriteStocks,
    isFetching: favoriteStocksLoading,
    refetch: refetchFavoriteStocks,
  } = useFavoriteStocks();
  const {
    data: pendingOrders,
    isFetching: pendingOrdersLoading,
    refetch: refetchPendingOrders,
  } = usePendingOrders();
  const {
    data: mainRanking,
    isFetching: mainRankingLoading,
    refetch: refetchMainRanking,
  } = useRanking("returnRate");
  const { mutate: cancelOrder } = useCancelOrder();
  const { data: missionDashboard, refetch: refetchMissionDashboard } =
    useMissionDashboard();

  useEffect(() => {
    console.log("assetsLoading", assetsLoading);
  }, [assetsLoading]);

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

  const isMainAccount = selectedAccount.type === "regular";

  // Ranking Logic
  const topRankings = mainRanking?.rankings.slice(0, 3) || [];
  const myRankEntry = myRanking
    ? {
        rank: myRanking.returnRateRank,
        nickname: userInfo?.name || "나",
        balance: myRanking.myBalance,
        totalAssets: myRanking.myTotalAssets,
        returnRate: myRanking.myReturnRate,
        memberId: selectedAccount.memberId,
        isMe: true,
      }
    : null;

  const showMyRankingSeparately =
    myRankEntry && !topRankings.some((r) => r.rank === myRankEntry.rank);

  const DemoAdvertise = () => {
    return (
      <div className=" mt-4 p-4 bg-bg-banner rounded-xl flex items-center justify-between shadow-sm">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-bg-secondary text-text-secondary text-[10px] px-1.5 py-0.5 rounded font-bold">
              AD
            </span>
            <span className="text-xs font-semibold text-text-secondary">
              스톡잇 제휴광고
            </span>
          </div>
          <div className="flex items-center w-full justify-between">
            <div>
              <h3 className="font-bold text-text-primary text-sm">
                투자 고수들의 포트폴리오가 궁금하다면?
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                지금 바로 프리미엄 구독하고 수익률 UP!
              </p>
            </div>
            <div className="bg-bg-primary text-text-primary text-xs font-bold px-3 py-2 rounded-lg shadow-sm">
              보러가기
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="space-y-2 pb-24 relative min-h-dvh"
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
          className={`bg-bg-secondary p-5 rounded-2xl flex flex-col cursor-pointer overflow-hidden relative transition-all duration-700 ease-in-out ${
            helloVisible
              ? "max-h-[100px] opacity-100 py-3"
              : "max-h-0 opacity-0 py-0"
          }`}
          onClick={() => onNavigate("profile")}
        >
          <h1 className="text-xl font-bold text-text-primary">
            안녕하세요, {userInfo?.name || "투자자"}님 👋
          </h1>
          <p className="text-text-secondary text-sm">
            오늘도 스톡잇과 함께 배워봐요!
          </p>
        </div>

        {/* Event Section */}
        <div
          className={`bg-bg-secondary p-5 rounded-2xl flex flex-col cursor-pointer overflow-hidden relative transition-all duration-700 ease-in-out ${
            eventVisible
              ? "max-h-[100px] opacity-100 py-3"
              : "max-h-0 opacity-0 py-0 -mt-2"
          }`}
          onClick={() => onNavigate("competitions")}
        >
          <h1 className="text-xl font-bold text-text-primary">
            이벤트가 진행중이에요 🎉
          </h1>
          <p className="text-text-secondary text-sm">
            대회 탭에서 자세히 알아보세요!
          </p>
        </div>

        {/* advertise Section */}
        <div
          className={`bg-bg-secondary p-5 rounded-2xl flex flex-col cursor-pointer overflow-hidden relative transition-all duration-700 ease-in-out ${
            advertiseVisible
              ? "max-h-[100px] opacity-100 py-3"
              : "max-h-0 opacity-0 py-0 -mt-2"
          }`}
          onClick={() => onNavigate("competitions")}
        >
          <h1 className="text-xl font-bold text-text-primary">
            투자는 스톡잇과 함께 🔥
          </h1>
          <p className="text-text-secondary text-sm">
            이곳에 배너광고가 나옵니다.
          </p>
        </div>

        {/* Total Assets Section */}
        <div
          id="total-assets-card"
          className={`p-5 py-3 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-200 active:bg-border-color active:scale-95`}
          onClick={handleNavigateToPortfolio}
        >
          <div className="flex justify-between items-start">
            <p className="text-text-secondary text-sm font-medium">총 자산</p>
            <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <div
            className={`text-4xl font-extrabold text-text-primary transition-all duration-500 ease-in-out origin-left
            ${
              assetsLoading
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

        {/* Featured Competition or Mission */}
        <div
          className={`transition-opacity duration-500`}
          style={{ animationDelay: "100ms" }}
        >
          {!isMainAccount && displayCompetition ? (
            <div onClick={() => onNavigate("competitions")}>
              <FeaturedCompetition competition={displayCompetition} />
            </div>
          ) : (
            <MissionSummary
              onClick={() => setIsMissionPanelOpen(true)}
              data={missionDashboard}
            />
          )}
        </div>

        {/* Favorites Section */}
        {favoriteStocks && favoriteStocks.length > 0 && (
          <div className="bg-bg-secondary rounded-2xl p-5 pb-1 pt-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-text-primary">관심 주식</h2>
              <button
                className="text-xs text-text-secondary hover:text-primary transition-colors active-transition"
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
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-text-primary text-sm">
                      {Number(stock.currentPrice).toLocaleString()}원
                    </p>
                    <p
                      className={`text-xs w-fit font-medium ${
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
          <div className="bg-bg-secondary rounded-2xl p-5 pb-1 pt-3">
            <h2 className="text-lg font-bold text-text-primary -mb-1">
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
          <div className="bg-bg-secondary rounded-2xl p-5 pb-3 pt-3">
            <div
              className="flex justify-between items-center mb-2"
              onClick={() => onNavigate("rankings")}
            >
              <h2 className="text-lg font-bold text-text-primary">
                실시간 랭킹
              </h2>
              <button className="text-xs text-text-secondary hover:text-primary transition-colors active-transition">
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

        {/* 제휴광고패널 위치 */}
        <DemoAdvertise />
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
