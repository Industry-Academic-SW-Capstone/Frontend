"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { BasicStockInfoMockType } from "@/lib/types/stock";

interface StockSubscriptionContextValue {
  subscribedStocks: Record<string, BasicStockInfoMockType>;
  addStock: (stock: BasicStockInfoMockType) => void;
  removeStock: (ticker: string) => void;
  clearStocks: () => void;
}

const StockSubscriptionContext = createContext<
  StockSubscriptionContextValue | undefined
>(undefined);

export function useStockSubscription() {
  const ctx = useContext(StockSubscriptionContext);
  if (!ctx)
    throw new Error(
      "useStockSubscription must be used within StockSubscriptionProvider"
    );
  return ctx;
}

interface StockSubscriptionProviderProps {
  children: React.ReactNode;
  socketUrl: string;
}

export const StockSubscriptionProvider: React.FC<
  StockSubscriptionProviderProps
> = ({ children, socketUrl }) => {
  const [subscribedStocks, setSubscribedStocks] = useState<
    Record<string, BasicStockInfoMockType>
  >({});
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 소켓 연결
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(socketUrl);
      socketRef.current.onopen = () => {
        // 연결 성공 시 바로 1초 주기 시작
        startTickerThread();
      };
      socketRef.current.onclose = () => stopTickerThread();
      socketRef.current.onerror = () => stopTickerThread();
      socketRef.current.onmessage = (event) => {
        // 서버에서 오는 모든 메시지 로그
        console.log("[SOCKET][RECV]", event.data);
      };
    }
    return () => {
      stopTickerThread();
      socketRef.current?.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketUrl]);

  // 1초마다 구독 주식 ticker 전송
  const startTickerThread = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const tickers = Object.keys(subscribedStocks);
        if (tickers.length > 0) {
          socketRef.current.send(JSON.stringify({ type: "TICKERS", tickers }));
          console.log("[SOCKET][SEND]", tickers);
        }
      }
    }, 1000);
  }, [subscribedStocks]);

  const stopTickerThread = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 구독 관리 함수들
  const addStock = useCallback((stock: BasicStockInfoMockType) => {
    setSubscribedStocks((prev) => ({ ...prev, [stock.stockCode]: stock }));
  }, []);

  const removeStock = useCallback((ticker: string) => {
    setSubscribedStocks((prev) => {
      const copy = { ...prev };
      delete copy[ticker];
      return copy;
    });
  }, []);

  const clearStocks = useCallback(() => {
    setSubscribedStocks({});
  }, []);

  // 구독 목록이 바뀔 때마다 스레드 재시작 (최신 목록 반영)
  useEffect(() => {
    stopTickerThread();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      startTickerThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(subscribedStocks).join(",")]);

  return (
    <StockSubscriptionContext.Provider
      value={{ subscribedStocks, addStock, removeStock, clearStocks }}
    >
      {children}
    </StockSubscriptionContext.Provider>
  );
};
