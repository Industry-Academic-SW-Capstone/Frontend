import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { UnreadCountResponse } from "@/lib/types/notification";

export const useUnreadCount = () => {
  return useQuery<UnreadCountResponse>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await defaultClient.get<UnreadCountResponse>(
        "/api/notifications/unread-count"
      );
      return data;
    },
    // Refetch periodically or rely on invalidation
    refetchInterval: 60000, // Check every minute as a fallback
  });
};
