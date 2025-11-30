"use client";
import React from "react";

interface SectorItem {
  name: string;
  change: string; // e.g., "+3.5%"
  reason: string;
}

interface SectorHeatmapProps {
  data: {
    sectors: SectorItem[];
  };
}

const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-text-primary px-1 mb-4">
        섹터 현황
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {data.sectors.map((sector, index) => {
          const change = sector.change || "";
          const isUp = change.startsWith("+");
          // Use very subtle backgrounds
          const bgColor = isUp
            ? "bg-[#FFF5F5] dark:bg-[#2C1818]" // Very light red
            : change.startsWith("-")
            ? "bg-[#F5F9FF] dark:bg-[#18202C]" // Very light blue
            : "bg-bg-third";

          const textColor = isUp
            ? "text-toss-red"
            : change.startsWith("-")
            ? "text-toss-blue"
            : "text-text-secondary";

          return (
            <div
              key={index}
              className={`p-5 rounded-2xl ${bgColor} flex flex-col justify-between min-h-[140px] transition-transform active:scale-95 duration-200`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-text-primary text-lg leading-tight break-keep">
                    {sector.name}
                  </span>
                </div>
                <span className={`font-bold text-sm ${textColor}`}>
                  {sector.change}
                </span>
              </div>

              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mt-3">
                {sector.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorHeatmap;
