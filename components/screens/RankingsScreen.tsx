"use client";
import React, { useState } from 'react';
import { MOCK_LEADERBOARD, MOCK_COMPETITION_LEADERBOARD, MOCK_AI_LEADERBOARD, MOCK_RIVAL_LEADERBOARD, MOCK_GROUP_LEADERBOARD, MOCK_USER } from '@/lib/constants';
import { LeaderboardEntry, Account, User, AIPersonaLeaderboardEntry } from '@/lib/types';
import UserProfileModal from '@/components/UserProfileModal';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, TrophyIcon, UsersIcon, CpuChipIcon, BuildingOffice2Icon } from '@/components/icons/Icons';

type RankView = 'overall' | 'rivals' | 'ai' | 'group';

const RankChange: React.FC<{ change: 'up' | 'down' | 'same' }> = ({ change }) => {
  if (change === 'up') return <ArrowTrendingUpIcon className="w-4 h-4 text-positive" />;
  if (change === 'down') return <ArrowTrendingDownIcon className="w-4 h-4 text-negative" />;
  return <span className="text-text-secondary">-</span>;
};

interface LeaderboardRowProps {
    entry: LeaderboardEntry;
    isMe: boolean;
    onClick: () => void;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry, isMe, onClick }) => {
  const isAI = 'personaName' in entry;
  return (
    <button 
        onClick={onClick}
        disabled={isMe}
        className={`w-full flex items-center p-4 rounded-2xl text-left transition-all duration-300 card-hover overflow-hidden relative group ${
          isMe 
            ? 'bg-primary/10 border-2 border-primary shadow-lg' 
            : 'bg-bg-secondary hover:bg-primary/5 border border-border-color'
        }`}
    >
      {/* Shimmer effect on hover */}
      {!isMe && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />}
      
      {/* Rank number with special styling for top 3 */}
      <div className={`w-10 text-center text-xl font-extrabold relative z-10 ${
        entry.rank === 1 ? 'text-yellow-500' : 
        entry.rank === 2 ? 'text-gray-400' : 
        entry.rank === 3 ? 'text-orange-600' : 
        'text-text-secondary'
      }`}>
        {entry.rank <= 3 ? '🏆' : entry.rank}
      </div>
      
      <div className="flex items-center gap-3 flex-1 ml-4 relative z-10">
        <div className="relative">
          <img 
            src={entry.avatar} 
            alt={entry.username} 
            className={`w-14 h-14 rounded-full transition-all duration-300 group-hover:scale-110 ${
              entry.rank <= 3 ? 'ring-4 ring-primary/50' : ''
            }`} 
          />
          {entry.rank <= 3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {entry.rank}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <p className={`font-bold text-lg mb-0.5 transition-colors duration-300 ${
            isMe ? 'text-primary' : 'text-text-primary group-hover:text-primary'
          }`}>
            {entry.username}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-text-secondary font-medium">
                {isAI ? (entry as AIPersonaLeaderboardEntry).personaName : `수익률 ${entry.returnRate.toFixed(1)}%`}
            </p>
            {entry.isRival && (
                <span className="text-xs font-bold bg-secondary text-white px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                  라이벌
                </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-10 flex justify-center relative z-10 transition-transform duration-300 group-hover:scale-125">
        <RankChange change={entry.change} />
      </div>
      
      {/* Corner accent for me */}
      {isMe && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/30 rounded-bl-full" />
      )}
    </button>
  );
};

interface RankingsScreenProps {
  selectedAccount: Account;
  user: User;
}

const RankingsScreen: React.FC<RankingsScreenProps> = ({ selectedAccount, user }) => {
  const [view, setView] = useState<RankView>('overall');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  const isCompetition = selectedAccount.type === 'competition';

  const handleOpenProfile = (entry: LeaderboardEntry) => {
    if (entry.username === MOCK_USER.username) return;
    setSelectedUser(entry);
    setIsModalOpen(true);
  };

  const handleCloseProfile = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getLeaderboard = () => {
    switch(view) {
        case 'overall': return isCompetition ? MOCK_COMPETITION_LEADERBOARD : MOCK_LEADERBOARD;
        case 'rivals': return MOCK_RIVAL_LEADERBOARD;
        case 'ai': return MOCK_AI_LEADERBOARD;
        case 'group': return MOCK_GROUP_LEADERBOARD;
        default: return MOCK_LEADERBOARD;
    }
  }

  const getTitle = () => {
    if (isCompetition) return "대회 랭킹";
    switch(view) {
        case 'overall': return "종합 랭킹";
        case 'rivals': return "라이벌 비교";
        case 'ai': return "AI 페르소나 비교";
        case 'group': return `${user.group.name} 랭킹`;
        default: return "랭킹";
    }
  }

  const tabs = [
    { id: 'overall', label: '종합', icon: TrophyIcon },
    { id: 'rivals', label: '라이벌', icon: UsersIcon },
    { id: 'ai', label: 'AI 비교', icon: CpuChipIcon },
    { id: 'group', label: '그룹', icon: BuildingOffice2Icon }
  ]

  const leaderboard = getLeaderboard();

  return (
    <>
        <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-text-primary animate-fadeInUp">
          {getTitle()}
        </h1>
        
        {!isCompetition && (
            <div className="flex bg-bg-secondary p-1.5 rounded-2xl shadow-lg border border-border-color animate-fadeInScale">
            {tabs.map((tab, index) => (
                <button
                key={tab.id}
                onClick={() => setView(tab.id as RankView)}
                className={`w-1/4 py-3 text-xs font-bold rounded-xl transition-all duration-300 flex flex-col items-center gap-1 relative overflow-hidden ${
                    view === tab.id 
          ? 'bg-primary text-white shadow-lg transform scale-[1.05]' 
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                >
                {view === tab.id && (
                  <div className="absolute inset-0 animate-shimmer" />
                )}
                <tab.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${view === tab.id ? 'scale-110' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
            </div>
        )}
        
        {view === 'group' && !isCompetition && (
            <div className="text-center p-5 bg-bg-secondary rounded-2xl shadow-lg border border-border-color card-hover animate-fadeInScale">
                <p className="text-text-secondary font-medium mb-1">{user.group.name} 평균 수익률</p>
                <p className="font-extrabold text-3xl text-positive">
                  +{user.group.averageReturn}%
                </p>
            </div>
        )}

        <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.rank + entry.username}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <LeaderboardRow 
                  entry={entry} 
                  isMe={entry.username === MOCK_USER.username} 
                  onClick={() => handleOpenProfile(entry)} 
                />
              </div>
            ))}
        </div>
        </div>
        <UserProfileModal isOpen={isModalOpen} onClose={handleCloseProfile} user={selectedUser} />
    </>
  );
};

export default RankingsScreen;
