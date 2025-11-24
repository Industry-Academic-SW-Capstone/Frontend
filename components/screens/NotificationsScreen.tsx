"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import * as Icons from "@/components/icons/Icons";
import { useNotifications } from "@/lib/hooks/notifications/useNotifications";
import { useNotificationMutations } from "@/lib/hooks/notifications/useNotificationMutations";
import {
  getNotificationConfig,
  isTokenRegistered,
  requestNotificationPermission,
} from "@/lib/services/notificationService";
import {
  NotificationResponse,
  NotificationType,
} from "@/lib/types/notification";

const NotificationsScreen: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useNotifications();

  const { markAsRead, markAllAsRead, deleteNotification } =
    useNotificationMutations();

  const { ref, inView } = useInView();

  const [isPushEnabled, setIsPushEnabled] = useState(false);

  useEffect(() => {
    // Check initial token status
    setIsPushEnabled(isTokenRegistered());
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Listen for real-time updates
  useEffect(() => {
    const handleNotificationUpdate = () => {
      refetch();
    };
    window.addEventListener("notificationUpdate", handleNotificationUpdate);
    return () => {
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate
      );
    };
  }, [refetch]);

  const notifications = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.notifications);
  }, [data]);

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("알림을 삭제하시겠습니까?")) {
      deleteNotification(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (window.confirm("모든 알림을 읽음 처리하시겠습니까?")) {
      markAllAsRead();
    }
  };

  const handleEnablePush = async () => {
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      setIsPushEnabled(true);
    } else {
      alert("알림 권한이 차단되어 있습니다. 브라우저 설정에서 허용해주세요.");
    }
  };

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: NotificationResponse[] } = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const dateStr = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).toDateString();

      let groupKey = "";
      if (dateStr === today.toDateString()) {
        groupKey = "오늘";
      } else if (dateStr === yesterday.toDateString()) {
        groupKey = "어제";
      } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        groupKey = "이번 주";
      } else {
        groupKey = `${date.getMonth() + 1}월 ${date.getDate()}일`;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }, [notifications]);

  const getNotificationIcon = (type: NotificationType) => {
    const config = getNotificationConfig(type);
    const iconClass = "w-5 h-5 text-white";

    let IconComponent;
    switch (type) {
      case NotificationType.EXECUTION:
        IconComponent = Icons.CheckCircleIcon;
        break;
      case NotificationType.RANKING:
        IconComponent = Icons.TrophyIcon;
        break;
      case NotificationType.ACHIEVEMENT:
        IconComponent = Icons.SparklesIcon;
        break;
      case NotificationType.CONTEST:
        IconComponent = Icons.FlagIcon;
        break;
      default:
        IconComponent = Icons.BellIcon;
        break;
    }

    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
        style={{ backgroundColor: config.color }}
      >
        <IconComponent className={iconClass} />
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const parseDetailData = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-secondary">
      {/* Header */}
      <div className="sticky top-0 bg-bg-secondary/90 backdrop-blur-md z-10 px-5 py-4 flex items-center justify-between border-b border-border-color">
        <h1 className="text-2xl font-bold text-text-primary">알림</h1>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            {!isPushEnabled && (
              <button
                onClick={handleEnablePush}
                className="p-1.5 rounded-full bg-bg-secondary text-text-primary hover:bg-bg-secondary/80 transition-colors"
                title="알림 켜기"
              >
                <Icons.BellAlertIcon className="w-5 h-5" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-text-primary hover:text-text-primary/80 transition-colors"
              >
                모두 읽음
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sm font-medium text-text-primary hover:text-text-primary/80 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-8 h-8 border-4 border-[#e5e8eb] border-t-[#3182f6] rounded-full animate-spin" />
          </div>
        ) : Object.keys(groupedNotifications).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <Icons.BellIcon className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-lg font-bold text-text-secondary">
              새로운 알림이 없습니다
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([dateGroup, items]) => (
            <div key={dateGroup} className="mb-6 animate-fadeIn">
              <h3 className="text-[13px] font-semibold text-text-secondary mb-2 mt-6 first:mt-2">
                {dateGroup}
              </h3>
              <div className="space-y-0">
                {items.map((notification) => {
                  const detailData = parseDetailData(notification.detailData);
                  return (
                    <div
                      key={notification.notificationId}
                      onClick={() =>
                        !notification.isRead &&
                        handleMarkAsRead(notification.notificationId)
                      }
                      className={`flex gap-4 py-4 border-b border-border-color last:border-0 transition-colors duration-200 active:bg-bg-third cursor-pointer group relative`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 pt-0.5 ${
                          notification.isRead
                            ? "text-text-secondary/80"
                            : "text-text-primary"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4
                            className={`text-[16px] font-semibold leading-snug ${
                              !notification.isRead
                                ? "text-text-primary"
                                : "text-text-secondary/80"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-text-secondary whitespace-nowrap ml-2 mt-0.5">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-[14px] leading-relaxed line-clamp-2 ${
                            !notification.isRead
                              ? "text-text-secondary"
                              : "text-text-secondary/80"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {/* Detail Data Chips */}
                        {detailData && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {detailData.ticker && (
                              <span className="px-2 py-0.5 bg-bg-secondary rounded text-[11px] font-medium text-text-secondary">
                                {detailData.ticker}
                              </span>
                            )}
                            {detailData.price && (
                              <span className="px-2 py-0.5 bg-bg-secondary rounded text-[11px] font-medium text-text-secondary">
                                {Number(detailData.price).toLocaleString()}원
                              </span>
                            )}
                            {detailData.rankChange && (
                              <span className="px-2 py-0.5 bg-bg-secondary rounded text-[11px] font-medium text-text-secondary">
                                {detailData.rankChange > 0
                                  ? `+${detailData.rankChange}`
                                  : detailData.rankChange}
                                위
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete Button (Visible on hover/swipe in mobile - simplified for now) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.notificationId);
                        }}
                        className="absolute right-0 top-4 p-2 text-text-secondary hover:text-text-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icons.XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-border-color border-t-text-secondary rounded-full animate-spin" />
          </div>
        )}
        <div ref={ref} className="h-1" />
      </div>
    </div>
  );
};

export default NotificationsScreen;
