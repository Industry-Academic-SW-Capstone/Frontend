import { useQuery } from "@tanstack/react-query";
import { StockHistory } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

async function fetchStockHistory(
  accountId: string,
  stockCode: string,
  includeCancled: boolean
): Promise<StockHistory> {
  const res = await defaultClient.get(
    `/api/accounts/${accountId}/stocks/${stockCode}`,
    {
      params: {
        includeCancled,
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch stock detail info");
  }
  return res.data;
}

export function useStockHistory(
  accountId: string,
  stockCode: string,
  includeCancled: boolean = false
) {
  const { data, isLoading, isError, refetch } = useQuery<StockHistory>({
    queryKey: ["stockHistory", accountId, stockCode],
    queryFn: () => fetchStockHistory(accountId, stockCode, includeCancled),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
