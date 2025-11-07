import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  StockInfo,
  BasicStockInfoMockType,
  OrderType,
  PeriodType,
  ChartData,
} from "@/lib/types/types";
import defaultClient from "../../api/axiosClient";

// 환경변수에서 API base URL을 읽음
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// API 호출 함수 (확장성 고려, 추후 파라미터 추가 가능)
async function fetchStockChart(
  stockCode: string,
  periodType: PeriodType
): Promise<ChartData[]> {
  const res = await defaultClient.get(
    `${API_BASE_URL}/api/stocks/${stockCode}/chart?periodType=${periodType}`
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch stock chart");
  }
  return res.data;
}

export function useStockChart(stockCode: string, periodType: PeriodType) {
  const { data, isLoading, isError, refetch } = useQuery<ChartData[]>({
    queryKey: ["stockChart", stockCode, periodType],
    queryFn: () => fetchStockChart(stockCode, periodType),
    staleTime:
      periodType === "1day"
        ? 1 * 60 * 1000
        : periodType === "1week"
        ? 10 * 60 * 1000
        : 30 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
