import React from "react";
import {
  ChevronDownIcon,
  BuildingOffice2Icon,
  BellIcon,
} from "@/components/icons/Icons";

export const DemoHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 max-w-md mx-auto bg-bg-primary/80 backdrop-blur-lg">
      <div className="flex items-center justify-between p-4 h-16 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs bg-bg-secondary px-2 py-1 rounded-full text-text-secondary font-semibold">
            <BuildingOffice2Icon className="w-4 h-4" />
            <span>새싹 투자자</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 알림 버튼 */}
          <button className="relative p-1 hover:bg-bg-secondary rounded-full transition-colors">
            <BellIcon className="w-6 h-6 text-text-secondary" />
            <span className="absolute top-0 right-1 bg-negative text-white text-xs font-bold rounded-full w-2 h-2 flex items-center justify-center"></span>
          </button>

          {/* 계좌 전환 버튼 */}
          <button className="flex items-center gap-1 bg-bg-secondary px-3 py-1.5 rounded-full text-sm text-text-secondary active:text-text-primary font-semibold hover:bg-border-color transition-colors">
            <span className="max-w-[100px] truncate">기본 계좌</span>
            <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
};
