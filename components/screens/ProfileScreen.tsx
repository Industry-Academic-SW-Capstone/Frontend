"use client";
import React, { useState } from 'react';
import { MOCK_ACHIEVEMENTS, MOCK_TRANSACTIONS, MOCK_ANALYSIS_RESULT } from '@/lib/constants';
import { Achievement, User, InvestmentStyleAnalysis } from '@/lib/types';
import { analyzeInvestmentStyle } from '@/lib/services/geminiService';
import * as Icons from '@/components/icons/Icons';
import InvestmentAnalysisCard from '@/components/InvestmentAnalysisCard';

interface ProfileScreenProps {
  user: User;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const iconMap: { [key: string]: React.FC<any> } = {
  BriefcaseIcon: Icons.BriefcaseIcon,
  ArrowTrendingUpIcon: Icons.ArrowTrendingUpIcon,
  ChartPieIcon: Icons.ChartPieIcon,
  BanknotesIcon: Icons.BanknotesIcon,
  TrophyIcon: Icons.TrophyIcon,
  UsersIcon: Icons.UsersIcon,
};

const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const Icon = iconMap[achievement.icon] || Icons.TrophyIcon;
    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 card-hover overflow-hidden relative group ${
          achievement.unlocked 
            ? 'bg-bg-primary border border-border-color' 
            : 'bg-bg-primary opacity-50 grayscale'
        }`}>
            {/* Shimmer effect for unlocked achievements */}
            {achievement.unlocked && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
            )}
            
            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative z-10 ${
              achievement.unlocked 
                ? 'bg-accent/20 text-accent shadow-lg' 
                : 'bg-border-color text-text-secondary'
            }`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1 relative z-10">
                <p className={`font-bold text-text-primary mb-0.5 transition-colors duration-300 ${
                  achievement.unlocked ? 'group-hover:text-accent' : ''
                }`}>
                  {achievement.name}
                </p>
                <p className="text-sm text-text-secondary">{achievement.description}</p>
            </div>
            
            {/* Corner accent for unlocked */}
            {achievement.unlocked && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-accent/20 rounded-bl-full" />
            )}
        </div>
    );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, isDarkMode, setIsDarkMode }) => {
  const [analysis, setAnalysis] = useState<InvestmentStyleAnalysis | null>(MOCK_ANALYSIS_RESULT);
  const [analysisError, setAnalysisError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisError('');
    setAnalysis(null);
    const result = await analyzeInvestmentStyle(MOCK_TRANSACTIONS);
    if (typeof result === 'string') {
        setAnalysisError(result);
    } else {
        setAnalysis(result);
    }
    setIsLoading(false);
  };

  const visibleAchievements = showAllAchievements ? MOCK_ACHIEVEMENTS : MOCK_ACHIEVEMENTS.slice(0, 3);

  return (
    <div className="pt-4 space-y-8">
      {/* Profile Card with gradient background */}
  <div className="bg-bg-secondary p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center card-hover overflow-hidden relative group animate-fadeInUp">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-float" />
        
        <div className="relative z-10">
          <div className="relative inline-block mb-4">
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="w-28 h-28 rounded-full border-4 border-white dark:border-bg-secondary shadow-2xl transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <Icons.TrophyIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-text-primary mb-3">
            {user.username}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <div className="font-bold text-sm bg-accent text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              {user.title}
            </div>
            <div className="flex items-center gap-2 text-sm bg-bg-primary px-4 py-2 rounded-full text-text-secondary font-bold border border-border-color shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Icons.BuildingOffice2Icon className="w-4 h-4"/>
              <span>{user.group.name}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Analysis Section */}
      <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
    {analysis ? (
      <InvestmentAnalysisCard analysis={analysis} />
    ) : (
      <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-lg card-hover overflow-hidden relative group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                
                <div className="flex items-center gap-3 mb-5 relative z-10">
                    <div className="p-3 bg-secondary/10 rounded-xl">
                      <Icons.SparklesIcon className="w-7 h-7 text-secondary animate-pulse"/>
                    </div>
                    <h3 className="font-bold text-xl text-text-primary">AI 투자 스타일 분석</h3>
                </div>
                
                {analysisError && (
                  <p className="text-negative text-center mb-4 font-medium animate-fadeIn">{analysisError}</p>
                )}
                
        <button 
          onClick={handleAnalyze} 
          disabled={isLoading}
          className="w-full bg-secondary text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">{isLoading ? '분석 중...' : '내 투자 스타일 분석하기'}</span>
        </button>
            </div>
        )}
      </div>

      {/* Achievements Section */}
  <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-lg animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Icons.TrophyIcon className="w-6 h-6 text-primary"/>
                </div>
                <h3 className="font-bold text-xl text-text-primary">업적</h3>
            </div>
            {MOCK_ACHIEVEMENTS.length > 3 && (
                <button 
                  onClick={() => setShowAllAchievements(!showAllAchievements)} 
                  className="text-sm font-bold text-primary hover:text-secondary transition-colors duration-300 px-3 py-1 rounded-full hover:bg-primary/10"
                >
                    {showAllAchievements ? '간략히 ▲' : '전체 ▼'}
                </button>
            )}
        </div>
        <div className="space-y-3">
          {visibleAchievements.map((ach, index) => (
            <div key={ach.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
              <AchievementItem achievement={ach} />
            </div>
          ))}
        </div>
      </div>

      {/* Settings Section */}
  <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-lg animate-fadeInUp" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-text-secondary/10 rounded-xl">
              <Icons.Cog6ToothIcon className="w-6 h-6 text-text-secondary"/>
            </div>
            <h3 className="font-bold text-xl text-text-primary">설정</h3>
        </div>
        
        <div className="flex justify-between items-center bg-bg-primary p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
            <span className="text-text-primary font-bold">다크 모드</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`relative inline-flex items-center h-8 rounded-full w-14 transition-all duration-300 shadow-inner ${
                isDarkMode ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
                <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                  isDarkMode ? 'translate-x-7 rotate-180' : 'translate-x-1'
                }`}>
                </span>
            </button>
        </div>
      </div>

    </div>
  );
};

export default ProfileScreen;
