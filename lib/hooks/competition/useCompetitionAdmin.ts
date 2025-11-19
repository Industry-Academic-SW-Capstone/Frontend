import { useMutation, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { UpdateCompetitionRequest } from "@/lib/types/stock";

interface UseCompetitionAdminProps {
  contestId: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useCompetitionAdmin = ({
  contestId,
  onSuccess,
  onError,
}: UseCompetitionAdminProps) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCompetitionRequest) => {
      const response = await defaultClient.put(
        `/api/contests/${contestId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      queryClient.invalidateQueries({ queryKey: ["competition", contestId] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await defaultClient.delete(`/api/contests/${contestId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });

  return {
    updateCompetition: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCompetition: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
