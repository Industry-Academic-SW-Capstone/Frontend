import { useMutation, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { RewardResponse } from "@/lib/types/mission";

export const useAnalyzePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await defaultClient.post<RewardResponse>(
        "/api/missions/analyze-portfolio"
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["missionDashboard"] });
    },
  });
};

export const useAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await defaultClient.post<RewardResponse>(
        "/api/missions/attendance"
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["missionDashboard"] });
    },
  });
};

export const useBankruptcy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await defaultClient.post<RewardResponse>(
        "/api/missions/bankruptcy"
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["missionDashboard"] });
      // Bankruptcy might affect assets/accounts, so invalidate those too if possible
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
};

export const useViewReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await defaultClient.post<RewardResponse>(
        "/api/missions/view-report"
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["missionDashboard"] });
    },
  });
};
