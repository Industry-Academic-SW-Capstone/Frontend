"use client";
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ChartDataPoint } from '@/lib/types';

type Timeframe = 'day' | 'week' | 'month' | 'year';

interface StockChartProps {
  data: {
    day: ChartDataPoint[];
    week: ChartDataPoint[];
    month: ChartDataPoint[];
    year: ChartDataPoint[];
  };
  isPositive: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, isPositive }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('day');
  const [hoverData, setHoverData] = useState<{ x: number, y: number, point: ChartDataPoint } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const activeData = data[timeframe];
  const chartColor = isPositive ? 'stroke-positive' : 'stroke-negative';
  const chartFillColor = isPositive ? '#22c55e' : '#ef4444';

  const width = 300;
  const mainHeight = 150;
  const volumeHeight = 40;
  const yAxisWidth = 50;

  const { path, volumeBars, minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (!activeData || activeData.length === 0) return { path: '', volumeBars: [], minPrice: 0, maxPrice: 0, maxVolume: 0 };

    const prices = activeData.map(p => p.price);
    const volumes = activeData.map(p => p.volume || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const maxVol = Math.max(...volumes);
    const range = max - min === 0 ? 1 : max - min;

    const points = activeData.map((point, i) => {
      const x = (i / (activeData.length - 1)) * width;
      const y = mainHeight - ((point.price - min) / range) * mainHeight;
      return {x, y};
    });
    
    const vBars = activeData.map((point, i) => {
        const x = (i / (activeData.length - 1)) * width;
        const barHeight = ((point.volume || 0) / maxVol) * volumeHeight;
        return {
            x: x - (width / activeData.length / 2) + 1,
            y: volumeHeight - barHeight,
            width: Math.max(1, (width / activeData.length) - 2),
            height: barHeight
        }
    });

    return {
      path: `M ${points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' L ')}`,
      volumeBars: vBars,
      minPrice: min,
      maxPrice: max,
      maxVolume: maxVol,
    };
  }, [activeData]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !activeData || activeData.length === 0) return;
    
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    
    const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const index = Math.round((cursorPoint.x / width) * (activeData.length - 1));

    if (index >= 0 && index < activeData.length) {
      const point = activeData[index];
      const prices = activeData.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const range = max - min === 0 ? 1 : max - min;
      
      const x = (index / (activeData.length - 1)) * width;
      const y = mainHeight - ((point.price - min) / range) * mainHeight;

      setHoverData({ x, y, point });
    }
  }, [activeData]);

  const yAxisLabels = useMemo(() => {
      if (maxPrice === minPrice) return [minPrice.toLocaleString()];
      const midPrice = (maxPrice + minPrice) / 2;
      return [maxPrice.toLocaleString(), midPrice.toLocaleString(), minPrice.toLocaleString()];
  }, [minPrice, maxPrice]);

  return (
    <div>
      <div className="relative w-full">
        <svg 
          ref={svgRef} 
          viewBox={`0 0 ${width + yAxisWidth} ${mainHeight + volumeHeight + 10}`} 
          className="w-full h-auto overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverData(null)}
        >
          {/* Main Chart */}
          <g transform={`translate(0, 0)`}>
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartFillColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={chartFillColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${path} L ${width},${mainHeight} L 0,${mainHeight} Z`} fill="url(#chartGradient)" />
            <path d={path} fill="none" className={chartColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Crosshair */}
            {hoverData && (
                <>
                    <line x1={hoverData.x} y1="0" x2={hoverData.x} y2={mainHeight} stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1={hoverData.y} x2={width} y2={hoverData.y} stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx={hoverData.x} cy={hoverData.y} r="4" fill={chartFillColor} stroke="var(--bg-primary)" strokeWidth="2" />
                </>
            )}
          </g>

          {/* Volume Chart */}
          <g transform={`translate(0, ${mainHeight + 10})`}>
            {volumeBars.map((bar, i) => (
              <rect key={i} x={bar.x} y={bar.y} width={bar.width} height={bar.height} fill={chartFillColor} opacity="0.4" />
            ))}
          </g>

          {/* Y-Axis labels */}
          <g transform={`translate(${width + 5}, 0)`}>
            <text y="12" fill="var(--text-secondary)" fontSize="10">{yAxisLabels[0]}</text>
            <text y={mainHeight / 2 + 3} fill="var(--text-secondary)" fontSize="10">{yAxisLabels[1]}</text>
            <text y={mainHeight} fill="var(--text-secondary)" fontSize="10">{yAxisLabels[2]}</text>
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoverData && (
            <div 
                className="absolute p-2 text-xs rounded-lg shadow-lg pointer-events-none bg-bg-secondary border border-border-color"
                style={{
                    left: `${(hoverData.x / width) * 100}%`,
                    top: `0px`,
                    transform: `translateX(-50%) translateY(-110%)`,
                    minWidth: '100px',
                    textAlign: 'center',
                }}
            >
                <p className="font-bold">{hoverData.point.price.toLocaleString()}원</p>
                <p className="text-text-secondary">{hoverData.point.date}</p>
            </div>
        )}
      </div>

      <div className="flex justify-center bg-bg-secondary p-1 rounded-lg mt-2">
        {(['day', 'week', 'month', 'year'] as Timeframe[]).map(t => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`w-1/4 py-2 text-sm font-semibold rounded-md transition-colors ${
              timeframe === t ? 'bg-bg-primary text-text-primary shadow-sm' : 'text-text-secondary'
            }`}
          >
            {t === 'day' && '1일'}
            {t === 'week' && '1주'}
            {t === 'month' && '1달'}
            {t === 'year' && '1년'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockChart;
