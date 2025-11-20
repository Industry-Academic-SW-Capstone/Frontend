"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { Star } from "lucide-react";
import {
  MOCK_CHART_DATA,
  MOCK_FAVORITE_STOCKS,
} from "@/components/about/constants";

interface DemoStockDetailScreenProps {
  stockCode: string;
  onBack: () => void;
}

export const DemoStockDetailScreen: React.FC<DemoStockDetailScreenProps> = ({
  stockCode,
  onBack,
}) => {
  const stock =
    MOCK_FAVORITE_STOCKS.find((s) => s.stockCode === stockCode) ||
    MOCK_FAVORITE_STOCKS[0];

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="font-bold text-lg">{stock.stockName}</h2>
        <button className="p-2 -mr-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </button>
      </div>

      {/* Price Info */}
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          {Number(stock.currentPrice).toLocaleString()}원
        </h1>
        <p
          className={`text-lg font-medium mt-1 ${
            stock.changeRate >= 0 ? "text-red-500" : "text-blue-500"
          }`}
        >
          {stock.changeRate > 0 ? "+" : ""}
          {stock.changeRate}%
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 w-full px-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_CHART_DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Order Buttons */}
      <div className="mt-auto p-4 flex gap-3 pb-8">
        <button className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform">
          매도
        </button>
        <button className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 active:scale-95 transition-transform">
          매수
        </button>
      </div>
    </div>
  );
};
