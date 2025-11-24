import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";

export interface StockDetail {
  stock_code: string;
  stock_name: string;
  style_tag: string;
  description: string;
}

export interface StyleBreakdown {
  style_tag: string;
  percentage: number;
}

export interface PersonaMatch {
  name: string;
  percentage: number;
  philosophy: string;
}

export interface PortfolioAnalysisResponse {
  stock_details: StockDetail[];
  summary: Record<string, number>;
  style_breakdown: StyleBreakdown[];
  persona_match: PersonaMatch[];
}

const fetchPortfolioAnalysis = async (accountId: string) => {
  const response = await defaultClient.get<PortfolioAnalysisResponse>(
    `/api/portfolio/analyze`,
    {
      params: { accountId },
    }
  );
  return response.data;
};

export const usePortfolioAnalysis = (
  accountId: string | null,
  options?: { enabled?: boolean }
) => {
  const { data, isLoading, isError, refetch, isFetching, error } = useQuery({
    queryFn: () => fetchPortfolioAnalysis(accountId!),
    queryKey: ["portfolioAnalysis", accountId],
    enabled: !!accountId && options?.enabled,
  });

  return { data, isLoading, isError, refetch, isFetching, error };
};
