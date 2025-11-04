"use client";
import React, { useState, useEffect } from 'react';
import type { Notification as AppNotification } from '@/lib/types';
import * as Icons from '@/components/icons/Icons';
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationConfig,
  sendTestNotification,
} from '@/lib/services/notificationService';

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = () => {
    const stored = getStoredNotifications();
    setNotifications(stored);
  };

  useEffect(() => {
    loadNotifications();

    // 알림 업데이트 이벤트 리스너
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
    };
  }, []);

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

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
    if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
      clearAllNotifications();
      loadNotifications();
    }
  };

  const handleSendTest = async () => {
    await sendTestNotification();
    // 이벤트가 발생하면 자동으로 loadNotifications 호출됨
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    const config = getNotificationConfig(type);
    
    switch (type) {
      case 'order_filled':
        return <Icons.CheckCircleIcon className="w-6 h-6" style={{ color: config.color }} />;
      case 'ranking_up':
        return <Icons.TrophyIcon className="w-6 h-6" style={{ color: config.color }} />;
      case 'achievement':
        return <Icons.SparklesIcon className="w-6 h-6" style={{ color: config.color }} />;
      case 'competition':
        return <Icons.FlagIcon className="w-6 h-6" style={{ color: config.color }} />;
      default:
        return <Icons.BellIcon className="w-6 h-6" style={{ color: config.color }} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
  <div className="sticky top-0 bg-bg-primary backdrop-blur-xl z-10 border-b border-border-color shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4 animate-fadeInUp">
            <h1 className="text-2xl font-bold text-text-primary">알림</h1>
            <button
              onClick={handleSendTest}
              className="px-4 py-2 bg-secondary text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ripple"
            >
              <span className="relative z-10">테스트 알림</span>
            </button>
          </div>

          {/* 필터 및 액션 */}
          <div className="flex items-center justify-between animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  filter === 'all'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                전체 ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 relative ${
                  filter === 'unread'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                읽지 않음 ({unreadCount})
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-negative rounded-full animate-pulse" />
                )}
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary font-bold hover:underline"
                  >
                    모두 읽음
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-sm text-text-secondary font-bold hover:text-negative"
                >
                  전체 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeInScale">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-float">
              <Icons.BellIcon className="w-12 h-12 text-primary opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
            </h3>
            <p className="text-text-secondary">
              {filter === 'unread'
                ? '모든 알림을 확인했습니다.'
                : '새로운 알림이 도착하면 여기에 표시됩니다.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-color">
            {filteredNotifications.map((notification, index) => {
              const config = getNotificationConfig(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 transition-all duration-300 card-hover cursor-pointer relative overflow-hidden group ${notification.read ? 'bg-bg-primary' : 'bg-primary/10'} animate-fadeInUp`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />
                  
                  <div className="flex gap-3 relative z-10">
                    {/* 아이콘 */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-text-primary transition-colors duration-300 group-hover:text-primary">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1 animate-pulse shadow-lg" />
                        )}
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-2 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* 메타데이터 표시 */}
                      {notification.metadata && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {notification.metadata.ticker && (
                            <span className="px-2.5 py-1 bg-primary/10 rounded-lg text-xs font-bold text-primary border border-primary/20">
                              {notification.metadata.ticker}
                            </span>
                          )}
                          {notification.metadata.shares && (
                            <span className="px-2.5 py-1 bg-bg-secondary rounded-lg text-xs font-medium text-text-secondary">
                              {notification.metadata.shares}주
                            </span>
                          )}
                          {notification.metadata.price && (
                            <span className="px-2.5 py-1 bg-bg-secondary rounded-lg text-xs font-medium text-text-secondary">
                              {notification.metadata.price.toLocaleString()}원
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary font-medium">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1.5 text-text-secondary hover:text-negative transition-all duration-300 hover:scale-110 hover:rotate-90 rounded-full hover:bg-negative/10"
                        >
                          <Icons.XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner decoration for unread */}
                  {!notification.read && (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-primary/20 rounded-bl-full" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
