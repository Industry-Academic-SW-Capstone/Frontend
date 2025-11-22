import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import {
  AssetInfo,
  AccountAssetHolding,
  AccountAssets,
} from "@/lib/types/stock";

const fetchAccountAssets = async (accountId: number): Promise<AssetInfo> => {
  const response = await defaultClient.get<AccountAssets>(
    `/api/accounts/${accountId}/assets`
  );
  const data = response.data;
  const totalInvested =
    data?.holdings.reduce(
      (sum: number, h: AccountAssetHolding) =>
        sum + h.averagePrice * h.quantity,
      0
    ) ?? 0;
  const totalProfit = data?.stockValue - totalInvested;
  const returnRate =
    totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  return {
    ...data,
    totalInvested,
    totalProfit,
    returnRate,
  };
};

export const useAccountAssets = (accountId: number = 1) => {
  return useQuery({
    queryKey: ["accountAssets", accountId],
    queryFn: () => fetchAccountAssets(accountId),
  });
};
