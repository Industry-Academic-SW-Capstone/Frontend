"use client";

// context/WebSocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, IMessage, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useStockStore } from "../stores/useStockStore"; // 1. Zustand 스토어 import
import { useChartStore } from "../stores/useChartStore";
import { useOrderBookStore } from "../stores/useOrderBookStore";

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (stockCode: string) => void;
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
  // 구독 상태를 관리하기 위한 ref (HTML의 'subscriptions' 객체 역할)
  const stockSubscriptionsRef = useRef<Record<string, any>>({});
  const orderBookSubscriptionsRef = useRef<Record<string, any>>({});
  const { updateTickerFromSocket } = useStockStore.getState(); // 2. Zustand 스토어에서 업데이트 함수 가져오기

  useEffect(() => {
    // 컴포넌트 마운트 시 소켓 연결
    const socket = new SockJS("https://www.stockit.live/ws");
    const client = Stomp.over(socket);

    // 디버그 메시지 끄기 (프로덕션)
    // client.debug = () => {};

    client.connect(
      {},
      (frame: any) => {
        console.log("STOMP 연결 성공: " + frame);
        setIsConnected(true);
      },
      (error: any) => {
        console.error("STOMP 연결 실패:", error);
        setIsConnected(false);
      }
    );

    stompClientRef.current = client;

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      if (client.connected) {
        client.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log("구독중인 주식: ", stockSubscriptionsRef.current);
  }, [stockSubscriptionsRef]);

  const setSubscribeStockSet = (stockCodes: string[]) => {
    const stockCodesToAdd = stockCodes.filter(
      (stockCode) => !stockSubscriptionsRef.current[stockCode]
    );
    const stockCodesToRemove = Object.keys(
      stockSubscriptionsRef.current
    ).filter((stockCode) => !stockCodes.includes(stockCode));

    stockCodesToAdd.forEach((stockCode) => {
      subscribeStock(stockCode);
    });
    stockCodesToRemove.forEach((stockCode) => {
      unsubscribeStock(stockCode);
    });
  };

  const subscribeStock = (stockCode: string) => {
    const client = stompClientRef.current;
    if (
      !client ||
      !client.connected ||
      stockSubscriptionsRef.current[stockCode]
    ) {
      // 연결 안 됨 || 이미 구독 중
      return;
    }

    console.log(`구독 시작: /topic/stock/${stockCode}`);

    const sub = client.subscribe(
      `/topic/stock/${stockCode}`,
      (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);

          // 3. (핵심) 소켓 데이터를 받으면 Zustand 스토어를 업데이트!
          updateTickerFromSocket(stockCode, data);

          // 4. 차트 스토어 업데이트
          useChartStore.getState().updateTickerFromSocket(stockCode, data);
        } catch (e) {
          console.error("소켓 메시지 파싱 오류:", e);
        }
      }
    );

    stockSubscriptionsRef.current[stockCode] = sub;
  };

  const unsubscribeStock = (stockCode: string) => {
    const sub = stockSubscriptionsRef.current[stockCode];
    if (sub) {
      sub.unsubscribe();
      delete stockSubscriptionsRef.current[stockCode];
      console.log(`구독 해제: ${stockCode}`);
    }
  };

  const subscribeOrderBook = (stockCode: string) => {
    const client = stompClientRef.current;
    if (
      !client ||
      !client.connected ||
      orderBookSubscriptionsRef.current[stockCode]
    ) {
      return;
    }

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

  const unsubscribeOrderBook = (stockCode: string) => {
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
