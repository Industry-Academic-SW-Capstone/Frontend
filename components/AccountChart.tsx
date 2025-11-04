"use client";
import React from 'react';
import { ChartDataPoint } from '@/lib/types';

interface AccountChartProps {
  data: ChartDataPoint[];
  isPositive: boolean;
}

const AccountChart: React.FC<AccountChartProps> = ({ data, isPositive }) => {
  const chartColor = isPositive ? 'stroke-positive' : 'stroke-negative';

  const path = React.useMemo(() => {
    if (!data || data.length < 2) return '';

    const prices = data.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min === 0 ? 1 : max - min;
    const width = 300;
    const height = 100;

    const points = data.map((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((point.price - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data]);

  if (!data || data.length < 2) {
      return (
          <div className="w-full h-[100px] flex items-center justify-center bg-bg-secondary rounded-lg">
              <p className="text-text-secondary">차트 데이터가 부족합니다.</p>
          </div>
      )
  }

  return (
    <div className="w-full h-[100px]">
        <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="accountChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${path} L 300,100 L 0,100 Z`} fill="url(#accountChartGradient)" />
            <path d={path} fill="none" className={chartColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
  );
};

export default AccountChart;
