// store/stockStore.ts
import create from "zustand";
import { StockInfo, StockDetailInfo } from "@/lib/types/stock";
import camelcaseKeys from "camelcase-keys";

type StoredStockInfo = Partial<StockDetailInfo> & { stockCode: string };

// snake_case를 camelCase로 변환하는 유틸리티 (이전 답변)
const transformSocketData = (data: any): Partial<StockInfo> => {
  return camelcaseKeys(data, { deep: true });
};

interface TickerState {
  tickers: Record<string, StoredStockInfo>;

  // 여러 종목을 한 번에 업데이트/삽입 (API 응답용)
  // StockInfo[] 또는 StockDetailInfo[] 모두 받을 수 있음
  upsertTickers: (stocks: (StockInfo | StockDetailInfo)[]) => void;

  // 소켓에서 오는 실시간 단일 업데이트용
  updateTickerFromSocket: (stockCode: string, socketData: any) => void;
}

export const useStockStore = create<TickerState>((set) => ({
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
    console.log("소켓 데이터: ", socketData);
    const transformedInfo = transformSocketData(socketData);
    console.log("구독한 주식 정보: ", stockCode, transformedInfo);

    set((state) => {
      const existingStock = state.tickers[stockCode] || { stockCode };

      return {
        tickers: {
          ...state.tickers,
          [stockCode]: {
            ...existingStock,
            ...transformedInfo, // 소켓 데이터로 덮어쓰기
          },
        },
      };
    });
  },
}));
