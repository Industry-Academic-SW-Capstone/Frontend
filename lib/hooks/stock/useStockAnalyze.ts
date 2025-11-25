import { useQuery } from "@tanstack/react-query";
import { StockStyleAnalysis } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

async function fetchStockAnalyzeInfo(
  stockCode: string
): Promise<StockStyleAnalysis> {
  const res = await defaultClient.post(`/api/stocks/${stockCode}/analyze`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch stock analyze info");
  }
  return res.data;
}

export function useStockAnalyze(stockCode: string) {
  const { data, isLoading, isError, refetch } = useQuery<StockStyleAnalysis>({
    queryKey: ["stockAnalyze", stockCode],
    queryFn: () => fetchStockAnalyzeInfo(stockCode),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
