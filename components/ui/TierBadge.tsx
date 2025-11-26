import React from "react";
import { Tier } from "@/lib/types/stock";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

const tierStyles: Record<
  Tier,
  {
    bg: string;
    text: string;
    border: string;
    icon: string;
    label: string;
    gradient: string;
  }
> = {
  Bronze: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: "🥉",
    label: "Bronze",
    gradient: "from-orange-400 to-orange-600",
  },
  Silver: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-600",
    icon: "🥈",
    label: "Silver",
    gradient: "from-slate-300 to-slate-500",
  },
  Gold: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "🥇",
    label: "Gold",
    gradient: "from-yellow-300 to-yellow-500",
  },
  Platinum: {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    icon: "💎",
    label: "Platinum",
    gradient: "from-cyan-300 to-cyan-500",
  },
  Legend: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    icon: "👑",
    label: "Legend",
    gradient: "from-purple-400 to-purple-600",
  },
};

const sizeStyles = {
  sm: "text-xs px-1.5 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
  lg: "text-base px-3 py-1.5 gap-2",
  xl: "text-lg px-4 py-2 gap-2.5",
};

const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = "md",
  showLabel = true,
  className = "",
}) => {
  const style = tierStyles[tier];

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full font-bold shadow-sm backdrop-blur-sm
        border ${style.bg} ${style.text} ${style.border} ${sizeStyles[size]}
        ${className}
      `}
    >
      <span className="drop-shadow-sm">{style.icon}</span>
      {showLabel && <span>{style.label}</span>}
    </div>
  );
};

export default TierBadge;
