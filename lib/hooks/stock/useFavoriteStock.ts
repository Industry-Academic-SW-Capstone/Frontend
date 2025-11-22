import { useQuery } from "@tanstack/react-query";
import { BasicStockInfo, StockDetailInfo, StockInfo } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

// Favorite Item Type from API
export interface FavoriteItem {
  favoriteId: number;
  stockCode: string;
  stockName: string;
  addedAt: string;
}

// Combined Type for UI
// Extending StockInfo instead of BasicStockInfo to satisfy upsertTickers (needs volume/amount)
export interface FavoriteStockInfo extends FavoriteItem, StockInfo {}

// Fetch Favorite Items
async function fetchFavoriteItems(): Promise<FavoriteItem[]> {
  const res = await defaultClient.get<FavoriteItem[]>(
    "/api/members/me/favorites"
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch favorite items");
  }
  return res.data;
}

// Fetch Stock Detail
async function fetchStockDetail(stockCode: string): Promise<StockDetailInfo> {
  const res = await defaultClient.get<StockDetailInfo>(
    `/api/stocks/${stockCode}`
  );
  if (res.status !== 200) {
    throw new Error(`Failed to fetch stock info for ${stockCode}`);
  }
  return res.data;
}

// Main Fetch Function
async function fetchFavoriteStocks(): Promise<FavoriteStockInfo[]> {
  // 1. Get Favorites List
  const favoriteItems = await fetchFavoriteItems();

  // 2. Get Details for each stock
  const stockDetailsPromises = favoriteItems.map(async (item) => {
    try {
      const detail = await fetchStockDetail(item.stockCode);

      // 3. Merge Data
      const favoriteStockInfo: FavoriteStockInfo = {
        ...item,
        ...detail, // This includes BasicStockInfo fields
      };
      return favoriteStockInfo;
    } catch (error) {
      console.error(`Error fetching detail for ${item.stockCode}`, error);
      return null;
    }
  });

  const results = await Promise.all(stockDetailsPromises);

  // Filter out failed requests
  return results.filter((item): item is FavoriteStockInfo => item !== null);
}

export function useFavoriteStocks() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<
    FavoriteStockInfo[]
  >({
    queryKey: ["favoriteStocks"],
    queryFn: () => fetchFavoriteStocks(),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stockCode: string) => {
      const res = await defaultClient.post("/api/members/me/favorites", {
        stockCode,
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to add favorite");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteStocks"] });
    },
  });
}

export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stockCode: string) => {
      // Assuming DELETE also accepts body or we send it as data
      const res = await defaultClient.delete("/api/members/me/favorites", {
        data: { stockCode },
      });
      if (res.status !== 200) {
        throw new Error("Failed to delete favorite");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteStocks"] });
    },
  });
}
