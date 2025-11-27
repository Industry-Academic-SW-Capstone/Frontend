"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChartData, PeriodType } from "@/lib/types/stock";
import { FaChartLine, FaChartColumn } from "react-icons/fa6";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { useAccountAssets } from "@/lib/hooks/useAccount";

interface StockChartProps {
  stockCode: string;
  isPositive: boolean;
  period: PeriodType;

  setPeriod: (period: PeriodType) => void;
  setPeriodType: (periodType: PeriodType) => void;
  mergedChartDatas: ChartData[];
  setChartStartPrice: React.Dispatch<React.SetStateAction<number | null>>;
}

const StockChart: React.FC<StockChartProps> = ({
  stockCode,
  isPositive,
  setChartStartPrice,
  period,
  setPeriod,
  setPeriodType,
  mergedChartDatas,
}) => {
  const [chartMode, setChartMode] = useState<"line" | "candle">("line");

  const { selectedAccount } = useAccountStore();
  const { data: assets } = useAccountAssets(selectedAccount?.id);

  // --- Zoom & Pan State ---
  // viewStartIndex: 화면에 보여질 첫 데이터의 인덱스 (0 ~ length-visibleCount)
  const [viewStartIndex, setViewStartIndex] = useState(0);
  // visibleCount: 현재 화면에 보여질 데이터 개수 (Zoom Level)
  const [visibleCount, setVisibleCount] = useState(0);

  // --- Refs for Touch/Drag Logic ---
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{
    dist: number; // 핀치 거리
    startIndex: number; // 제스처 시작 시점의 start index
    visibleCount: number; // 제스처 시작 시점의 count
    mode:
      | "none"
      | "pinch"
      | "pan"
      | "scroll-window"
      | "scroll-left"
      | "scroll-right";
    startX: number; // 드래그 시작 X 좌표
  }>({
    dist: 0,
    startIndex: 0,
    visibleCount: 0,
    mode: "none",
    startX: 0,
  });

  useEffect(() => {
    setPeriodType(period);
  }, [period, setPeriodType]);

  const periods: PeriodType[] = ["1day", "1week", "3month", "1year", "5year"];
  const activeIndex = periods.indexOf(period);

  // --- State Tracking Refs ---
  const prevPeriodRef = useRef<PeriodType>(period);
  const prevDataLengthRef = useRef<number>(0);

  // 데이터 로드 및 업데이트 시 Zoom 상태 관리
  useEffect(() => {
    const currentLength = mergedChartDatas.length;
    const prevLength = prevDataLengthRef.current;
    const prevPeriod = prevPeriodRef.current;

    // 1. 기간이 바뀌었거나, 데이터가 처음 로드되는 경우 (Reset)
    if (period !== prevPeriod || (prevLength === 0 && currentLength > 0)) {
      setViewStartIndex(0);
      setVisibleCount(currentLength);
      if (currentLength > 0) {
        setChartStartPrice(mergedChartDatas[0].closePrice);
      }
    }
    // 2. 데이터가 추가된 경우 (Real-time Update)
    else if (currentLength > prevLength) {
      const addedCount = currentLength - prevLength;

      // 현재 사용자가 "가장 최신 데이터"를 보고 있었는지 확인
      // (viewStartIndex + visibleCount 가 이전 데이터 길이와 거의 일치하는지)
      // 약간의 오차 허용 (예: 1개 정도)
      const isAtEnd = viewStartIndex + visibleCount >= prevLength - 1;

      if (isAtEnd) {
        // 최신 데이터를 보고 있었다면:
        // 1. Zoom Level(visibleCount)은 유지 (단, 전체 보기 상태였다면 늘려줌)
        // 2. View Start Index를 이동시켜서 새 데이터가 보이게 함

        if (visibleCount >= prevLength) {
          // 전체를 보고 있었다면 계속 전체를 보여줌
          setVisibleCount(currentLength);
          setViewStartIndex(0);
        } else {
          // 줌 상태였다면, 오른쪽으로 스크롤 (새 데이터가 들어온 만큼 start index 증가)
          // visibleCount는 유지
          const newStartIndex = viewStartIndex + addedCount;
          setViewStartIndex(newStartIndex);
        }
      } else {
        // 과거 데이터를 보고 있었다면:
        // 아무것도 하지 않음 (현재 뷰 유지)
        // 다만, start index나 visibleCount가 범위를 벗어나지 않도록 clamp는 필요할 수 있음 (render logic에서 처리됨)
      }
    }

    // Refs 업데이트
    prevPeriodRef.current = period;
    prevDataLengthRef.current = currentLength;
  }, [
    mergedChartDatas,
    period,
    setChartStartPrice,
    viewStartIndex,
    visibleCount,
  ]);

  // --- Derived Visible Data ---
  const visibleDatas = useMemo(() => {
    if (!mergedChartDatas || mergedChartDatas.length === 0) return [];

    // Safety checks
    const total = mergedChartDatas.length;
    const count = Math.max(5, Math.min(total, visibleCount || total)); // 최소 5개
    const start = Math.max(0, Math.min(total - count, viewStartIndex));

    return mergedChartDatas.slice(start, start + count);
  }, [mergedChartDatas, viewStartIndex, visibleCount]);

  // --- Constants ---
  const width = 300;
  const mainHeight = 150;
  const volumeHeight = 40;
  const yAxisWidth = 50;
  const chartColor = isPositive ? "stroke-positive" : "stroke-negative";
  const chartFillColor = isPositive
    ? "var(--color-positive)"
    : "var(--color-negative)";

  // --- Main Chart Rendering Logic ---
  const {
    path,
    volumeBars,
    minPrice,
    maxPrice,
    holdPriceY,
    currentHoldPrice,
    candlesticks,
    yAxisLabels,
  } = useMemo(() => {
    if (!visibleDatas || visibleDatas.length === 0)
      return {
        path: "",
        volumeBars: [],
        minPrice: 0,
        maxPrice: 0,
        currentHoldPrice: 0,
        holdPriceY: null,
        candlesticks: [],
        yAxisLabels: ["0", "0", "0"],
      };

    const closePrices = visibleDatas.map((p) => p.closePrice);
    const highPrices = visibleDatas.map((p) => p.highPrice || p.closePrice);
    const lowPrices = visibleDatas.map((p) => p.lowPrice || p.closePrice);
    const volumes = visibleDatas.map((p) => p.volume || 0);

    const currentHoldPrice = assets?.holdings.find(
      (h) => h.stockCode === stockCode
    )?.averagePrice;

    const min = Math.min(...lowPrices);
    const max = Math.max(...highPrices);
    const maxVol = Math.max(...volumes);

    const range = max - min === 0 ? 1 : max - min;
    const padding = range * 0.1;
    const paddedMax = max + padding;
    const paddedMin = min - padding;
    const paddedRange = paddedMax - paddedMin;

    const holdPriceY =
      currentHoldPrice &&
      currentHoldPrice > paddedMin &&
      currentHoldPrice < paddedMax
        ? mainHeight -
          ((currentHoldPrice - paddedMin) / paddedRange) * mainHeight
        : null;

    const points = visibleDatas.map((point, i) => {
      const x = (i / (visibleDatas.length - 1)) * width;
      const y =
        mainHeight -
        ((point.closePrice - paddedMin) / paddedRange) * mainHeight;
      return { x, y };
    });

    const vBars = visibleDatas.map((point, i) => {
      const x = (i / (visibleDatas.length - 1)) * width;
      const barHeight =
        maxVol === 0 ? 0 : ((point.volume || 0) / maxVol) * volumeHeight;
      return {
        x: x - width / visibleDatas.length / 2 + 0.5,
        y: volumeHeight - barHeight,
        width: Math.max(1, width / visibleDatas.length - 1),
        height: barHeight,
      };
    });

    const candles = visibleDatas.map((point, i) => {
      const x = (i / (visibleDatas.length - 1)) * width;
      const candleWidth = Math.max(2, (width / visibleDatas.length) * 0.7);
      const open = point.openPrice || point.closePrice;
      const close = point.closePrice;
      const high = point.highPrice || point.closePrice;
      const low = point.lowPrice || point.closePrice;
      const isUp = close >= open;

      const highY =
        mainHeight - ((high - paddedMin) / paddedRange) * mainHeight;
      const lowY = mainHeight - ((low - paddedMin) / paddedRange) * mainHeight;
      const openY =
        mainHeight - ((open - paddedMin) / paddedRange) * mainHeight;
      const closeY =
        mainHeight - ((close - paddedMin) / paddedRange) * mainHeight;

      return {
        x,
        candleWidth,
        highY,
        lowY,
        bodyTop: Math.min(openY, closeY),
        bodyHeight: Math.abs(closeY - openY) || 1,
        isUp,
      };
    });

    return {
      path: `M ${points
        .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" L ")}`,
      volumeBars: vBars,
      minPrice: paddedMin,
      maxPrice: paddedMax,
      holdPriceY,
      currentHoldPrice,
      candlesticks: candles,
      yAxisLabels: [
        paddedMax.toLocaleString(),
        ((paddedMax + paddedMin) / 2).toLocaleString(),
        paddedMin.toLocaleString(),
      ],
    };
  }, [visibleDatas, stockCode, assets]);

  // --- Interaction Handlers ---
  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
    chartData: ChartData;
  } | null>(null);

  const updateTooltip = (clientX: number) => {
    if (!svgRef.current || !visibleDatas || visibleDatas.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPos = clientX - rect.left;

    // Scale X to SVG width
    const svgX = (xPos / rect.width) * width;
    const index = Math.round((svgX / width) * (visibleDatas.length - 1));

    if (index >= 0 && index < visibleDatas.length) {
      const d = visibleDatas[index];
      const x = (index / (visibleDatas.length - 1)) * width;
      const range = maxPrice - minPrice || 1;
      const y = mainHeight - ((d.closePrice - minPrice) / range) * mainHeight;
      setHoverData({ x, y, chartData: d });
    }
  };

  // --- Main Chart Touch Handlers (Pinch Zoom & Tooltip) ---
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      // Pinch Start
      touchRef.current.mode = "pinch";
      touchRef.current.dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current.startIndex = viewStartIndex;
      touchRef.current.visibleCount = visibleCount;
      setHoverData(null);
    } else {
      touchRef.current.mode = "none";
      updateTooltip(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && touchRef.current.mode === "pinch") {
      // --- Focal Point Zoom Logic ---
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      // 1. Calculate Zoom Factor
      const scaleFactor = touchRef.current.dist / (dist || 1); // 거리가 멀어지면(분모 커짐) scaleFactor < 1 (Zoom In)

      // 2. Calculate New Visible Count (Zoom Level)
      const total = mergedChartDatas.length;
      // 기존 visibleCount에 비율을 곱함
      let newVisibleCount = touchRef.current.visibleCount * scaleFactor;
      newVisibleCount = Math.max(5, Math.min(total, newVisibleCount)); // Clamp

      // 3. Find Focal Point (핀치 중심점) relative to SVG width (0.0 ~ 1.0)
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const focalRatio = Math.max(
        0,
        Math.min(1, (centerX - rect.left) / rect.width)
      );

      // 4. Adjust Start Index to keep Focal Point stationary
      // 수식: OldStart + OldCount * Ratio = DataIndexAtFocus = NewStart + NewCount * Ratio
      // => NewStart = OldStart + (OldCount - NewCount) * Ratio
      const countDiff = touchRef.current.visibleCount - newVisibleCount;
      let newStartIndex = touchRef.current.startIndex + countDiff * focalRatio;

      // Boundary Check
      newStartIndex = Math.max(
        0,
        Math.min(total - newVisibleCount, newStartIndex)
      );

      setVisibleCount(newVisibleCount);
      setViewStartIndex(newStartIndex);
    } else if (e.touches.length === 1) {
      updateTooltip(e.touches[0].clientX);
    }
  };

  // --- Scrollbar / MiniMap Logic ---
  // 전체 데이터 대비 현재 뷰포트의 비율 계산
  const totalLength = mergedChartDatas.length || 1;
  const viewportLeftPct = (viewStartIndex / totalLength) * 100;
  const viewportWidthPct = (visibleCount / totalLength) * 100;

  const handleScrollbarMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
    type: "window" | "left" | "right"
  ) => {
    // e.stopPropagation(); // 필요한 경우만
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    touchRef.current.mode =
      type === "window"
        ? "scroll-window"
        : type === "left"
        ? "scroll-left"
        : "scroll-right";
    touchRef.current.startX = clientX;
    touchRef.current.startIndex = viewStartIndex;
    touchRef.current.visibleCount = visibleCount;
  };

  // 전역 마우스/터치 이벤트로 드래그 처리 (스크롤바 밖으로 나가도 드래그 유지 위해)
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (touchRef.current.mode === "none" || touchRef.current.mode === "pinch")
        return;
      if (!scrollBarRef.current) return;

      const rect = scrollBarRef.current.getBoundingClientRect();
      const deltaPixels = clientX - touchRef.current.startX;
      const pixelPerIndex = rect.width / totalLength;
      const deltaIndex = deltaPixels / pixelPerIndex;

      const originalStart = touchRef.current.startIndex;
      const originalCount = touchRef.current.visibleCount;

      if (touchRef.current.mode === "scroll-window") {
        // Panning
        let newStart = originalStart + deltaIndex;
        newStart = Math.max(0, Math.min(totalLength - originalCount, newStart));
        setViewStartIndex(newStart);
      } else if (touchRef.current.mode === "scroll-left") {
        // Resize Left (Start Index 변경 + Count 변경)
        // 오른쪽 끝(Start + Count)은 고정되어야 함
        const originalEnd = originalStart + originalCount;
        let newStart = originalStart + deltaIndex;
        // 제한: newStart는 0보다 커야하고, End보다는 작아야 함 (최소 5개 유지)
        newStart = Math.max(0, Math.min(originalEnd - 5, newStart));
        const newCount = originalEnd - newStart;

        setViewStartIndex(newStart);
        setVisibleCount(newCount);
      } else if (touchRef.current.mode === "scroll-right") {
        // Resize Right (Count 변경)
        // Start Index 고정, Count만 변경
        let newCount = originalCount + deltaIndex;
        // 제한: newCount는 최소 5, Start + Count <= Total
        newCount = Math.max(5, Math.min(totalLength - originalStart, newCount));
        setVisibleCount(newCount);
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onEnd = () => {
      touchRef.current.mode = "none";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [totalLength]);

  return (
    <div id="stock-chart">
      {/* 1. Main Chart Area */}
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width + yAxisWidth} ${
            mainHeight + volumeHeight + 10
          }`}
          className="w-full h-auto overflow-visible select-none touch-none"
          // PC Mouse Events (Tooltip)
          onMouseMove={(e) => updateTooltip(e.clientX)}
          onMouseLeave={() => setHoverData(null)}
          // Mobile Touch Events (Pinch Zoom)
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setHoverData(null)}
        >
          {/* Chart Content (Line/Candle/Volume) - Same as previous logic but using visibleDatas */}
          <g>
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

            {/* Grid Lines */}
            <line
              x1="0"
              y1={0}
              x2={width}
              y2={0}
              stroke={chartFillColor}
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.2"
            />
            <line
              x1="0"
              y1={mainHeight}
              x2={width}
              y2={mainHeight}
              stroke="#9ea6b0"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.3"
            />
            {holdPriceY && (
              <line
                x1="0"
                y1={holdPriceY}
                x2={width}
                y2={holdPriceY}
                stroke="#9ea6b0"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            )}

            {/* Grid Line Description */}
            <g transform={`translate(3, -3)`}>
              {/* 최고가 */}

              <text x="0" y="0" fontSize="10" fill="#9ea6b0">
                최고가
              </text>
            </g>

            {/* 최저가 */}
            <g transform={`translate(3, ${mainHeight - 3})`}>
              <text x="0" y="0" fontSize="10" fill="#9ea6b0">
                최저가
              </text>
            </g>

            {/* 평단가 */}
            {holdPriceY && (
              <g transform={`translate(3, ${holdPriceY - 3})`}>
                <text x="0" y="0" fontSize="10" fill="#9ea6b0">
                  평단가
                </text>
              </g>
            )}

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
              candlesticks.map((c, i) => (
                <g key={i}>
                  <line
                    x1={c.x}
                    y1={c.highY}
                    x2={c.x}
                    y2={c.lowY}
                    stroke={c.isUp ? "#22c55e" : "#ef4444"}
                    strokeWidth="1"
                  />
                  <rect
                    x={c.x - c.candleWidth / 2}
                    y={c.bodyTop}
                    width={c.candleWidth}
                    height={c.bodyHeight}
                    fill={c.isUp ? "#22c55e" : "#ef4444"}
                    rx="1"
                  />
                </g>
              ))
            )}

            {/* Crosshair */}
            {hoverData && (
              <g>
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
              </g>
            )}
          </g>

          {/* Volume */}
          <g transform={`translate(0, ${mainHeight})`}>
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

          {/* Y-Axis */}
          <g transform={`translate(${width + 5}, 0)`}>
            <text y="10" fill="var(--text-secondary)" fontSize="10">
              {yAxisLabels[0]}
            </text>
            <text
              y={mainHeight / 2 + 3}
              fill="var(--text-secondary)"
              fontSize="10"
            >
              {yAxisLabels[1]}
            </text>
            {holdPriceY && (
              <text y={holdPriceY} fill="var(--text-secondary)" fontSize="10">
                {currentHoldPrice?.toLocaleString()}
              </text>
            )}
            <text y={mainHeight} fill="var(--text-secondary)" fontSize="10">
              {yAxisLabels[2]}
            </text>
          </g>
        </svg>

        {/* Tooltip Overlay */}
        {hoverData && (
          <div
            className="absolute z-20 p-2 text-xs rounded-lg shadow-lg pointer-events-none bg-bg-secondary border border-border-color"
            style={{
              left: `${(hoverData.x / width) * 100}%`,
              top: `0px`,
              transform: `translate(-50%, -120%)`,
              whiteSpace: "nowrap",
            }}
          >
            <p className="font-bold">
              {hoverData.chartData.closePrice.toLocaleString()}원
            </p>
            <p className="text-text-secondary">
              {hoverData.chartData.date} {hoverData.chartData.time}
            </p>
          </div>
        )}
      </div>

      {/* 2. Scrollbar / Range Slider (NEW UX) */}
      <div className="w-full h-6 -mt-2 px-1 mb-2 flex items-center">
        <div
          ref={scrollBarRef}
          className="relative w-full h-3 bg-bg-secondary rounded cursor-pointer select-none"
        >
          {/* Background Track (Mini Chart representation could go here) */}
          <div className="absolute top-1/2 left-0 w-full h-2 bg-border-color -translate-y-1/2" />

          {/* Draggable Viewport Window */}
          <div
            className={`absolute top-0 h-full ${
              isPositive
                ? "bg-positive/10 border-positive/50 active:bg-positive/20"
                : "bg-negative/10 border-negative/50 active:bg-negative/20"
            } rounded group`}
            style={{
              left: `${viewportLeftPct}%`,
              width: `${viewportWidthPct}%`,
              minWidth: "20px", // 최소 크기 보장
            }}
            onMouseDown={(e) => handleScrollbarMouseDown(e, "window")}
            onTouchStart={(e) => handleScrollbarMouseDown(e, "window")}
          >
            {/* Left Resize Handle */}
            <div
              className="absolute left-0 top-0 w-3 h-full cursor-ew-resize flex items-center justify-center hover:bg-primary/50"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleScrollbarMouseDown(e, "left");
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleScrollbarMouseDown(e, "left");
              }}
            >
              <div className="w-[2px] h-2 bg-text-secondary" />
            </div>

            {/* Right Resize Handle */}
            <div
              className="absolute right-0 top-0 w-3 h-full cursor-ew-resize flex items-center justify-center hover:bg-primary/50"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleScrollbarMouseDown(e, "right");
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleScrollbarMouseDown(e, "right");
              }}
            >
              <div className="w-[2px] h-2 bg-text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Period & Mode Controls */}
      <div
        id="stock-period-mode-controls"
        className="flex w-full bg-bg-primary p-1 rounded-lg"
      >
        <div className="relative flex flex-1 items-center">
          <div
            className="absolute h-full w-1/5 bg-bg-secondary rounded-md shadow-sm transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {periods.map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`relative z-10 w-1/5 py-2 active:scale-95 transition-all duration-200 text-sm font-semibold rounded-md ${
                period === t ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {t === "1day"
                ? "1일"
                : t === "1week"
                ? "1주"
                : t === "3month"
                ? "3달"
                : t === "1year"
                ? "1년"
                : "5년"}
            </button>
          ))}
        </div>
        <button
          className="h-9 w-9 ml-1 shrink-0 active:scale-95 transition-transform duration-200 ease-in-out rounded-md bg-bg-secondary text-text-primary flex items-center justify-center"
          onClick={() => setChartMode(chartMode === "line" ? "candle" : "line")}
        >
          {chartMode !== "line" ? <FaChartColumn /> : <FaChartLine />}
        </button>
      </div>
    </div>
  );
};

export default StockChart;
