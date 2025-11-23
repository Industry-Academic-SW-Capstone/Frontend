import { useInfiniteQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import {
  NotificationPageResponse,
  NotificationType,
} from "@/lib/types/notification";

export const useNotifications = (type?: NotificationType) => {
  return useInfiniteQuery<NotificationPageResponse>({
    queryKey: ["notifications", type],
    queryFn: async ({ pageParam = 0 }) => {
      const params: any = { page: pageParam, size: 20 };
      if (type) {
        params.type = type;
      }

      // If type is provided, use the filter endpoint, otherwise use the general endpoint
      // Note: The backend API for filter returns List<NotificationResponse>, not Page.
      // However, the requirement says "fetch list, infinite query".
      // Let's check the backend controller again.
      // The filter endpoint returns List<NotificationResponse>, so it might not support pagination directly or it's a simple list.
      // But the main endpoint supports pagination.

      if (type) {
        const { data } = await defaultClient.get<any>(
          `/api/notifications/filter`,
          { params: { type } }
        );
        // Wrap list in page response structure for consistency if needed, or handle differently.
        // Since the filter endpoint returns a list, we can't really paginate it the same way unless the backend supports it.
        // For now, let's assume the filter endpoint is just a list and we might not use infinite query for it,
        // OR we simulate a single page response.
        return {
          notifications: data,
          currentPage: 0,
          totalPages: 1,
          totalElements: data.length,
          hasNext: false,
        };
      } else {
        const { data } = await defaultClient.get<NotificationPageResponse>(
          "/api/notifications",
          { params }
        );
        return data;
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });
};
