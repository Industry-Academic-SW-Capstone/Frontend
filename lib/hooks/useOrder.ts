import { useMutation } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";

export type OrderMethod = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";
export type OrderStatus =
  | "PENDING"
  | "FILLED"
  | "CANCELLED"
  | "PARTIALLY_FILLED";

export interface MarketOrderRequest {
  account_id: number;
  stock_code: string;
  quantity: number;
  order_method: OrderMethod;
}

export interface LimitOrderRequest {
  account_id: number;
  stock_code: string;
  price: number;
  quantity: number;
  order_method: OrderMethod;
}

export interface OrderResponse {
  orderId: number;
  accountId: number;
  stockCode: string;
  orderType: OrderType;
  orderMethod: OrderMethod;
  status: OrderStatus;
  price: number;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderErrorResponse {
  quantity?: string;
  price?: string;
  message?: string;
}

const postMarketOrder = async (
  data: MarketOrderRequest
): Promise<OrderResponse> => {
  const response = await defaultClient.post<OrderResponse>(
    "/api/orders/market",
    data
  );
  return response.data;
};

const postLimitOrder = async (
  data: LimitOrderRequest
): Promise<OrderResponse> => {
  const response = await defaultClient.post<OrderResponse>(
    "/api/orders/limit",
    data
  );
  return response.data;
};

import { useAccountStore } from "@/lib/store/useAccountStore";

export const useMarketOrder = () => {
  const { selectedAccount } = useAccountStore();
  return useMutation<OrderResponse, OrderErrorResponse, MarketOrderRequest>({
    mutationFn: (data) => {
      if (!selectedAccount) throw new Error("No account selected");
      return postMarketOrder({
        ...data,
        account_id: selectedAccount.id,
      });
    },
  });
};

export const useLimitOrder = () => {
  const { selectedAccount } = useAccountStore();
  return useMutation<OrderResponse, OrderErrorResponse, LimitOrderRequest>({
    mutationFn: (data) => {
      if (!selectedAccount) throw new Error("No account selected");
      return postLimitOrder({ ...data, account_id: selectedAccount.id });
    },
  });
};
