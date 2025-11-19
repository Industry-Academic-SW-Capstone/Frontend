import { useMutation, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { JoinCompetitionRequest } from "@/lib/types/stock";

interface UseCompetitionJoinProps {
  contestId: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useCompetitionJoin = ({
  contestId,
  onSuccess,
  onError,
}: UseCompetitionJoinProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JoinCompetitionRequest) => {
      const response = await defaultClient.post(
        `/api/contests/${contestId}/join`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate accounts query to refresh the list and show the new competition account
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
