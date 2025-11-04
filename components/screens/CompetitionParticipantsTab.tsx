"use client";

import React, { useState } from 'react';
import { CompetitionParticipant } from '@/lib/types';
import { MagnifyingGlassIcon, ChartBarIcon } from '@/components/icons/Icons';

interface CompetitionParticipantsTabProps {
  competitionId: string;
}

// Mock data - 실제로는 API에서 가져와야 함
const MOCK_PARTICIPANTS: CompetitionParticipant[] = [
  {
    id: '1',
    username: '투자왕김씨',
    avatar: '👑',
    joinDate: '2024.01.01',
    currentRank: 1,
    totalValue: 12500000,
    returnPercent: 25.0,
    trades: 45,
    lastActive: '5분 전',
    portfolio: [
      { ticker: 'AAPL', shares: 50, value: 8750000 },
      { ticker: 'TSLA', shares: 20, value: 3750000 },
    ],
  },
  {
    id: '2',
    username: '주식천재',
    avatar: '🎯',
    joinDate: '2024.01.02',
    currentRank: 2,
    totalValue: 11800000,
    returnPercent: 18.0,
    trades: 38,
    lastActive: '1시간 전',
    portfolio: [
      { ticker: 'GOOGL', shares: 30, value: 7080000 },
      { ticker: 'NVDA', shares: 15, value: 4720000 },
    ],
  },
  {
    id: '3',
    username: '데이트레이더',
    avatar: '⚡',
    joinDate: '2024.01.03',
    currentRank: 3,
    totalValue: 11200000,
    returnPercent: 12.0,
    trades: 92,
    lastActive: '30분 전',
    portfolio: [
      { ticker: 'MSFT', shares: 40, value: 6720000 },
      { ticker: 'AMZN', shares: 25, value: 4480000 },
    ],
  },
];

const CompetitionParticipantsTab: React.FC<CompetitionParticipantsTabProps> = ({ competitionId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<CompetitionParticipant | null>(null);

  const filteredParticipants = MOCK_PARTICIPANTS.filter((p) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="참가자 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{MOCK_PARTICIPANTS.length}</p>
          <p className="text-xs text-text-secondary mt-1">총 참가자</p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-positive">
            {MOCK_PARTICIPANTS.filter((p) => p.returnPercent > 0).length}
          </p>
          <p className="text-xs text-text-secondary mt-1">수익 중</p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">
            {(MOCK_PARTICIPANTS.reduce((sum, p) => sum + p.trades, 0) / MOCK_PARTICIPANTS.length).toFixed(0)}
          </p>
          <p className="text-xs text-text-secondary mt-1">평균 거래</p>
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-3">
        {filteredParticipants.map((participant, index) => (
          <div
            key={participant.id}
            onClick={() => setSelectedParticipant(participant)}
            className="bg-bg-secondary border border-border-color rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{participant.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{participant.username}</span>
                    <span className="text-xs text-text-secondary">#{participant.currentRank}</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    가입일: {participant.joinDate} • {participant.lastActive}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-border-color rounded-lg transition-colors">
                <ChartBarIcon className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-text-secondary text-xs">총 자산</p>
                <p className="font-bold text-text-primary">
                  {(participant.totalValue / 10000).toFixed(0)}만원
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">수익률</p>
                <p
                  className={`font-bold ${
                    participant.returnPercent >= 0 ? 'text-positive' : 'text-negative'
                  }`}
                >
                  {participant.returnPercent > 0 ? '+' : ''}
                  {participant.returnPercent.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">거래 횟수</p>
                <p className="font-bold text-text-primary">{participant.trades}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fadeIn"
          onClick={() => setSelectedParticipant(null)}
        >
          <div
            className="bg-bg-primary w-full max-w-md rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slideInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedParticipant.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {selectedParticipant.username}
                  </h3>
                  <p className="text-sm text-text-secondary">순위 #{selectedParticipant.currentRank}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">총 자산</p>
                <p className="text-lg font-bold text-text-primary">
                  ₩{selectedParticipant.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">수익률</p>
                <p
                  className={`text-lg font-bold ${
                    selectedParticipant.returnPercent >= 0 ? 'text-positive' : 'text-negative'
                  }`}
                >
                  {selectedParticipant.returnPercent > 0 ? '+' : ''}
                  {selectedParticipant.returnPercent.toFixed(1)}%
                </p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">거래 횟수</p>
                <p className="text-lg font-bold text-text-primary">{selectedParticipant.trades}</p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">마지막 활동</p>
                <p className="text-lg font-bold text-text-primary">{selectedParticipant.lastActive}</p>
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h4 className="font-bold text-text-primary mb-3">포트폴리오</h4>
              <div className="space-y-2">
                {selectedParticipant.portfolio.map((stock, idx) => (
                  <div key={idx} className="bg-bg-secondary rounded-xl p-3 flex justify-between">
                    <div>
                      <p className="font-bold text-text-primary">{stock.ticker}</p>
                      <p className="text-xs text-text-secondary">{stock.shares}주</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-primary">
                        ₩{stock.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {((stock.value / selectedParticipant.totalValue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionParticipantsTab;
