"use client";
import React from "react";
import { StockHolding } from "@/lib/types/types";

interface PortfolioDonutChartProps {
  holdings: StockHolding[];
  cash: number;
}

const DonutChart: React.FC<PortfolioDonutChartProps> = ({ holdings, cash }) => {
  const totalHoldingsValue = holdings.reduce(
    (sum, h) => sum + h.shares * h.currentPrice,
    0
  );
  const totalPortfolioValue = totalHoldingsValue + cash;

  if (totalPortfolioValue === 0) {
    return (
      <div className="text-center text-text-secondary">
        자산 데이터가 없습니다.
      </div>
    );
  }

  const data = [
    { name: "현금", value: cash, color: "#a5b4fc" },
    ...holdings.map((h, i) => ({
      name: h.name,
      value: h.shares * h.currentPrice,
      color: ["#f87171", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#c084fc"][
        i % 6
      ],
    })),
  ].sort((a, b) => b.value - a.value);

  let accumulated = 0;
  const segments = data.map((item) => {
    const percent = item.value / totalPortfolioValue;
    const dashArray = 2 * Math.PI * 40;
    const dashOffset = dashArray * (1 - percent);
    const rotation = accumulated * 360;
    accumulated += percent;
    return { ...item, percent, dashArray, dashOffset, rotation };
  });

  return (
    <div className="bg-bg-secondary p-4 rounded-2xl border border-border-color flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              transform={`rotate(${segment.rotation} 50 50)`}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-text-secondary">총 자산</span>
          <span className="font-bold text-lg text-text-primary">
            {totalPortfolioValue.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className="w-full flex-1">
        <ul className="space-y-2">
          {segments.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-text-primary">{item.name}</span>
              </div>
              <div className="font-semibold text-text-primary">
                {item.value.toLocaleString()}원
                <span className="text-xs text-text-secondary ml-2">
                  ({(item.percent * 100).toFixed(1)}%)
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonutChart;
