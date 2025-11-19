"use client";
import React from "react";
import { StockHolding } from "@/lib/types/stock";

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
      <div className="text-center text-text-secondary py-8 bg-gray-50 rounded-2xl">
        자산 데이터가 없습니다.
      </div>
    );
  }

  // Pastel color palette
  const COLORS = [
    "#FF8787", // Red
    "#FFC078", // Orange
    "#FFD43B", // Yellow
    "#69DB7C", // Green
    "#74C0FC", // Blue
    "#B197FC", // Purple
    "#CED4DA", // Gray
  ];

  const data = [
    { name: "현금", value: cash, color: "#E9ECEF" }, // Light gray for cash
    ...holdings.map((h, i) => ({
      name: h.stockName,
      value: h.shares * h.currentPrice,
      color: COLORS[i % COLORS.length],
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
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="transform -rotate-90 w-full h-full"
        >
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="16"
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              transform={`rotate(${segment.rotation} 50 50)`}
              className="transition-all duration-500 ease-out hover:opacity-80"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-text-secondary font-medium">
            총 자산
          </span>
          <span className="font-bold text-lg text-text-primary">
            {(totalPortfolioValue / 10000).toFixed(0)}만원
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
        {segments.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm py-1"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-text-secondary truncate">{item.name}</span>
            </div>
            <span className="font-bold text-text-primary whitespace-nowrap">
              {(item.percent * 100).toFixed(1)}%
            </span>
          </div>
        ))}
        {segments.length > 6 && (
          <div className="text-xs text-text-tertiary col-span-2 text-center pt-2">
            외 {segments.length - 6}개 항목
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
