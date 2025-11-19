import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  StockInfo,
  BasicStockInfoMockType,
  OrderType,
} from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

// 환경변수에서 API base URL을 읽음
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// API 호출 함수 (확장성 고려, 추후 파라미터 추가 가능)
async function fetchTopStocks(OrderBy: OrderType): Promise<StockInfo[]> {
  let url = "";
  switch (OrderBy) {
    case "amount":
      url = "/api/stocks/amount";
      break;
    case "gainers":
      url = "/api/stocks/fluctuations?type=rise";
      break;
    case "losers":
      url = "/api/stocks/fluctuations?type=fall";
      break;
    default:
      throw new Error("Invalid OrderBy parameter");
  }
  const res = await defaultClient.get(url);
  if (res.status !== 200) {
    throw new Error("Failed to fetch top stocks");
  }
  console.log("Fetched Top Stocks:", res.data);
  return res.data;
}

export function useTopStocks(OrderBy: OrderType = "amount") {
  const { data, isLoading, isError, refetch } = useQuery<StockInfo[]>({
    queryKey: ["topStocks", OrderBy],
    queryFn: () => fetchTopStocks(OrderBy),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
