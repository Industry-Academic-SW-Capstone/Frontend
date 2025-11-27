import { create } from "zustand";
import { ChartData, PeriodType } from "@/lib/types/stock";

interface ChartState {
  chartDatas: ChartData[];
  periodType: PeriodType;
  startFrom: string | null;

  setPeriodType: (periodType: PeriodType) => void;
  initializeChartData: (data: ChartData[]) => void;
  updateTickerFromSocket: (stockCode: string, data: any) => void;
  reset: () => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  chartDatas: [],
  periodType: "1day",
  startFrom: null,

  setPeriodType: (periodType) => {
    set({ periodType, chartDatas: [], startFrom: null });
  },

  initializeChartData: (data) => {
    if (!data || data.length === 0) return;
    // Take the last data point as the starting point for real-time updates
    // or just store the whole array if we want to append to it?
    // User said: "additionally useChartStore... merge existing data... first data is the last item of useStockChart"
    // So we likely want to start with the last known candle.
    const lastData = data[data.length - 1];
    console.log("이닛", data, "RMx", lastData);
    set({
      chartDatas: [lastData],
      startFrom: lastData.date + (lastData.time ? " " + lastData.time : ""),
    });
  },

  reset: () => {
    set({ chartDatas: [], startFrom: null });
  },

  updateTickerFromSocket: (stockCode, socketData) => {
    const { periodType, chartDatas } = get();
    console.log("updateTickerFromSocket", stockCode, socketData);
    // Parse socket data
    // Assuming socketData structure based on user description and typical stock socket
    // User said: "timestamp value to date/time", "currentPrice"
    console.log(socketData.current_price, typeof socketData.current_price);
    const currentPrice = Number(socketData.current_price);
    const volume = Number(0);
    const amount = Number(0);
    const timestamp = socketData.timestamp
      ? new Date(socketData.timestamp)
      : new Date();

    if (isNaN(currentPrice)) return;

    // Determine bucket time based on periodType
    let bucketTime = new Date(timestamp);
    bucketTime.setSeconds(0);
    bucketTime.setMilliseconds(0);

    if (periodType === "1day") {
      // 1 minute intervals
      // Already set seconds/ms to 0
    } else if (periodType === "1week") {
      // 5 minute intervals
      const minutes = bucketTime.getMinutes();
      const roundedMinutes = Math.floor(minutes / 5) * 5;
      bucketTime.setMinutes(roundedMinutes);
    } else {
      // Day intervals (3month, 1year, 5year)
      bucketTime.setHours(0, 0, 0, 0);
    }

    // Format date and time strings
    // date: "YYYY-MM-DD", time: "HH:mm:ss"
    const year = bucketTime.getFullYear();
    const month = String(bucketTime.getMonth() + 1).padStart(2, "0");
    const day = String(bucketTime.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const hours = String(bucketTime.getHours()).padStart(2, "0");
    const minutes = String(bucketTime.getMinutes()).padStart(2, "0");
    const seconds = "00"; // Always 00 for 1min/5min buckets
    const timeStr = `${hours}:${minutes}:${seconds}`;

    const lastCandle = chartDatas[chartDatas.length - 1];

    // Check if we should update the last candle or create a new one
    let isSameBucket = false;
    if (lastCandle) {
      if (periodType === "1day" || periodType === "1week") {
        // Compare date and time
        isSameBucket =
          lastCandle.date === dateStr && lastCandle.time === timeStr;
      } else {
        // Compare date only
        isSameBucket = lastCandle.date === dateStr;
      }
    }

    if (isSameBucket && lastCandle) {
      // Update existing candle
      const newHigh = Math.max(lastCandle.highPrice, currentPrice);
      const newLow = Math.min(lastCandle.lowPrice, currentPrice);

      const updatedCandle: ChartData = {
        ...lastCandle,
        highPrice: newHigh,
        lowPrice: newLow,
        closePrice: currentPrice,
        volume: volume, // User said always update
        amount: amount, // User said always update
      };

      set({
        chartDatas: [...chartDatas.slice(0, -1), updatedCandle],
      });
    } else {
      // Create new candle
      // If it's a new candle, open/high/low/close are all currentPrice initially
      // unless we have logic to carry over close from previous?
      // Usually for a NEW candle, open=current, high=current, low=current, close=current.

      const newCandle: ChartData = {
        date: dateStr,
        time:
          periodType === "1day" || periodType === "1week" ? timeStr : undefined,
        openPrice: currentPrice,
        highPrice: currentPrice,
        lowPrice: currentPrice,
        closePrice: currentPrice,
        volume: volume,
        amount: amount,
      };

      set({
        chartDatas: [...chartDatas, newCandle],
      });
    }
  },
}));
