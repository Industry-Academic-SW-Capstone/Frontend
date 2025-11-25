import React from "react";
import {
  HomeIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
} from "@/components/icons/Icons";

export const DemoBottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border-color pb-safe z-20 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        <div className="flex flex-col items-center gap-1 text-primary">
          <HomeIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">홈</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-text-tertiary">
          <ChartBarIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">주식</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-text-tertiary">
          <BellIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">알림</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-text-tertiary">
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">내 정보</span>
        </div>
      </div>
    </nav>
  );
};
