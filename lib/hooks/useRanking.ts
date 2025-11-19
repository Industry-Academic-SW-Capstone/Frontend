import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { RankingResponse, MyRankingResponse } from "@/lib/types/stock";
import { useAccountStore } from "@/lib/store/useAccountStore";

const fetchMainRanking = async (sortBy: string): Promise<RankingResponse> => {
  const response = await defaultClient.get<RankingResponse>(
    `/api/rankings/main?sortBy=${sortBy}`
  );
  return response.data;
};

const fetchContestRanking = async (
  contestId: number,
  sortBy: string
): Promise<RankingResponse> => {
  const response = await defaultClient.get<RankingResponse>(
    `/api/rankings/contest/${contestId}?sortBy=${sortBy}`
  );
  return response.data;
};

const fetchMyRanking = async (
  memberId: number,
  contestId: number
): Promise<MyRankingResponse> => {
  const response = await defaultClient.get<MyRankingResponse>(
    `/api/rankings/me?memberId=${memberId}&contestId=${contestId}`
  );
  return response.data;
};

export const useRanking = (sortBy: "balance" | "returnRate" = "balance") => {
  const { selectedAccount } = useAccountStore();

  return useQuery({
    queryKey: ["ranking", selectedAccount?.id, sortBy],
    queryFn: () => {
      if (!selectedAccount) throw new Error("No account selected");

      if (selectedAccount.type === "regular") {
        return fetchMainRanking(sortBy);
      } else {
        return fetchContestRanking(selectedAccount.contestId, sortBy);
      }
    },
    enabled: !!selectedAccount,
  });
};

export const useMyRanking = () => {
  const { selectedAccount } = useAccountStore();

  return useQuery({
    queryKey: ["myRanking", selectedAccount?.id],
    queryFn: () => {
      if (!selectedAccount) throw new Error("No account selected");
      return fetchMyRanking(
        selectedAccount.memberId,
        selectedAccount.contestId
      );
    },
    enabled: !!selectedAccount,
  });
};
