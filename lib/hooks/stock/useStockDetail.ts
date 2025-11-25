import { useQuery } from "@tanstack/react-query";
import { StockDetailInfo } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

async function fetchStockDetailInfo(
  stockCode: string
): Promise<StockDetailInfo> {
  const res = await defaultClient.get(`/api/stocks/${stockCode}`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch stock detail info");
  }
  return res.data;
}

export function useStockDetail(stockCode: string) {
  const { data, isLoading, isError, refetch } = useQuery<StockDetailInfo>({
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
