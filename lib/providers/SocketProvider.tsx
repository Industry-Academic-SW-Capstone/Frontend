'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface SocketContextValue {
  socket: WebSocket | null;
  isConnected: boolean;
  subscribe: (codes: string[]) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  subscribe: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: React.ReactNode;
  url: string; // ws:// 또는 wss://
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, url }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 구독 함수: 주식 코드 리스트를 서버로 전송
  const subscribe = useCallback((codes: string[]) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // 서버 프로토콜에 맞게 메시지 포맷 조정 필요
      socketRef.current.send(JSON.stringify({ type: 'SUBSCRIBE', codes }));
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => setIsConnected(true);
      socketRef.current.onclose = () => setIsConnected(false);
      socketRef.current.onerror = () => setIsConnected(false);
    }

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [url]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
};
