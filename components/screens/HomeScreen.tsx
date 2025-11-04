"use client";
import React from 'react';
import { Account, Competition } from '@/lib/types';
import StatCard from '@/components/StatCard';
import AccountChart from '@/components/AccountChart';
import { MOCK_COMPETITIONS } from '@/lib/constants';
import { ArrowTrendingUpIcon, TrophyIcon, CalendarIcon, FlagIcon } from '@/components/icons/Icons';

interface HomeScreenProps {
  selectedAccount: Account;
}

const FeaturedCompetition: React.FC<{ competition: Competition }> = ({ competition }) => {
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
                    <TrophyIcon className="w-6 h-6"/>
                </div>
                <h3 className="font-bold text-lg">{competition.name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                <div className="p-3 rounded-xl transition-all duration-300 hover:scale-105">
                    <p className="opacity-90 text-xs mb-1">나의 순위</p>
                    <p className="font-bold text-3xl drop-shadow-lg">{competition.rank}위</p>
                </div>
                <div className="p-3 rounded-xl transition-all duration-300 hover:scale-105">
                    <p className="opacity-90 text-xs mb-1">수익률</p>
                    <p className="font-bold text-3xl drop-shadow-lg">+{competition.returnPercent}%</p>
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-center text-xs opacity-90 mb-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full">
                        <CalendarIcon className="w-3 h-3"/>
                        <span>남은 기간: {totalDays - elapsedDays}일</span>
                    </div>
                    <span className="px-2 py-1 rounded-full font-semibold">{progress.toFixed(0)}%</span>
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
}

const HomeScreen: React.FC<HomeScreenProps> = ({ selectedAccount }) => {
  const isPositive = selectedAccount.change >= 0;
  const changeString = `${isPositive ? '+' : ''}${selectedAccount.change.toLocaleString()}원 (${isPositive ? '+' : ''}${selectedAccount.changePercent}%)`;

  return (
    <div className="space-y-6">
      {/* Total Assets Section with animated entrance */}
      <div className="animate-fadeInUp">
        <p className="text-text-secondary text-sm mb-1 font-medium">총 자산</p>
        <p className="text-5xl font-extrabold text-text-primary mb-2 transition-all duration-300 hover:scale-105">
          {selectedAccount.totalValue.toLocaleString()}원
        </p>
        {/* <div className="flex items-center gap-2">
          <p className={`font-bold text-lg ${isPositive ? 'text-positive' : 'text-negative'} transition-all duration-300`}>
            {changeString}
          </p>
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-positive' : 'bg-negative'} animate-pulse`} />
        </div> */}
      </div>

      {/* Chart with slide-in animation */}
      {/* <div className="animate-fadeInScale">
        <AccountChart data={selectedAccount.chartData} isPositive={isPositive} />
      </div> */}
      
      {/* Featured Competition with delay */}
      <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">참여중인 대회</h2>
          <span className="text-xs text-text-secondary bg-bg-secondary px-3 py-1 rounded-full font-medium border border-border-color">
            진행중
          </span>
        </div>
        <FeaturedCompetition competition={MOCK_COMPETITIONS[0]} />
      </div>

      {/* Stats Grid with stagger animation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="animate-slideInLeft" style={{ animationDelay: '200ms' }}>
          <StatCard title="오늘의 수익" value="+150,000" change="+1.2%" changeType="positive">
          <div className="bg-positive/10 p-3 rounded-full">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-positive"/>
              </div>
          </StatCard>
        </div>
        <div className="animate-slideInRight" style={{ animationDelay: '200ms' }}>
          <StatCard title="전체 랭킹" value="4위" change="↑ 1" changeType="positive">
        <div className="bg-primary/10 p-3 rounded-full">
                  <FlagIcon className="w-6 h-6 text-primary"/>
              </div>
          </StatCard>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
