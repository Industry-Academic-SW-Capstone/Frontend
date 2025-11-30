"use client";
import React from "react";
import { motion } from "framer-motion";

interface MarketGaugeProps {
  data: {
    score: number; // 0-100
    label: string; // e.g., "탐욕", "공포"
  };
  rawData?: any;
}

const MarketGauge: React.FC<MarketGaugeProps> = ({ data }) => {
  const rotation = (data.score / 100) * 180 - 90; // -90 to 90

  return (
    <div className="p-6 bg-[#333D4B] rounded-3xl mb-4 flex flex-col items-center text-white shadow-lg">
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white/90">시장 분위기</h3>
        <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/80 backdrop-blur-sm">
          {data.score}점
        </div>
      </div>

      <div className="relative w-48 h-24 overflow-hidden mb-4">
        {/* Gauge Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-t-full" />

        {/* Gauge Needle */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
          className="absolute bottom-0 left-1/2 w-1.5 h-24 bg-white origin-bottom -translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />

        {/* Center Pivot */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 translate-y-1/2 shadow-lg z-10" />
      </div>

      <div className="text-3xl font-bold text-white mb-1">{data.label}</div>
      <div className="text-sm text-white/60 font-medium">공포/탐욕 지수</div>
    </div>
  );
};

export default MarketGauge;
