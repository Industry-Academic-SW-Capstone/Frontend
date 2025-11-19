import { create } from "zustand";
import { OrderBookData } from "@/lib/types/stock";

interface OrderBookState {
  orderBook: OrderBookData | null;
  setOrderBook: (data: OrderBookData) => void;
  clearOrderBook: () => void;
}

export const useOrderBookStore = create<OrderBookState>((set) => ({
  orderBook: null,
  setOrderBook: (data) => set({ orderBook: data }),
  clearOrderBook: () => set({ orderBook: null }),
}));
