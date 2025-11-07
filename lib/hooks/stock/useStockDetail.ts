import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  StockInfo,
  BasicStockInfoMockType,
  StockDetailInfo,
} from "@/lib/types/types";
import defaultClient from "../../api/axiosClient";

// 환경변수에서 API base URL을 읽음
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function fetchStockDetailInfo(
  stockCode: string
): Promise<StockDetailInfo[]> {
  const res = await defaultClient.get(
    `${API_BASE_URL}/api/stocks/${stockCode}`
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch stock detail info");
  }
  return res.data;
}

export function useStockDetail(stockCode: string) {
  const { data, isLoading, isError, refetch } = useQuery<StockDetailInfo[]>({
    queryKey: ["stockDetail", stockCode],
    queryFn: () => fetchStockDetailInfo(stockCode),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
