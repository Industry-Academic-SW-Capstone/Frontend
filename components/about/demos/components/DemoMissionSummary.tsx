import React from "react";
import { ChevronRightIcon } from "@/components/icons/Icons";

export const DemoMissionSummary: React.FC = () => {
  return (
    <div className="bg-bg-secondary p-5 rounded-2xl cursor-pointer group transition-colors hover:bg-bg-tertiary">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary text-lg">
            오늘의 미션
          </span>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-text-tertiary group-hover:text-text-primary transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-medium text-text-secondary">
            연속 출석
          </span>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-text-primary">12일째</span>
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-sm text-text-secondary">남은 미션</span>
          <span className="font-semibold text-text-primary">3개</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: "40%" }}
          />
        </div>
      </div>
    </div>
  );
};
