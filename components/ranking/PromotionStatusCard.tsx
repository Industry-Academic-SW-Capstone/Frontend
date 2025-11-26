import React from "react";
import { TierInfo } from "@/lib/types/stock";
import TierBadge from "@/components/ui/TierBadge";

interface PromotionStatusCardProps {
  tierInfo: TierInfo;
}

const PromotionStatusCard: React.FC<PromotionStatusCardProps> = ({
  tierInfo,
}) => {
  if (tierInfo.promotionStatus !== "in_progress") return null;

  const progressPercent =
    tierInfo.promotionProgress && tierInfo.promotionTarget
      ? Math.min(
          (tierInfo.promotionProgress / tierInfo.promotionTarget) * 100,
          100
        )
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-secondary to-bg-third p-5 shadow-lg border-2 border-primary/20 animate-pulse-subtle">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-text-primary">
              승급전 진행 중!
            </h3>
          </div>
          <div className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
            D-3
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-4">
          다음 티어로 승급하기 위한 마지막 관문입니다.
          <br />
          아래 미션을 달성하면 즉시 승급됩니다!
        </p>

        <div className="bg-bg-primary rounded-xl p-4 border border-border-color mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              🎯
            </div>
            <p className="font-bold text-text-primary text-sm">
              {tierInfo.promotionMission}
            </p>
          </div>

          {tierInfo.promotionTarget && (
            <div className="mt-3">
              <div className="flex justify-between text-xs font-bold text-text-secondary mb-1">
                <span>진행도</span>
                <span className="text-accent">
                  {tierInfo.promotionProgress} / {tierInfo.promotionTarget}
                </span>
              </div>
              <div className="w-full h-2 bg-bg-third rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary font-medium">승급 시</span>
          <div className="flex items-center gap-2">
            <TierBadge tier={tierInfo.currentTier} size="sm" />
            <span className="text-text-secondary">→</span>
            {/* Logic to show next tier could be added here, for now just showing an arrow */}
            <span className="font-bold text-accent">Next Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionStatusCard;
