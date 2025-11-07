"use client";
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { ChartData, ChartDataPoint, PeriodType } from "@/lib/types/types";
import { useStockChart } from "@/lib/hooks/stock/useStockChart";
import { FaChartLine } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
interface StockChartProps {
  stockCode: string;
  isPositive: boolean;
  setChartStartPrice: React.Dispatch<React.SetStateAction<number | null>>;
}

const StockChart: React.FC<StockChartProps> = ({
  stockCode,
  isPositive,
  setChartStartPrice,
}) => {
  const [period, setPeriod] = useState<PeriodType>("1day");
  const [chartMode, setChartMode] = useState<"line" | "candle">("line");

  // 빈 티커 코드가 오면 데이터 fetch 안 함
  const {
    data: chartDatas,
    isLoading: isChartLoading,
    refetch: refetchChartData,
  } = useStockChart(stockCode || "", period);

  const sortedChartDatas = useMemo(() => {
    if (!chartDatas || chartDatas.length === 0 || isChartLoading) return [];
    if (
      new Date(chartDatas[0].date) >
      new Date(chartDatas[chartDatas.length - 1].date)
    ) {
      return [...chartDatas].reverse();
    } else {
      return chartDatas;
    }
  }, [chartDatas]);

  useEffect(() => {
    if (sortedChartDatas && sortedChartDatas.length > 0) {
      setChartStartPrice(sortedChartDatas[0].closePrice);
    }
  }, [sortedChartDatas, setChartStartPrice]);

  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
    chartData: ChartData;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const chartColor = isPositive ? "stroke-positive" : "stroke-negative";
  const chartFillColor = isPositive ? "#22c55e" : "#ef4444";

  const width = 300;
  const mainHeight = 150;
  const volumeHeight = 40;
  const yAxisWidth = 50;

  const { path, volumeBars, minPrice, maxPrice, maxVolume, candlesticks } =
    useMemo(() => {
      if (!sortedChartDatas || sortedChartDatas.length === 0 || isChartLoading)
        return {
          path: "",
          volumeBars: [],
          minPrice: 0,
          maxPrice: 0,
          maxVolume: 0,
          candlesticks: [],
          maxPriceIndex: 0,
          minPriceIndex: 0,
        };
      const closePrices = sortedChartDatas.map((p) => p.closePrice);
      const highPrices = sortedChartDatas.map((p) => p.highPrice || 0);
      const lowPrices = sortedChartDatas.map((p) => p.lowPrice || 0);
      const volumes = sortedChartDatas.map((p) => p.volume || 0);
      const min = Math.min(...closePrices);
      const max = Math.max(...closePrices);
      const maxVol = Math.max(...volumes);
      const range = max - min === 0 ? 1 : max - min;

      // 최고가/최저가 인덱스 찾기
      const maxPriceIndex = highPrices.indexOf(max);
      const minPriceIndex = lowPrices.indexOf(min);

      const points = sortedChartDatas.map((point, i) => {
        const x = (i / (sortedChartDatas.length - 1)) * width;
        const y = mainHeight - ((point.closePrice - min) / range) * mainHeight;
        return { x, y };
      });

      const vBars = sortedChartDatas.map((point, i) => {
        const x = (i / (sortedChartDatas.length - 1)) * width;
        const barHeight = ((point.volume || 0) / maxVol) * volumeHeight;
        return {
          x: x - width / sortedChartDatas.length / 2 + 1,
          y: volumeHeight - barHeight,
          width: Math.max(1, width / sortedChartDatas.length - 2),
          height: barHeight,
        };
      });

      // Candlestick 데이터 생성
      const candles = sortedChartDatas.map((point, i) => {
        const x = (i / (sortedChartDatas.length - 1)) * width;
        const candleWidth = Math.max(2, width / sortedChartDatas.length - 1);

        // 시가, 종가, 고가, 저가 (실제 데이터가 없으면 closePrice로 대체)
        const open = point.openPrice; // 실제로는 openPrice 사용
        const close = point.closePrice;
        const high = point.highPrice || 0;
        const low = point.lowPrice || 0;

        const isUp = close >= open;

        const highY = mainHeight - ((high - min) / range) * mainHeight;
        const lowY = mainHeight - ((low - min) / range) * mainHeight;
        const openY = mainHeight - ((open - min) / range) * mainHeight;
        const closeY = mainHeight - ((close - min) / range) * mainHeight;

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.abs(closeY - openY) || 1;

        return {
          x,
          candleWidth,
          highY,
          lowY,
          bodyTop,
          bodyHeight,
          isUp,
        };
      });

      return {
        path: `M ${points
          .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
          .join(" L ")}`,
        volumeBars: vBars,
        minPrice: min,
        maxPrice: max,
        maxVolume: maxVol,
        candlesticks: candles,
        maxPriceIndex,
        minPriceIndex,
      };
    }, [sortedChartDatas]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || !sortedChartDatas || sortedChartDatas.length === 0)
        return;

      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;

      const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      const index = Math.round(
        (cursorPoint.x / width) * (sortedChartDatas.length - 1)
      );

      if (index >= 0 && index < sortedChartDatas.length) {
        const chartData = sortedChartDatas[index];
        const closePrices = sortedChartDatas.map((p) => p.closePrice);
        const min = Math.min(...closePrices);
        const max = Math.max(...closePrices);
        const range = max - min === 0 ? 1 : max - min;

        const x = (index / (sortedChartDatas.length - 1)) * width;
        const y =
          mainHeight - ((chartData.closePrice - min) / range) * mainHeight;

        setHoverData({ x, y, chartData });
      }
    },
    [sortedChartDatas]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<SVGSVGElement>) => {
      if (!svgRef.current || !sortedChartDatas || sortedChartDatas.length === 0)
        return;
      if (!isDragging) return;

      event.preventDefault();
      const touch = event.touches[0];
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = touch.clientX;
      pt.y = touch.clientY;

      const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      const index = Math.round(
        (cursorPoint.x / width) * (sortedChartDatas.length - 1)
      );

      if (index >= 0 && index < sortedChartDatas.length) {
        const chartData = sortedChartDatas[index];
        const closePrices = sortedChartDatas.map((p) => p.closePrice);
        const min = Math.min(...closePrices);
        const max = Math.max(...closePrices);
        const range = max - min === 0 ? 1 : max - min;

        const x = (index / (sortedChartDatas.length - 1)) * width;
        const y =
          mainHeight - ((chartData.closePrice - min) / range) * mainHeight;

        setHoverData({ x, y, chartData });
      }
    },
    [sortedChartDatas, isDragging]
  );

  const yAxisLabels = useMemo(() => {
    if (maxPrice === minPrice) return [minPrice.toLocaleString()];
    const midPrice = (maxPrice + minPrice) / 2;
    return [
      maxPrice.toLocaleString(),
      midPrice.toLocaleString(),
      minPrice.toLocaleString(),
    ];
  }, [minPrice, maxPrice]);

  return (
    <div>
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width + yAxisWidth} ${
            mainHeight + volumeHeight + 10
          }`}
          className="w-full h-auto overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverData(null)}
          onTouchStart={() => setIsDragging(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            setIsDragging(false);
            setHoverData(null);
          }}
          style={{ touchAction: "none" }}
        >
          {/* Main Chart */}
          <g transform={`translate(0, 0)`}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartFillColor}
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor={chartFillColor}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {chartMode === "line" ? (
              <>
                <path
                  d={`${path} L ${width},${mainHeight} L 0,${mainHeight} Z`}
                  fill="url(#chartGradient)"
                />
                <path
                  d={path}
                  fill="none"
                  className={chartColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <>
                {/* Candlestick Chart */}
                {candlesticks.map((candle, i) => (
                  <g key={i}>
                    {/* High-Low Line (심지) */}
                    <line
                      x1={candle.x}
                      y1={candle.highY}
                      x2={candle.x}
                      y2={candle.lowY}
                      stroke={candle.isUp ? "#22c55e" : "#ef4444"}
                      strokeWidth="1"
                      opacity="0.6"
                    />
                    {/* Body (봉) */}
                    <rect
                      x={candle.x - candle.candleWidth / 2}
                      y={candle.bodyTop}
                      width={candle.candleWidth}
                      height={candle.bodyHeight}
                      fill={candle.isUp ? "#22c55e" : "#ef4444"}
                      rx="1.5"
                      ry="1.5"
                      opacity="0.9"
                    />
                  </g>
                ))}
              </>
            )}

            {/* 최고가/최저가 선 */}
            {sortedChartDatas && sortedChartDatas.length > 0 && (
              <>
                {/* 최고가 선 */}
                <line
                  x1="0"
                  y1={0}
                  x2={width}
                  y2={0}
                  stroke="#22c55e"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.5"
                />
                <text
                  x={width - 5}
                  y={-3}
                  fill="#22c55e"
                  fontSize="10"
                  textAnchor="end"
                  fontWeight="600"
                >
                  최고 {maxPrice.toLocaleString()}
                </text>

                {/* 최저가 선 */}
                <line
                  x1="0"
                  y1={mainHeight}
                  x2={width}
                  y2={mainHeight}
                  stroke="#9ea6b0"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.5"
                />
                <text
                  x={width - 5}
                  y={mainHeight - 3}
                  fill="#9ea6b0"
                  fontSize="10"
                  textAnchor="end"
                  fontWeight="600"
                >
                  최저 {minPrice.toLocaleString()}
                </text>
              </>
            )}

            {/* Crosshair */}
            {hoverData && (
              <>
                <line
                  x1={hoverData.x}
                  y1="0"
                  x2={hoverData.x}
                  y2={mainHeight}
                  stroke="var(--text-secondary)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <line
                  x1="0"
                  y1={hoverData.y}
                  x2={width}
                  y2={hoverData.y}
                  stroke="var(--text-secondary)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <circle
                  cx={hoverData.x}
                  cy={hoverData.y}
                  r="4"
                  fill={chartFillColor}
                  stroke="var(--bg-primary)"
                  strokeWidth="2"
                />
              </>
            )}
          </g>

          {/* Volume Chart */}
          <g transform={`translate(0, ${mainHeight + 10})`}>
            {volumeBars.map((bar, i) => (
              <rect
                key={i}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={chartFillColor}
                opacity="0.4"
              />
            ))}
          </g>

          {/* Y-Axis labels */}
          <g transform={`translate(${width + 5}, 0)`}>
            <text y="12" fill="var(--text-secondary)" fontSize="10">
              {yAxisLabels[0]}
            </text>
            <text
              y={mainHeight / 2 + 3}
              fill="var(--text-secondary)"
              fontSize="10"
            >
              {yAxisLabels[1]}
            </text>
            <text y={mainHeight} fill="var(--text-secondary)" fontSize="10">
              {yAxisLabels[2]}
            </text>
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoverData && (
          <div
            className="absolute p-2 text-xs rounded-lg shadow-lg pointer-events-none bg-bg-secondary border border-border-color"
            style={{
              left: `${(hoverData.x / width) * 100}%`,
              top: `0px`,
              transform:
                hoverData.x / width < 0.2
                  ? `translateX(0%) translateY(-110%)`
                  : hoverData.x / width > 0.8
                  ? `translateX(-100%) translateY(-110%)`
                  : `translateX(-50%) translateY(-110%)`,
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            <p className="font-bold">
              {hoverData.chartData.closePrice.toLocaleString()}원
            </p>
            <p className="text-text-secondary">{hoverData.chartData.date}</p>
            {hoverData.chartData.time && (
              <p className="text-text-secondary">{hoverData.chartData.time}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex w-full justify-center bg-bg-secondary p-1 rounded-lg mt-2">
        {(["1day", "1week", "3month", "1year", "5year"] as PeriodType[]).map(
          (t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`w-2/11 py-2 text-sm font-semibold rounded-md transition-colors ${
                period === t
                  ? "bg-bg-primary text-text-primary shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              {t === "1day" && "1일"}
              {t === "1week" && "1주"}
              {t === "3month" && "3달"}
              {t === "1year" && "1년"}
              {t === "5year" && "5년"}
            </button>
          )
        )}
        <button
          className={`h-9 w-9 ml-1 rounded-md transition-colors bg-bg-primary text-text-primary shadow-sm flex items-center justify-center`}
          onClick={() => {
            if (chartMode === "line") setChartMode("candle");
            else setChartMode("line");
          }}
        >
          {chartMode !== "line" ? (
            <FaChartColumn size={16} color="1e293b" />
          ) : (
            <FaChartLine size={16} color="1e293b" />
          )}
        </button>
      </div>
    </div>
  );
};

export default StockChart;
