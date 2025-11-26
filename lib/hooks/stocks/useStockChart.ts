import { useQuery } from "@tanstack/react-query";
import { PeriodType, ChartData } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

// API 호출 함수 (확장성 고려, 추후 파라미터 추가 가능)
async function fetchStockChart(
  stockCode: string,
  periodType: PeriodType
): Promise<ChartData[]> {
  if (stockCode === "") {
    throw new Error("Invalid stock code");
  }
  const res = await defaultClient.get(
    `/api/stocks/${stockCode}/chart?periodType=${periodType}`
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
