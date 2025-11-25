import React from "react";
import { ChevronRightIcon } from "@/components/icons/Icons";

export const DemoAssetSummary: React.FC = () => {
  return (
    <div className="p-6 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-200 active:bg-border-color active:scale-95">
      <div className="flex justify-between items-start mb-2">
        <p className="text-text-secondary text-sm font-medium">총 자산</p>
        <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
      </div>
      <p className="text-4xl font-extrabold text-text-primary tracking-tight">
        1,250,000
        <span className="text-2xl font-bold ml-1">원</span>
      </p>
    </div>
  );
};
