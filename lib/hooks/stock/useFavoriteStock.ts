import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StockInfo, OrderType } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

// 환경변수에서 API base URL을 읽음
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// API 호출 함수 (확장성 고려, 추후 파라미터 추가 가능)
async function fetchFavoriteStocks(): Promise<StockInfo[]> {
  const res = await defaultClient.get("/api/members/me/favorites");
  if (res.status !== 200) {
    throw new Error("Failed to fetch top stocks");
  }
  console.log("Fetched Top Stocks:", res.data);
  return res.data;
}

export function useFavoriteStocks() {
  const { data, isLoading, isError, refetch } = useQuery<StockInfo[]>({
    queryKey: ["favoriteStocks"],
    queryFn: () => fetchFavoriteStocks(),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
