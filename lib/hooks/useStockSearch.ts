import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { StockSearchResult } from "@/lib/types/stock";
import { useState, useEffect } from "react";

const fetchStockSearch = async (
  query: string
): Promise<StockSearchResult[]> => {
  if (!query) return [];
  const response = await defaultClient.get<StockSearchResult[]>(
    `/api/stocks/search`,
    {
      params: { q: query },
    }
  );
  return response.data;
};

export const useStockSearch = (searchTerm: string) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  return useQuery({
    queryKey: ["stockSearch", debouncedSearchTerm],
    queryFn: () => fetchStockSearch(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
