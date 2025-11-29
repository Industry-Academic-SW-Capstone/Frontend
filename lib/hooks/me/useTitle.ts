import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { AxiosError } from "axios";

import { MemberTitle } from "@/lib/types/mission";

// GET /api/members/title response type (MemberTitle)
// PATCH /api/members/title request body type
interface UpdateTitleRequest {
  titleId: number | null;
}

// Fetch current title
export const useMyTitle = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["myTitle"],
    queryFn: async () => {
      const { data } = await defaultClient.get<MemberTitle>(
        "/api/members/title"
      );
      return data;
    },
    enabled,
  });
};

// Update title
export const useUpdateTitle = () => {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, UpdateTitleRequest>({
    mutationFn: async (body) => {
      const { data } = await defaultClient.patch<string>(
        "/api/members/title",
        body
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["myTitle"] });
      queryClient.invalidateQueries({ queryKey: ["info"] }); // In case info also carries title
    },
  });
};
