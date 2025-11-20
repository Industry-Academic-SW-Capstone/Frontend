"use client";
import React, { useState } from "react";
import {
  TrophyIcon,
  CalendarIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@/components/icons/Icons";
import MissionPanel from "@/components/MissionPanel";
import { generateLogo } from "@/lib/utils";
import {
  MOCK_USER_INFO,
  MOCK_ASSETS,
  MOCK_FAVORITE_STOCKS,
  MOCK_PENDING_ORDERS,
  MOCK_RANKINGS,
  MOCK_MY_RANKING,
  MOCK_COMPETITION,
} from "@/components/about/constants";
import { Competition } from "@/lib/types/stock";

// --- Local Components (Copied/Adapted from HomeScreen) ---

const FeaturedCompetition: React.FC<{ competition: any }> = ({
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

// --- DemoHomeScreen Component ---

interface DemoHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const DemoHomeScreen: React.FC<DemoHomeScreenProps> = ({
  onNavigate,
}) => {
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState(false);

  // Mock Data
  const userInfo = MOCK_USER_INFO;
  const assets = MOCK_ASSETS;
  const favoriteStocks = MOCK_FAVORITE_STOCKS;
  const pendingOrders = MOCK_PENDING_ORDERS;
  const topRankings = MOCK_RANKINGS;
  const myRankEntry = MOCK_MY_RANKING;
  const displayCompetition = MOCK_COMPETITION;

  // Pull to Refresh Mock State
  const [pullCurrentY, setPullCurrentY] = useState(0);
  const isRefreshing = false;

  return (
    <>
      <div className="space-y-3 p-4 pt-10 pb-24 relative min-h-full bg-bg-primary">
        {/* Greeting Section */}
        <div
          className="p-6 py-3 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-500"
          onClick={() => onNavigate("profile")}
        >
          <h1 className="text-2xl font-bold text-text-primary">
            안녕하세요, {userInfo.name}님 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            오늘도 스톡잇과 함께 배워봐요!
          </p>
        </div>

        {/* Total Assets Section */}
        <div
          className="p-6 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-200 active:bg-border-color active:scale-95"
          onClick={() => onNavigate("portfolio")}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-text-secondary text-sm font-medium">총 자산</p>
            <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <p className="text-4xl font-extrabold text-text-primary tracking-tight">
            {Number(assets.totalAssets).toLocaleString()}
            <span className="text-2xl font-bold ml-1">원</span>
          </p>
        </div>

        {/* Featured Competition */}
        <div className="transition-opacity duration-500">
          <div onClick={() => onNavigate("competitions")}>
            <FeaturedCompetition competition={displayCompetition} />
          </div>
        </div>

        {/* Featured Competition */}
        <div className="transition-opacity duration-500">
          <div onClick={() => onNavigate("competitions")}>
            <MissionSummary onClick={() => onNavigate("competitions")} />
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-bg-secondary rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">관심 주식</h2>
            <button
              className="text-xs text-text-secondary hover:text-primary transition-colors"
              onClick={() => onNavigate("explore")}
            >
              전체보기
            </button>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide swiper-no-swiping"
            data-lenis-prevent
          >
            {favoriteStocks.map((stock) => (
              <div
                key={stock.stockCode}
                className="min-w-[140px] flex flex-col gap-3 cursor-pointer group transition-all duration-200 active:scale-95"
                onClick={() => onNavigate(`stock/${stock.stockCode}`)}
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

        {/* Pending Orders Section */}
        <div className="bg-bg-secondary rounded-2xl p-5">
          <h2 className="text-lg font-bold text-text-primary mb-2">
            대기 중인 주문
          </h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div
                key={order.orderId}
                className="flex justify-between items-center cursor-pointer p-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-bg-tertiary active:bg-border-color active:scale-95"
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
                    {Number(order.price).toLocaleString()}원
                  </p>
                  <button className="text-xs text-text-secondary bg-bg-primary px-2 py-1 rounded-lg mt-1 hover:bg-border-color transition-colors">
                    취소
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rankings Preview */}
        <div className="bg-bg-secondary rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">실시간 랭킹</h2>
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
                key={rank.rank}
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
          </div>
        </div>
      </div>

      {/* Mission Panel */}
      <MissionPanel
        isOpen={isMissionPanelOpen}
        onClose={() => setIsMissionPanelOpen(false)}
      />
    </>
  );
};
