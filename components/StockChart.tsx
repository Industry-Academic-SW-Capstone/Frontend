"use client";
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { ChartData, ChartDataPoint, PeriodType } from "@/lib/types/stock";
import { useStockChart } from "@/lib/hooks/stock/useStockChart";
import { FaChartLine } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
import { useWebSocket } from "@/lib/providers/SocketProvider";
import { useChartStore } from "@/lib/stores/useChartStore";
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

  // Socket & Store
  const { setSubscribeSet } = useWebSocket();
  const {
    chartDatas: realTimeChartDatas,
    setPeriodType,
    initializeChartData,
    reset: resetChartStore,
  } = useChartStore();

  // 빈 티커 코드가 오면 데이터 fetch 안 함
  const {
    data: chartDatas,
    isLoading: isChartLoading,
    refetch: refetchChartData,
  } = useStockChart(stockCode || "", period);

  // Subscribe to socket on mount or stockCode change
  useEffect(() => {
    if (stockCode) {
      setSubscribeSet([stockCode]);
    }
    return () => {
      // Optional: Unsubscribe or clear store on unmount
      // resetChartStore(); // Might not want to reset if we want to keep cache, but usually good to reset
    };
  }, [stockCode, setSubscribeSet]);

  // Handle period change
  useEffect(() => {
    setPeriodType(period);
    // When period changes, we wait for new chartDatas to initialize
  }, [period, setPeriodType]);

  const periods: PeriodType[] = ["1day", "1week", "3month", "1year", "5year"];
  const activeIndex = periods.indexOf(period); // 현재 선택된 탭의 인덱스 (0~4)

  // Initialize store when chartDatas is loaded
  useEffect(() => {
    if (chartDatas && chartDatas.length > 0) {
      initializeChartData(chartDatas);
    }
  }, [chartDatas, initializeChartData]);

  const sortedChartDatas = useMemo(() => {
    // Merge historical and real-time data
    // historical: chartDatas
    // realTime: realTimeChartDatas

    let historical = chartDatas || [];

    // Ensure historical data is sorted chronologically (oldest first)
    // The API seems to return data, check if it needs sorting.
    // Existing code checked for reverse:
    if (
      historical.length > 1 &&
      new Date(historical[0].date) >
        new Date(historical[historical.length - 1].date)
    ) {
      historical = [...historical].reverse();
    }

    if (realTimeChartDatas.length > 0) {
      // If we have real-time data, we replace the last part of historical data
      // or append to it.
      // Strategy: Take historical data up to the point where real-time data starts.
      // Since initializeChartData takes the *last* element of historical as the first of realTime,
      // we can just take historical.slice(0, -1) and concat realTimeChartDatas.

      if (historical.length > 0) {
        return [...historical.slice(0, -1), ...realTimeChartDatas];
      }
      return realTimeChartDatas;
    }

    return historical;
  }, [chartDatas, realTimeChartDatas]);

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
      if (!sortedChartDatas || sortedChartDatas.length === 0)
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
      const closePrices = sortedChartDatas.map((p: ChartData) => p.closePrice);
      const highPrices = sortedChartDatas.map(
        (p: ChartData) => p.highPrice || p.closePrice
      ); // Fallback to close if high is missing
      const lowPrices = sortedChartDatas.map(
        (p: ChartData) => p.lowPrice || p.closePrice
      );
      const volumes = sortedChartDatas.map((p: ChartData) => p.volume || 0);

      // Calculate min/max with some padding or exact
      const min = Math.min(...lowPrices);
      const max = Math.max(...highPrices);
      const maxVol = Math.max(...volumes);
      const range = max - min === 0 ? 1 : max - min;

      // 최고가/최저가 인덱스 찾기
      const maxPriceIndex = highPrices.indexOf(max);
      const minPriceIndex = lowPrices.indexOf(min);

      const points = sortedChartDatas.map((point: ChartData, i: number) => {
        const x = (i / (sortedChartDatas.length - 1)) * width;
        const y = mainHeight - ((point.closePrice - min) / range) * mainHeight;
        return { x, y };
      });

      const vBars = sortedChartDatas.map((point: ChartData, i: number) => {
        const x = (i / (sortedChartDatas.length - 1)) * width;
        const barHeight =
          maxVol === 0 ? 0 : ((point.volume || 0) / maxVol) * volumeHeight;
        return {
          x: x - width / sortedChartDatas.length / 2 + 1,
          y: volumeHeight - barHeight,
          width: Math.max(1, width / sortedChartDatas.length - 2),
          height: barHeight,
        };
      });

      // Candlestick 데이터 생성
      const candles = sortedChartDatas.map((point: ChartData, i: number) => {
        const x = (i / (sortedChartDatas.length - 1)) * width;
        const candleWidth = Math.max(2, width / sortedChartDatas.length - 1);

        // 시가, 종가, 고가, 저가 (실제 데이터가 없으면 closePrice로 대체)
        const open = point.openPrice || point.closePrice;
        const close = point.closePrice;
        const high = point.highPrice || point.closePrice;
        const low = point.lowPrice || point.closePrice;

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
          .map(
            (p: { x: number; y: number }) =>
              `${p.x.toFixed(2)},${p.y.toFixed(2)}`
          )
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
        const closePrices = sortedChartDatas.map(
          (p: ChartData) => p.closePrice
        );
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
        const closePrices = sortedChartDatas.map(
          (p: ChartData) => p.closePrice
        );
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
                {candlesticks.map((candle: any, i: number) => (
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
          <g transform={`translate(0, ${mainHeight})`}>
            {volumeBars.map((bar: any, i: number) => (
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
            className="absolute z-[1000] p-2 text-xs rounded-lg shadow-lg pointer-events-none bg-bg-secondary border border-border-color"
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
      <div className="flex w-full bg-bg-primary p-1 rounded-lg mt-2">
        {/* 2. 기간 선택 버튼들만 감싸는 그룹 (Relative Wrapper) */}
        <div className="relative flex flex-1 items-center">
          {/* 3. 슬라이딩 배경 (움직이는 하얀 박스) */}
          <div
            className="absolute h-full w-1/5 bg-bg-secondary rounded-md shadow-sm transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${activeIndex * 100}%)`, // 인덱스에 따라 100%씩 이동
            }}
          />

          {/* 버튼들 */}
          {periods.map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              // z-10과 relative를 줘서 슬라이딩 배경보다 위에 글씨가 뜨게 함
              className={`relative z-10 w-1/5 py-2 text-sm font-semibold rounded-md transition-colors ${
                period === t ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {t === "1day" && "1일"}
              {t === "1week" && "1주"}
              {t === "3month" && "3달"}
              {t === "1year" && "1년"}
              {t === "5year" && "5년"}
            </button>
          ))}
        </div>

        {/* 4. 차트 토글 버튼 (슬라이딩 그룹 밖으로 분리) */}
        <button
          className="h-9 w-9 ml-1 shrink-0 rounded-md transition-colors bg-bg-secondary text-text-primary shadow-sm flex items-center justify-center"
          onClick={() => {
            if (chartMode === "line") setChartMode("candle");
            else setChartMode("line");
          }}
        >
          {chartMode !== "line" ? (
            <FaChartColumn size={16} color="#1e293b" />
          ) : (
            <FaChartLine size={16} color="#1e293b" />
          )}
        </button>
      </div>
    </div>
  );
};

export default StockChart;
