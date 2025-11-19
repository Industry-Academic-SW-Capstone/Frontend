"use client";
import React, { useState, useEffect, useMemo } from "react";
import type { Notification as AppNotification } from "@/lib/types/stock";
import * as Icons from "@/components/icons/Icons";
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationConfig,
} from "@/lib/services/notificationService";

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = () => {
    const stored = getStoredNotifications();
    // Sort by timestamp descending
    setNotifications(
      stored.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    );
  };

  useEffect(() => {
    loadNotifications();

    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notificationUpdate", handleNotificationUpdate);
    return () => {
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate
      );
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    return filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm("모든 알림을 삭제하시겠습니까?")) {
      clearAllNotifications();
      loadNotifications();
    }
  };

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: AppNotification[] } = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.timestamp);
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
  }, [filteredNotifications]);

  const getNotificationIcon = (type: AppNotification["type"]) => {
    const config = getNotificationConfig(type);
    const iconClass = "w-6 h-6 text-white";

    let IconComponent;
    switch (type) {
      case "order_filled":
        IconComponent = Icons.CheckCircleIcon;
        break;
      case "ranking_up":
        IconComponent = Icons.TrophyIcon;
        break;
      case "achievement":
        IconComponent = Icons.SparklesIcon;
        break;
      case "competition":
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Header */}
      <div className="sticky top-0 bg-bg-primary/90 backdrop-blur-md z-10 px-5 py-4 flex items-center justify-between border-b border-border-color/50">
        <h1 className="text-2xl font-bold text-text-primary">알림</h1>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              모두 읽음
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm font-medium text-text-tertiary hover:text-negative transition-colors"
            >
              지우기
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 flex gap-2 sticky top-[65px] bg-bg-primary z-10">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            filter === "all"
              ? "bg-text-primary text-bg-primary"
              : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            filter === "unread"
              ? "bg-text-primary text-bg-primary"
              : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
          }`}
        >
          읽지 않음
          {unreadCount > 0 && filter !== "unread" && (
            <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-negative rounded-full align-middle mb-0.5" />
          )}
        </button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <Icons.BellIcon className="w-8 h-8 text-text-tertiary" />
            </div>
            <p className="text-lg font-bold text-text-secondary">
              {filter === "unread"
                ? "읽지 않은 알림이 없습니다"
                : "새로운 알림이 없습니다"}
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([dateGroup, items]) => (
            <div key={dateGroup} className="mb-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-text-primary mb-3 mt-2">
                {dateGroup}
              </h3>
              <div className="space-y-4">
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() =>
                      !notification.read && handleMarkAsRead(notification.id)
                    }
                    className={`flex gap-4 p-1 rounded-2xl transition-all duration-200 ${
                      !notification.read ? "opacity-100" : "opacity-60"
                    } hover:bg-bg-secondary/50 cursor-pointer group relative`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold text-text-primary leading-tight mb-1">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-text-tertiary whitespace-nowrap ml-2">
                          {formatTime(new Date(notification.timestamp))}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>

                      {/* Metadata Chips */}
                      {notification.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {notification.metadata.ticker && (
                            <span className="px-2 py-0.5 bg-bg-secondary rounded-md text-xs font-medium text-text-secondary">
                              {notification.metadata.ticker}
                            </span>
                          )}
                          {notification.metadata.price && (
                            <span className="px-2 py-0.5 bg-bg-secondary rounded-md text-xs font-medium text-text-secondary">
                              {notification.metadata.price.toLocaleString()}원
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delete Button (Hover only) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-text-tertiary hover:text-negative opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icons.XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
