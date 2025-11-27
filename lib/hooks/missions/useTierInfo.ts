import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { TierResponse } from "@/lib/types/mission";

export const useTierInfo = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["tierInfo"],
    queryFn: async () => {
      const { data } = await defaultClient.get<TierResponse>(
        "/api/missions/tier"
      );
      return data;
    },
    enabled,
  });
};
