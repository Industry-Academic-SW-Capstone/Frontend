"use client";

// context/WebSocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useStockStore } from "../stores/useStockStore"; // 1. Zustand 스토어 import
import { useChartStore } from "../stores/useChartStore";
import { useOrderBookStore } from "../stores/useOrderBookStore";

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (chartAvailable: boolean, stockCode: string) => void;
  unsubscribe: (stockCode: string) => void;
  setSubscribeSet: (stockCodes: string[]) => void;
  subscribeOrderBook: (stockCode: string) => void;
  unsubscribeOrderBook: (stockCode: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 실제 구독 객체 (unsubscribe를 위해 필요)
  const stockSubscriptionsRef = useRef<Record<string, any>>({});
  const orderBookSubscriptionsRef = useRef<Record<string, any>>({});

  // 사용자가 구독을 원했던 주식 목록 (재연결 시 자동 구독 복구를 위해 필요)
  const desiredStockSubscriptionsRef = useRef<Set<string>>(new Set());
  const desiredOrderBookSubscriptionsRef = useRef<Set<string>>(new Set());

  const { updateTickerFromSocket: socketUpdateTicker } =
    useStockStore.getState();
  const { updateTickerFromSocket: chartUpdateTicker } =
    useChartStore.getState();

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("https://api.stockit.live/ws"),
      reconnectDelay: 5000, // 5초 후 재연결 시도
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("STOMP 연결 성공: " + frame);
        setIsConnected(true);
        resubscribeAll();
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketClose: () => {
        console.log("WebSocket 연결 끊김");
        setIsConnected(false);
        // 연결이 끊어지면 실제 구독 객체는 무효화되므로 초기화
        stockSubscriptionsRef.current = {};
        orderBookSubscriptionsRef.current = {};
      },
      // debug: (str) => {
      //   console.log(str);
      // },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  // 재연결 시 모든 구독 복구
  const resubscribeAll = () => {
    const client = stompClientRef.current;
    if (!client || !client.connected) return;

    const manySockets = desiredStockSubscriptionsRef.current.size > 1;
    // 주식 구독 복구
    desiredStockSubscriptionsRef.current.forEach((stockCode) => {
      if (!stockSubscriptionsRef.current[stockCode]) {
        doSubscribeStock(client, stockCode, !manySockets);
      }
    });

    // 호가 구독 복구
    desiredOrderBookSubscriptionsRef.current.forEach((stockCode) => {
      if (!orderBookSubscriptionsRef.current[stockCode]) {
        doSubscribeOrderBook(client, stockCode);
      }
    });
  };

  const doSubscribeStock = (
    client: Client,
    stockCode: string,
    chartAvailable: boolean
  ) => {
    console.log(`구독 시작: /topic/stock/${stockCode}`);
    const sub = client.subscribe(
      `/topic/stock/${stockCode}`,
      (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          socketUpdateTicker(stockCode, data);
          if (chartAvailable) {
            chartUpdateTicker(stockCode, data);
          }
        } catch (e) {
          console.error("소켓 메시지 파싱 오류:", e);
        }
      }
    );
    stockSubscriptionsRef.current[stockCode] = sub;
  };

  const doSubscribeOrderBook = (client: Client, stockCode: string) => {
    console.log(`호가 구독 시작: /topic/stock/${stockCode}/orderbook`);
    const sub = client.subscribe(
      `/topic/stock/${stockCode}/orderbook`,
      (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          useOrderBookStore.getState().setOrderBook(data);
        } catch (e) {
          console.error("호가 소켓 메시지 파싱 오류:", e);
        }
      }
    );
    orderBookSubscriptionsRef.current[stockCode] = sub;
  };

  const setSubscribeStockSet = (stockCodes: string[]) => {
    // 현재 원하는 목록 업데이트
    const newSet = new Set(stockCodes);

    const manySockets = stockCodes.length > 1;

    if (manySockets) {
      desiredStockSubscriptionsRef.current.forEach((code) => {
        if (!newSet.has(code)) {
          unsubscribeStock(code);
        }
      });
    } else {
      desiredStockSubscriptionsRef.current.forEach((code) => {
        unsubscribeStock(code);
      });
    }

    // 추가해야 할 것들
    stockCodes.forEach((code) => {
      if (!desiredStockSubscriptionsRef.current.has(code)) {
        subscribeStock(!manySockets, code);
      }
    });
  };

  const subscribeStock = (chartAvailable: boolean, stockCode: string) => {
    // 원하는 목록에 추가
    desiredStockSubscriptionsRef.current.add(stockCode);

    const client = stompClientRef.current;
    if (
      client &&
      client.connected &&
      !stockSubscriptionsRef.current[stockCode]
    ) {
      doSubscribeStock(client, stockCode, chartAvailable);
    }
  };

  const unsubscribeStock = (stockCode: string) => {
    // 원하는 목록에서 제거
    desiredStockSubscriptionsRef.current.delete(stockCode);

    const sub = stockSubscriptionsRef.current[stockCode];
    if (sub) {
      sub.unsubscribe();
      delete stockSubscriptionsRef.current[stockCode];
      console.log(`구독 해제: ${stockCode}`);
    }
  };

  const subscribeOrderBook = (stockCode: string) => {
    desiredOrderBookSubscriptionsRef.current.add(stockCode);

    const client = stompClientRef.current;
    if (
      client &&
      client.connected &&
      !orderBookSubscriptionsRef.current[stockCode]
    ) {
      doSubscribeOrderBook(client, stockCode);
    }
  };

  const unsubscribeOrderBook = (stockCode: string) => {
    desiredOrderBookSubscriptionsRef.current.delete(stockCode);

    const sub = orderBookSubscriptionsRef.current[stockCode];
    if (sub) {
      sub.unsubscribe();
      delete orderBookSubscriptionsRef.current[stockCode];
      useOrderBookStore.getState().clearOrderBook();
      console.log(`호가 구독 해제: ${stockCode}`);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        subscribe: subscribeStock,
        unsubscribe: unsubscribeStock,
        setSubscribeSet: setSubscribeStockSet,
        subscribeOrderBook,
        unsubscribeOrderBook,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// 커스텀 훅
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket는 WebSocketProvider 내에서 사용해야 합니다.");
  }
  return context;
};
