"use client";
import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, Achievement } from '@/lib/types';
import * as Icons from './icons/Icons';
import { MOCK_ACHIEVEMENTS } from '@/lib/constants';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LeaderboardEntry | null;
}

const iconMap: { [key: string]: React.FC<any> } = {
  BriefcaseIcon: Icons.BriefcaseIcon,
  ArrowTrendingUpIcon: Icons.ArrowTrendingUpIcon,
  ChartPieIcon: Icons.ChartPieIcon,
  BanknotesIcon: Icons.BanknotesIcon,
  TrophyIcon: Icons.TrophyIcon,
  UsersIcon: Icons.UsersIcon,
};

const MiniAchievement: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const Icon = iconMap[achievement.icon] || Icons.TrophyIcon;
    return (
      <div className="flex flex-col items-center text-center w-20">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-accent/20 text-accent">
          <Icon className="w-8 h-8" />
        </div>
        <p className="text-xs mt-2 font-semibold text-text-primary truncate">{achievement.name}</p>
      </div>
    );
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [isRival, setIsRival] = useState(user?.isRival || false);
  const userAchievements = MOCK_ACHIEVEMENTS.filter(a => a.unlocked).slice(0, 3);

  useEffect(() => {
    if (user) {
      setIsRival(user.isRival || false);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleToggleRival = () => {
    setIsRival(!isRival);
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 transition-opacity duration-300" 
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div 
        className="w-full max-w-md bg-bg-secondary rounded-t-2xl p-4 transform transition-transform duration-300 ease-in-out" 
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="w-12 h-1.5 bg-border-color rounded-full mx-auto mb-4"></div>
        
        <div className="flex flex-col items-center text-center">
            <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full mb-3 border-4 border-bg-primary shadow-lg"/>
            <h2 className="text-xl font-bold text-text-primary">{user.username}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                <span>랭킹: <span className="font-bold text-text-primary">{user.rank}위</span></span>
                <span>수익률: <span className="font-bold text-positive">{user.returnRate.toFixed(1)}%</span></span>
            </div>
        </div>

        <div className="my-6">
            <h3 className="text-sm font-bold text-text-secondary text-center mb-3">대표 업적</h3>
            <div className="flex justify-center gap-4">
                {userAchievements.map(ach => <MiniAchievement key={ach.id} achievement={ach} />)}
            </div>
        </div>

        <button 
            onClick={handleToggleRival}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-colors ${
                isRival 
                ? 'bg-secondary hover:bg-secondary/90' 
                : 'bg-primary hover:bg-primary/90'
            }`}
        >
            {isRival ? <Icons.UsersIcon className="w-5 h-5" /> : <Icons.UserPlusIcon className="w-5 h-5" />}
            {isRival ? '라이벌' : '라이벌 추가'}
        </button>

      </div>
    </div>
  );
};

export default UserProfileModal;
