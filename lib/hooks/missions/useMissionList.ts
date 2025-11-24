import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { MissionListItem, MemberTitle } from "@/lib/types/mission";

export const useMissionList = (track: string = "ALL") => {
  return useQuery({
    queryKey: ["missions", track],
    queryFn: async () => {
      const { data } = await defaultClient.get<MissionListItem[]>(
        "/api/missions",
        {
          params: { track },
        }
      );
      return data;
    },
  });
};

export const useMissionTitles = () => {
  return useQuery({
    queryKey: ["missionTitles"],
    queryFn: async () => {
      const { data } = await defaultClient.get<MemberTitle[]>(
        "/api/missions/titles"
      );
      return data;
    },
  });
};
