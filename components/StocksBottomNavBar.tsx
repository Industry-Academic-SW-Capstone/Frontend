"use client";
import React from "react";
import {
  ArrowUturnLeftIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
} from "./icons/Icons";

export type StocksView = "explore" | "portfolio" | "analysis";

interface StocksBottomNavBarProps {
  currentView: StocksView;
  setCurrentView: (view: StocksView) => void;
  onExit: () => void;
}

const navItems: { view: StocksView; label: string; icon: React.FC<any> }[] = [
  { view: "portfolio", label: "자산", icon: BriefcaseIcon },
  { view: "explore", label: "탐색", icon: MagnifyingGlassIcon },
  { view: "analysis", label: "투자분석", icon: ChartPieIcon },
];

const StocksBottomNavBar: React.FC<StocksBottomNavBarProps> = ({
  currentView,
  setCurrentView,
  onExit,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto">
      <div className="bg-bg-secondary/80 pb-safe backdrop-blur-lg border-t border-border-color px-2 pt-2 flex justify-around rounded-t-2xl">
        <button
          onClick={onExit}
          className="flex flex-col active-transition items-center justify-center w-16 h-16 transition-all duration-200 ease-in-out rounded-lg text-text-secondary group"
        >
          <div className="relative">
            <ArrowUturnLeftIcon className="w-7 h-7 mb-1 group-hover:-translate-x-1 transition-transform" />
            {/* 스와이프 힌트 아이콘 */}
          </div>
          <span className="text-xs font-medium">뒤로가기</span>
        </button>
        {navItems.map((item) => (
          <button
            key={item.view}
            id={`stock-tab-${item.view}`}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-200 ease-in-out rounded-lg active-transition ${
              currentView === item.view
                ? "text-text-primary scale-105"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <item.icon className="w-7 h-7 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StocksBottomNavBar;
