"use client";
import React, { useState } from "react";
import { Account, User, RankingEntry } from "@/lib/types/stock";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
} from "@/components/icons/Icons";
import { useRanking, useMyRanking } from "@/lib/hooks/useRanking";
import { useQueryClient } from "@tanstack/react-query";

const RankChange: React.FC<{ change: "up" | "down" | "same" }> = ({
  change,
}) => {
  if (change === "up")
    return <ArrowTrendingUpIcon className="w-4 h-4 text-positive" />;
  if (change === "down")
    return <ArrowTrendingDownIcon className="w-4 h-4 text-negative" />;
  return <span className="text-text-secondary">-</span>;
};

interface LeaderboardRowProps {
  entry: RankingEntry;
  isMe: boolean;
  onClick: () => void;
  showReturnRate: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  entry,
  isMe,
  onClick,
  showReturnRate,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isMe}
      className={`w-full flex items-center px-5 py-4 text-left transition-colors duration-200 ${
        isMe ? "bg-primary/5" : "hover:bg-bg-third"
      }`}
    >
      {/* Rank number */}
      <div
        className={`w-8 text-center text-lg font-bold ${
          entry.rank <= 3 ? "text-primary" : "text-text-secondary"
        }`}
      >
        {entry.rank}
      </div>

      <div className="flex items-center gap-4 flex-1 ml-4">
        {/* Avatar Placeholder */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            isMe
              ? "bg-primary/10 text-primary"
              : "bg-bg-third text-text-secondary"
          }`}
        >
          {entry.nickname[0]}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`font-bold text-base ${
                isMe ? "text-primary" : "text-text-primary"
              }`}
            >
              {entry.nickname}
            </p>
            {isMe && (
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                ME
              </span>
            )}
          </div>
          {showReturnRate && (
            <p
              className={`text-sm font-medium mt-0.5 ${
                entry.returnRate >= 0 ? "text-error" : "text-primary"
              }`}
            >
              {entry.returnRate > 0 ? "+" : ""}
              {entry.returnRate}%
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-text-primary text-base">
          {Number(entry.balance).toLocaleString()}원
        </p>
      </div>
    </button>
  );
};

interface RankingsScreenProps {
  selectedAccount: Account;
  user: User;
}

const RankingsScreen: React.FC<RankingsScreenProps> = ({
  selectedAccount,
  user,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RankingEntry | null>(null);

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullCurrentY, setPullCurrentY] = useState(0);
  const PULL_THRESHOLD = 80;
  const queryClient = useQueryClient();

  const { data: rankingData, isLoading: isRankingLoading } = useRanking();
  const { data: myRankingData, isLoading: isMyRankingLoading } = useMyRanking();

  const isRegularAccount = selectedAccount.type === "regular";

  const handleOpenProfile = (entry: RankingEntry) => {
    if (myRankingData && entry.memberId === selectedAccount.memberId) return;
    setSelectedUser(entry);
    setIsModalOpen(true);
  };

  const handleCloseProfile = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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

  if (isRankingLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
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
        {/* My Ranking Summary */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-7 shadow-lg shadow-primary/10 transition-transform hover:scale-[1.01] active:scale-[0.99]">
          {/* Background Patterns */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />

          {isMyRankingLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-white/20 rounded"></div>
                <div className="h-4 w-16 bg-white/20 rounded"></div>
              </div>
              <div className="h-8 w-32 bg-white/20 rounded"></div>
              <div className="h-12 w-full bg-white/10 rounded-2xl"></div>
            </div>
          ) : myRankingData ? (
            <div className="relative z-10">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-white/80">
                    내 순위
                  </p>
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-extrabold text-white">
                      {myRankingData.balanceRank}
                    </h2>
                    <span className="text-lg font-medium text-white/80">
                      위
                    </span>
                  </div>
                </div>
                {!isRegularAccount && (
                  <div className="text-right">
                    <p className="mb-1 text-sm font-medium text-white/80">
                      수익률
                    </p>
                    <h2 className="text-2xl font-bold text-white">
                      {myRankingData.myReturnRate}%
                    </h2>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-md">
                <span className="font-medium text-white/90">현재 자산</span>
                <span className="text-xl font-bold text-white">
                  {Number(myRankingData.myBalance).toLocaleString()}원
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center py-4 text-white/80">
              <p>내 랭킹 정보를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>

        {/* Ranking List */}
        <div className="space-y-0">
          <div className="px-2 py-2 text-sm font-semibold text-text-secondary">
            전체 랭킹
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-border-color bg-bg-secondary shadow-sm">
            {rankingData?.rankings.map((entry, index) => (
              <div
                key={entry.rank + entry.nickname}
                className={`border-b border-border-color last:border-none ${
                  index < 10 ? "animate-fadeInUp" : ""
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <LeaderboardRow
                  entry={entry}
                  isMe={entry.memberId === selectedAccount.memberId}
                  onClick={() => handleOpenProfile(entry)}
                  showReturnRate={!isRegularAccount}
                />
              </div>
            ))}
            {rankingData?.rankings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                <div className="mb-2 text-4xl">📉</div>
                <p>랭킹 데이터가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <UserProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseProfile}
        user={
          selectedUser
            ? {
                username: selectedUser.nickname,
                avatar: "", // Placeholder
                title: "Novice Investor", // Placeholder
                group: { id: "1", name: "General", averageReturn: 0 }, // Placeholder
              }
            : null
        }
      /> */}
    </>
  );
};

export default RankingsScreen;
