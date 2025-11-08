"use client";

import React, { useState } from "react";
import { CompetitionLog } from "@/lib/types/stock";
import { ClockIcon } from "@/components/icons/Icons";

interface CompetitionLogsTabProps {
  competitionId: string;
}

// Mock data
const MOCK_LOGS: CompetitionLog[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-15T10:30:00"),
    type: "trade",
    userId: "1",
    username: "투자왕김씨",
    description: "AAPL 주식 50주 매수",
    metadata: { ticker: "AAPL", shares: 50, type: "buy", price: 175000 },
  },
  {
    id: "2",
    timestamp: new Date("2024-01-15T09:15:00"),
    type: "ranking_change",
    userId: "2",
    username: "주식천재",
    description: "순위 3위 → 2위 상승",
    metadata: { oldRank: 3, newRank: 2 },
  },
  {
    id: "3",
    timestamp: new Date("2024-01-15T08:00:00"),
    type: "join",
    userId: "3",
    username: "신규투자자",
    description: "대회에 참가했습니다",
    metadata: {},
  },
  {
    id: "4",
    timestamp: new Date("2024-01-14T16:45:00"),
    type: "announcement",
    description: "대회 규칙이 업데이트되었습니다",
    metadata: { title: "거래 시간 변경 안내" },
  },
  {
    id: "5",
    timestamp: new Date("2024-01-14T14:20:00"),
    type: "setting_change",
    description: "최대 투자 한도가 변경되었습니다",
    metadata: {
      field: "maxInvestmentPerStock",
      oldValue: 2000000,
      newValue: 3000000,
    },
  },
];

const CompetitionLogsTab: React.FC<CompetitionLogsTabProps> = ({
  competitionId,
}) => {
  const [filter, setFilter] = useState<"all" | CompetitionLog["type"]>("all");

  const logTypes = [
    { value: "all", label: "전체" },
    { value: "join", label: "참가" },
    { value: "trade", label: "거래" },
    { value: "ranking_change", label: "순위 변동" },
    { value: "announcement", label: "공지" },
    { value: "setting_change", label: "설정 변경" },
  ];

  const filteredLogs =
    filter === "all"
      ? MOCK_LOGS
      : MOCK_LOGS.filter((log) => log.type === filter);

  const getLogIcon = (type: CompetitionLog["type"]) => {
    switch (type) {
      case "join":
        return "👋";
      case "leave":
        return "👋";
      case "trade":
        return "💰";
      case "ranking_change":
        return "📊";
      case "setting_change":
        return "⚙️";
      case "announcement":
        return "📢";
      default:
        return "📝";
    }
  };

  const getLogColor = (type: CompetitionLog["type"]) => {
    switch (type) {
      case "join":
        return "bg-positive/10 text-positive";
      case "leave":
        return "bg-negative/10 text-negative";
      case "trade":
        return "bg-primary/10 text-primary";
      case "ranking_change":
        return "bg-accent/10 text-accent";
      case "setting_change":
        return "bg-secondary/10 text-secondary";
      case "announcement":
        return "bg-primary/10 text-primary";
      default:
        return "bg-border-color text-text-secondary";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {logTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value as typeof filter)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
              filter === type.value
                ? "bg-primary text-white shadow-md"
                : "bg-bg-secondary text-text-secondary hover:bg-border-color"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">
            {MOCK_LOGS.length}
          </p>
          <p className="text-xs text-text-secondary mt-1">전체 기록</p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {MOCK_LOGS.filter((l) => l.type === "trade").length}
          </p>
          <p className="text-xs text-text-secondary mt-1">거래</p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-positive">
            {MOCK_LOGS.filter((l) => l.type === "join").length}
          </p>
          <p className="text-xs text-text-secondary mt-1">신규 참가</p>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-3">
        {filteredLogs.map((log, index) => (
          <div
            key={log.id}
            className="bg-bg-secondary border border-border-color rounded-xl p-4 hover:shadow-md transition-all animate-fadeInUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getLogColor(log.type)}`}>
                <span className="text-xl">{getLogIcon(log.type)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-text-primary">
                    {log.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <ClockIcon className="w-3 h-3" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
                {log.username && (
                  <p className="text-sm text-text-secondary">
                    by {log.username}
                  </p>
                )}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="mt-2 p-2 bg-bg-primary rounded-lg text-xs">
                    {log.type === "trade" && log.metadata.ticker && (
                      <p className="text-text-secondary">
                        {log.metadata.ticker} • {log.metadata.shares}주 • ₩
                        {log.metadata.price?.toLocaleString()}
                      </p>
                    )}
                    {log.type === "ranking_change" && (
                      <p className="text-text-secondary">
                        {log.metadata.oldRank}위 → {log.metadata.newRank}위
                      </p>
                    )}
                    {log.type === "setting_change" && (
                      <p className="text-text-secondary">
                        {log.metadata.oldValue?.toLocaleString()} →{" "}
                        {log.metadata.newValue?.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">표시할 기록이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default CompetitionLogsTab;
