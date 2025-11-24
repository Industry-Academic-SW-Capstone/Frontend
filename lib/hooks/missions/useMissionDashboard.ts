import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { MissionDashboard } from "@/lib/types/mission";

export const useMissionDashboard = () => {
  return useQuery({
    queryKey: ["missionDashboard"],
    queryFn: async () => {
      const { data } = await defaultClient.get<MissionDashboard>(
        "/api/missions/dashboard"
      );
      return data;
    },
  });
};
