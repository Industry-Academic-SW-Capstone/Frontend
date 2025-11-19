import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";

export interface AccountAssetHolding {
  stockCode: string;
  stockName: string;
  marketType: string;
  quantity: number;
  currentPrice: number;
  averagePrice: number;
  totalValue: number;
}

export interface AccountAssets {
  totalAssets: number;
  cash: number;
  stockValue: number;
  holdings: AccountAssetHolding[];
}

const fetchAccountAssets = async (
  accountId: number
): Promise<AccountAssets> => {
  const response = await defaultClient.get<AccountAssets>(
    `/api/accounts/${accountId}/assets`
  );
  return response.data;
};

export const useAccountAssets = (accountId: number = 1) => {
  return useQuery({
    queryKey: ["accountAssets", accountId],
    queryFn: () => fetchAccountAssets(accountId),
  });
};
