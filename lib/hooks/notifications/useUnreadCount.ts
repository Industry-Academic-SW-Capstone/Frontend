import { useQuery, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { UnreadCountResponse } from "@/lib/types/notification";
import { useEffect } from "react";

export const useUnreadCount = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNotificationUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    };

    window.addEventListener("notificationUpdate", handleNotificationUpdate);

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "NOTIFICATION_RECEIVED") {
        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count"],
        });
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );
    }

    return () => {
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate
      );
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, [queryClient]);

  return useQuery<UnreadCountResponse>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await defaultClient.get<UnreadCountResponse>(
        "/api/notifications/unread-count"
      );
      return data;
    },
    enabled: options?.enabled,
    staleTime: Infinity, // Rely on invalidation
  });
};
