import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";

export interface StockDetail {
  stockCode: string;
  stockName: string;
  styleTag: string;
  description: string;
}

export interface StyleBreakdown {
  styleTag: string;
  percentage: number;
}

export interface PersonaMatch {
  name: string;
  percentage: number;
  philosophy: string;
}

export interface Summary {
  marketCap: number;
  per: number;
  pbr: number;
  roe: number;
  debtRatio: number;
  dividendYield: number;
}

export interface PortfolioAnalysisResponse {
  stockDetails: StockDetail[];
  summary: Record<string, number>;
  styleBreakdown: StyleBreakdown[];
  personaMatch: PersonaMatch[];
}

const fetchPortfolioAnalysis = async (accountId: string) => {
  const response = await defaultClient.get<PortfolioAnalysisResponse>(
    `/api/portfolio/analyze`,
    {
      params: { accountId },
    }
  );
  console.log(response.data);
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
