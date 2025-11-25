import { useQuery } from "@tanstack/react-query";
import { BasicStockInfo } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

export interface FavoriteItem extends BasicStockInfo {
  favoriteId: number;
  addedAt: string;
}

// Fetch Favorite Items
async function fetchFavoriteStocks(): Promise<FavoriteItem[]> {
  const res = await defaultClient.get<FavoriteItem[]>(
    "/api/members/me/favorites"
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch favorite items");
  }
  return res.data;
}

export function useFavoriteStocks() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<
    FavoriteItem[]
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
      const res = await defaultClient.delete(
        `/api/members/me/favorites/${stockCode}`
      );
      if (res.status !== 204) {
        throw new Error("Failed to delete favorite");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteStocks"] });
    },
  });
}
