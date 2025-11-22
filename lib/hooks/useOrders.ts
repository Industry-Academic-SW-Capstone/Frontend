import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";

export interface PendingOrder {
  orderId: number;
  stockCode: string;
  stockName: string;
  marketType: string;
  orderMethod: "BUY" | "SELL";
  price: number;
  quantity: number;
  remainingQuantity: number;
  createdAt: string;
}

export interface PendingOrdersResponse {
  orders: PendingOrder[];
}

export interface OrderDetail {
  orderId: number;
  accountId: number;
  stockName: string;
  stockCode: string;
  orderType: "MARKET" | "LIMIT";
  orderMethod: "BUY" | "SELL";
  status: "PENDING" | "FILLED" | "CANCELLED" | "PARTIALLY_FILLED";
  price: number;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  createdAt: string;
  updatedAt: string;
}

const fetchPendingOrders = async (
  accountId: number
): Promise<PendingOrdersResponse> => {
  const response = await defaultClient.get<PendingOrdersResponse>(
    `/api/orders/accounts/${accountId}/pending`
  );
  return response.data;
};

const fetchOrderDetail = async (orderId: number): Promise<OrderDetail> => {
  const response = await defaultClient.get<OrderDetail>(
    `/api/orders/${orderId}`
  );
  return response.data;
};

const cancelOrder = async (orderId: number): Promise<OrderDetail> => {
  const response = await defaultClient.post<OrderDetail>(
    `/api/orders/${orderId}/cancel`
  );
  return response.data;
};

import { useAccountStore } from "@/lib/store/useAccountStore";

export const usePendingOrders = () => {
  const { selectedAccount } = useAccountStore();
  const accountId = selectedAccount?.id;

  return useQuery({
    queryKey: ["pendingOrders", accountId],
    queryFn: () => {
      if (!accountId) throw new Error("No account selected");
      return fetchPendingOrders(accountId);
    },
    enabled: !!accountId,
  });
};

export const useOrderDetail = (orderId: number | null) => {
  return useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => fetchOrderDetail(orderId!),
    enabled: !!orderId,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      // Invalidate pending orders and account assets as cancellation might affect them
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] });
      queryClient.invalidateQueries({ queryKey: ["accountAssets"] });
      queryClient.invalidateQueries({
        queryKey: ["orderDetail", data.orderId],
      });
    },
  });
};
