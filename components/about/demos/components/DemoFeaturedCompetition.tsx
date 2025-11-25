import React from "react";
import {
  TrophyIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "@/components/icons/Icons";

export const DemoFeaturedCompetition: React.FC = () => {
  const totalDays = 31;
  const elapsedDays = 15;
  const progress = (elapsedDays / totalDays) * 100;

  return (
    <div className="bg-primary p-6 rounded-2xl text-white space-y-4 cursor-pointer overflow-hidden relative group">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <TrophyIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">
              11월 수익률 대회
            </h3>
            <p className="text-xs opacity-80">현재 진행중인 대회</p>
          </div>
        </div>
        <ChevronRightIcon className="w-5 h-5 opacity-70" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm relative z-10 pt-2">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
          <p className="opacity-80 text-xs mb-1">나의 순위</p>
          <p className="font-bold text-2xl">
            15
            <span className="text-sm font-normal opacity-80 ml-1">위</span>
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
          <p className="opacity-80 text-xs mb-1">수익률</p>
          <p className="font-bold text-2xl">+12.5%</p>
        </div>
      </div>

      <div className="relative z-10 pt-1">
        <div className="flex justify-between items-center text-xs opacity-90 mb-2">
          <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-full">
            <CalendarIcon className="w-3 h-3" />
            <span>D-{totalDays - elapsedDays}</span>
          </div>
          <span className="font-medium">
            {Number(progress).toFixed(0)}% 진행
          </span>
        </div>
        <div className="w-full bg-black/10 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-white h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
