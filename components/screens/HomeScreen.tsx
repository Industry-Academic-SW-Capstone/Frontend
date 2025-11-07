"use client";
import React, { useState, useEffect } from "react";
import { Account, Competition } from "@/lib/types/types";
import StatCard from "@/components/StatCard";
import AccountChart from "@/components/AccountChart";
import { MOCK_COMPETITIONS, MOCK_MISSION_PROGRESS } from "@/lib/constants";
import {
  ArrowTrendingUpIcon,
  TrophyIcon,
  CalendarIcon,
  FlagIcon,
} from "@/components/icons/Icons";
import MissionPanel from "@/components/MissionPanel";

interface HomeScreenProps {
  selectedAccount: Account;
}

const FeaturedCompetition: React.FC<{ competition: Competition }> = ({
  competition,
}) => {
  const totalDays = 31;
  const elapsedDays = 15;
  const progress = (elapsedDays / totalDays) * 100;

  return (
    <div className="bg-primary p-6 rounded-3xl text-white shadow-lg space-y-2 card-hover cursor-pointer overflow-hidden relative group">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="bg-white/20 p-3 rounded-xl shadow-lg transition-transform duration-300">
          <TrophyIcon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg">{competition.name}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
        <div className="p-3 rounded-xl transition-all duration-300 hover:scale-105">
          <p className="opacity-90 text-xs mb-1">나의 순위</p>
          <p className="font-bold text-3xl drop-shadow-lg">
            {competition.rank}위
          </p>
        </div>
        <div className="p-3 rounded-xl transition-all duration-300 hover:scale-105">
          <p className="opacity-90 text-xs mb-1">수익률</p>
          <p className="font-bold text-3xl drop-shadow-lg">
            +{competition.returnPercent}%
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center text-xs opacity-90 mb-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full">
            <CalendarIcon className="w-3 h-3" />
            <span>남은 기간: {totalDays - elapsedDays}일</span>
          </div>
          <span className="px-2 py-1 rounded-full font-semibold">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 shadow-inner overflow-hidden">
          <div
            className="bg-white h-3 rounded-full shadow-lg transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const MissionSummary: React.FC<{ onOpenMissions: () => void }> = ({
  onOpenMissions,
}) => {
  const progress = MOCK_MISSION_PROGRESS;
  const dailyProgress =
    (progress.dailyMissionsCompleted / progress.dailyMissionsTotal) * 100;

  return (
    <div
      onClick={onOpenMissions}
      className="p-5 rounded-2xl shadow-md border border-border-color bg-bg-secondary flex flex-col card-hover cursor-pointer group overflow-hidden relative"
    >
      {/* <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full blur-2xl" /> */}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg">오늘의 미션</h3>
          <span className="text-xs bg-black/5 px-3 py-1 rounded-full font-medium">
            {progress.dailyMissionsCompleted}/{progress.dailyMissionsTotal}
          </span>
        </div>

        <div className="w-full bg-black/20 backdrop-blur-sm rounded-full h-3 shadow-inner overflow-hidden mb-4">
          <div
            className="bg-linear-to-r from-primary/80 to-secondary/80 h-3 rounded-full shadow-lg transition-all duration-500"
            style={{ width: `${dailyProgress}%` }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-90">{progress.currentTheme} 테마</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-black/3 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="opacity-80 mb-1">입문</p>
              <p className="font-bold text-base">
                {progress.themeMissions.beginner.completed}/
                {progress.themeMissions.beginner.total}
              </p>
            </div>
            <div className="bg-black/3 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="opacity-80 mb-1">중급</p>
              <p className="font-bold text-base">
                {progress.themeMissions.intermediate.completed}/
                {progress.themeMissions.intermediate.total}
              </p>
            </div>
            <div className="bg-black/3 backdrop-blur-sm rounded-xl p-2 text-center">
              <p className="opacity-80 mb-1">고급</p>
              <p className="font-bold text-base">
                {progress.themeMissions.advanced.completed}/
                {progress.themeMissions.advanced.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center pt-2 mt-1 border-t border-black/7">
        <p className="text-xs opacity-80">탭하여 미션 자세히 보기 →</p>
      </div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ selectedAccount }) => {
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const isPositive = selectedAccount.change >= 0;
  const changeString = `${
    isPositive ? "+" : ""
  }${selectedAccount.change.toLocaleString()}원 (${isPositive ? "+" : ""}${
    selectedAccount.changePercent
  }%)`;
  const isMainAccount = selectedAccount.type === "regular";

  return (
    <>
      <div className="space-y-4">
        {/* Total Assets Section with animated entrance */}
        <div
          className={`p-5  bg-bg-secondary rounded-2xl shadow-md border border-border-color flex flex-col card-hover cursor-pointer group overflow-hidden relative transition-opacity duration-500 ${
            isMounted ? "animate-fadeInUp opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-text-secondary text-sm mb-1 font-medium">
            총 자산
          </p>
          <p className="text-5xl font-extrabold text-text-primary mb-2 transition-all duration-300">
            {selectedAccount.totalValue.toLocaleString()}원
          </p>
          <div className="flex items-center gap-2">
            <p
              className={`font-bold text-lg ${
                isPositive ? "text-positive" : "text-negative"
              } transition-all duration-300`}
            >
              {changeString}
            </p>
            <div
              className={`w-2 h-2 rounded-full ${
                isPositive ? "bg-positive" : "bg-negative"
              } animate-pulse`}
            />
          </div>
          {/* 
          <AccountChart
            data={selectedAccount.chartData}
            isPositive={isPositive}
          /> */}
        </div>

        {/* Conditional Section: Mission Summary or Featured Competition */}
        <div
          className={`transition-opacity duration-500 ${
            isMounted ? "animate-fadeInUp opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: "100ms" }}
        >
          {isMainAccount ? (
            <MissionSummary
              onOpenMissions={() => setIsMissionPanelOpen(true)}
            />
          ) : (
            <FeaturedCompetition competition={MOCK_COMPETITIONS[0]} />
          )}
        </div>

        {/* Stats Grid with stagger animation */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`transition-opacity duration-500 ${
              isMounted ? "animate-slideInLeft opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            <StatCard
              title="오늘의 수익"
              value="+250,000"
              change={"+" + selectedAccount.changePercent + "%"}
              changeType="positive"
            >
              <div className="bg-positive/10 p-3 rounded-full">
                <ArrowTrendingUpIcon className="w-6 h-6 text-positive" />
              </div>
            </StatCard>
          </div>
          <div
            className={`transition-opacity duration-500 ${
              isMounted ? "animate-slideInRight opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            <StatCard
              title="전체 랭킹"
              value="4위"
              change="↑ 1"
              changeType="positive"
            >
              <div className="bg-primary/10 p-3 rounded-full">
                <FlagIcon className="w-6 h-6 text-primary" />
              </div>
            </StatCard>
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

export default HomeScreen;
