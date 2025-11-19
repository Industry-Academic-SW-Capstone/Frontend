"use client";
import React from "react";
import { Competition } from "@/lib/types/stock";
import {
  XMarkIcon,
  CalendarIcon,
  UsersIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@/components/icons/Icons";

interface CompetitionDetailScreenProps {
  competition: Competition;
  onClose: () => void;
  onJoin: () => void;
}

const CompetitionDetailScreen: React.FC<CompetitionDetailScreenProps> = ({
  competition,
  onClose,
  onJoin,
}) => {
  const now = new Date();
  const start = new Date(competition.startDate);
  const end = new Date(competition.endDate);
  const isActive = now >= start && now <= end;
  const isUpcoming = now < start;
  const isFinished = now > end;

  const statusText = isUpcoming
    ? "대회 시작 전"
    : isActive
    ? "진행 중"
    : "종료된 대회";
  const statusColor = isUpcoming
    ? "text-primary"
    : isActive
    ? "text-positive"
    : "text-text-secondary";

  return (
    <div className="h-full bg-bg-primary flex flex-col relative">
      {/* Header Image / Gradient Area */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors backdrop-blur-sm"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-primary to-transparent">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-bg-primary/80 backdrop-blur-md mb-2 ${statusColor}`}
          >
            {statusText}
          </span>
          <h1 className="text-2xl font-bold text-text-primary leading-tight">
            {competition.contestName}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-color">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <BanknotesIcon className="w-4 h-4" />
              <span className="text-xs font-medium">초기 자본금</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {competition.seedMoney.toLocaleString()}원
            </div>
          </div>
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-color">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <UsersIcon className="w-4 h-4" />
              <span className="text-xs font-medium">참가자</span>
            </div>
            <div className="text-lg font-bold text-text-primary">
              {competition.participants?.toLocaleString() ?? 0}명
            </div>
          </div>
        </div>

        {/* Description (if available) */}
        {competition.description && (
          <div className="text-text-secondary text-sm leading-relaxed">
            {competition.description}
          </div>
        )}

        {/* Detail Rules */}
        <div className="space-y-4">
          <h3 className="font-bold text-text-primary text-lg">대회 규칙</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">진행 기간</div>
                <div className="text-sm text-text-secondary">
                  {new Date(competition.startDate).toLocaleDateString()} ~{" "}
                  {new Date(competition.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent mt-0.5">
                <ChartBarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">매매 수수료</div>
                <div className="text-sm text-text-secondary">
                  {competition.commissionRate}%
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary mt-0.5">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">거래 제한</div>
                <div className="text-sm text-text-secondary">
                  일일 {competition.dailyTradeLimit}회 / 최대{" "}
                  {competition.maxHoldingsCount}종목 보유
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-positive/10 rounded-lg text-positive mt-0.5">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">쿨타임</div>
                <div className="text-sm text-text-secondary">
                  매수 {competition.buyCooldownMinutes}분 / 매도{" "}
                  {competition.sellCooldownMinutes}분
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-4 border-t border-border-color bg-bg-primary safe-area-bottom">
        <button
          onClick={onJoin}
          disabled={competition.isJoined || isFinished}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            competition.isJoined
              ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
              : isFinished
              ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
          }`}
        >
          {competition.isJoined ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-6 h-6" />
              이미 참가중인 대회입니다
            </span>
          ) : isFinished ? (
            "종료된 대회입니다"
          ) : (
            "대회 참가하기"
          )}
        </button>
      </div>
    </div>
  );
};

export default CompetitionDetailScreen;
