export enum NotificationType {
  EXECUTION = "EXECUTION",
  RANKING = "RANKING",
  ACHIEVEMENT = "ACHIEVEMENT",
  CONTEST = "CONTEST",
  SYSTEM = "SYSTEM",
}

export interface NotificationResponse {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  detailData: string; // JSON string
  iconType: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPageResponse {
  notifications: NotificationResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
