"use client";
import React from 'react';
import { Screen } from '@/lib/types';
import { HomeIcon, MagnifyingGlassIcon, TrophyIcon, ChartBarIcon, UserCircleIcon } from './icons/Icons';

interface BottomNavBarProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  isStocksActive?: boolean;
}

const navItems: { screen: Screen; label: string; icon: React.FC<any> }[] = [
  { screen: 'home', label: '홈', icon: HomeIcon },
  { screen: 'stocks', label: '증권', icon: MagnifyingGlassIcon },
  { screen: 'competitions', label: '대회', icon: TrophyIcon },
  { screen: 'rankings', label: '랭킹', icon: ChartBarIcon },
  { screen: 'profile', label: 'MY', icon: UserCircleIcon },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, setCurrentScreen, isStocksActive = false }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto">
      <div className="bg-bg-secondary/95 backdrop-blur-xl border-t border-border-color px-4 pt-3 pb-5 flex justify-around rounded-t-3xl shadow-2xl">
        {navItems.map((item, index) => {
          const isActive = item.screen === 'stocks' ? isStocksActive : currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => setCurrentScreen(item.screen)}
              className={`flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ease-out rounded-xl relative group ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              
              <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-105' : ''}`}>
                <item.icon className={`w-7 h-7 mb-1 transition-all duration-300 ${isActive ? 'drop-shadow-lg' : ''}`} />
              </div>
              
              <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
