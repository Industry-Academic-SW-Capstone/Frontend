import React from "react";
import { Competition } from "@/lib/types/stock";
import { CalendarIcon, GiftIcon, ChevronRightIcon } from "./icons/Icons";

interface CompetitionCardProps {
  competition: Competition;
  onClickDetail?: (competition: Competition) => void;
  onAdminClick?: (competition: Competition) => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({
  competition,
  onClickDetail,
  onAdminClick,
}) => {
  // Calculate duration or status
  const now = new Date();
  const start = new Date(competition.startDate);
  const end = new Date(competition.endDate);
  const isActive = now >= start && now <= end;
  const isFinished = now > end;
  const isUpcoming = now < start;

  let statusLabel = "";
  let statusColorClass = "";
  let statusBgClass = "";

  if (isUpcoming) {
    statusLabel = "모집중";
    statusColorClass = "text-primary";
    statusBgClass = "bg-primary/10 border-primary/20";
  } else if (isActive) {
    statusLabel = "진행중";
    statusColorClass = "text-positive";
    statusBgClass = "bg-positive/10 border-positive/20";
  } else {
    statusLabel = "종료";
    statusColorClass = "text-text-secondary";
    statusBgClass = "bg-bg-secondary border-border-color";
  }

  return (
    <div
      onClick={() => onClickDetail?.(competition)}
      className="group relative bg-bg-secondary border border-border-color rounded-2xl p-5 shadow-sm active:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* active Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-2 group-active:text-primary transition-colors line-clamp-1">
            {competition.contestName}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <GiftIcon className="w-4 h-4 text-accent" />
              <span className="font-medium text-text-primary">
                {competition.seedMoney.toLocaleString()}원
              </span>
              <span className="text-xs text-text-tertiary">시드머니</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CalendarIcon className="w-4 h-4 text-text-tertiary" />
              <span>
                {new Date(competition.startDate).toLocaleDateString()} ~{" "}
                {new Date(competition.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-color/50 mt-2">
          <span className="text-xs text-text-tertiary font-medium">
            자세히 보기
          </span>
          <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center group-active:bg-primary group-active:text-white transition-colors duration-300">
            <ChevronRightIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
