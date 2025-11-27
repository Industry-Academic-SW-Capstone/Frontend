// store/stockStore.ts
import { create } from "zustand";
import { StockInfo, StockDetailInfo, BasicStockInfo } from "@/lib/types/stock";
import camelcaseKeys from "camelcase-keys";

// snake_case를 camelCase로 변환하는 유틸리티 (이전 답변)
const transformSocketData = (data: any): Partial<StockInfo> => {
  return camelcaseKeys(data, { deep: true });
};

interface TickerState {
  tickers: Record<string, StockDetailInfo>;

  // 여러 종목을 한 번에 업데이트/삽입 (API 응답용)
  // StockInfo[] 또는 StockDetailInfo[] 모두 받을 수 있음
  upsertTickers: (
    stocks: (BasicStockInfo | StockInfo | StockDetailInfo)[]
  ) => void;

  // 소켓에서 오는 실시간 단일 업데이트용
  updateTickerFromSocket: (stockCode: string, socketData: any) => void;

  // Navigation State
  stocksView: "portfolio" | "explore" | "analysis";
  setStocksView: (view: "portfolio" | "explore" | "analysis") => void;
}

export const useStockStore = create<TickerState>((set, get) => ({
  tickers: {},

  upsertTickers: (stocks) => {
    set((state) => {
      const newTickers = { ...state.tickers };

      stocks.forEach((stock) => {
        // (핵심) 기존 정보를 유지하면서 새 정보로 덮어씁니다.
        newTickers[stock.stockCode] = {
          ...(newTickers[stock.stockCode] || {}), // 기존 데이터
          ...stock, // 새 데이터 (API)
        };
      });

      return { tickers: newTickers };
    });
  },

  updateTickerFromSocket: (stockCode, socketData) => {
    const transformedInfo = transformSocketData(socketData);

    set((state) => {
      const existingStock = state.tickers[stockCode] || { stockCode };

      const updatedStock: StockDetailInfo = {
        ...existingStock,
      } as StockDetailInfo;

      for (const key in transformedInfo) {
        if (Object.prototype.hasOwnProperty.call(transformedInfo, key)) {
          const value = transformedInfo[key as keyof Partial<StockInfo>];
          // 빈 문자열이 아닌 경우에만 업데이트
          if (value && value !== "") {
            (updatedStock as any)[key] = value;
          }
        }
      }

      return {
        tickers: {
          ...state.tickers,
          [stockCode]: updatedStock,
        },
      };
    });
  },
  // Navigation State
  stocksView: "portfolio" as "portfolio" | "explore" | "analysis",
  setStocksView: (view: "portfolio" | "explore" | "analysis") =>
    set({ stocksView: view }),
}));
