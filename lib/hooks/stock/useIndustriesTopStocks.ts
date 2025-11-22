import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  StockInfo,
  BasicStockInfoMockType,
  OrderType,
  IndustriesTopStocks,
} from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

// 환경변수에서 API base URL을 읽음
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// API 호출 함수 (확장성 고려, 추후 파라미터 추가 가능)
async function fetchTopStocks(
  OrderBy: OrderType
): Promise<IndustriesTopStocks[]> {
  const res = await defaultClient.get(`/api/stocks/industries`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch top stocks");
  }
  return res.data;
}

export function useIndustriesTopStocks(OrderBy: OrderType = "amount") {
  const { data, isLoading, isError, refetch } = useQuery<IndustriesTopStocks[]>(
    {
      queryKey: ["industriesTopStocks", OrderBy],
      queryFn: () => fetchTopStocks(OrderBy),
    }
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
