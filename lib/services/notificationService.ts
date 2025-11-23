import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
} from "firebase/messaging";
import defaultClient from "../api/axiosClient";
import type {
  Notification as AppNotification,
  NotificationType,
} from "../types/stock";

const firebaseConfig = {
  apiKey: "AIzaSyBYSh2TsK2F9ZigoyF-QYMIVLxw6Wa3l88",
  authDomain: "stockit-7a0f4.firebaseapp.com",
  projectId: "stockit-7a0f4",
  storageBucket: "stockit-7a0f4.firebasestorage.app",
  messagingSenderId: "811459523193",
  appId: "1:811459523193:web:ea0bc8904890a6d07a1aa8",
  measurementId: "G-K37M1BKTPY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging: any = null;

if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      const title = payload.notification?.title || "StockIt";
      const options = {
        body: payload.notification?.body,
        icon: "/new_logo.png",
        badge: "/new_logo.png",
        data: payload.data,
      };
      showLocalNotification(title, options);
    });
  } catch (err) {
    console.error("Firebase Messaging initialization failed", err);
  }
}

// 알림 권한 상태 확인
export const checkNotificationPermission = (): NotificationPermission => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
};

// 알림 권한 요청 및 토큰 등록
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("이 브라우저는 알림을 지원하지 않습니다.");
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await registerFCMToken();
      }
      return permission;
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return "denied";
    }
  };

// 서비스 워커 등록
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("서비스 워커가 성공적으로 등록되었습니다:", registration);
      return registration;
    } catch (error) {
      console.error("서비스 워커 등록 실패:", error);
      return null;
    }
  };

// FCM 토큰 등록
export const registerFCMToken = async () => {
  if (!messaging) return;

  try {
    const registration = await registerServiceWorker();
    if (!registration) return;

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      await sendTokenToServer(currentToken);
    } else {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

// 토큰 서버 전송
const sendTokenToServer = async (token: string) => {
  try {
    await defaultClient.put("/api/members/fcm-token", { fcm_token: token });
    console.log("FCM token sent to server");
  } catch (error) {
    console.error("Failed to send FCM token to server:", error);
  }
};

// FCM 토큰 삭제
export const deleteFCMToken = async () => {
  if (!messaging) return;
  try {
    await deleteToken(messaging);
    await defaultClient.delete("/api/members/fcm-token");
    console.log("FCM token deleted");
  } catch (error) {
    console.error("Failed to delete FCM token:", error);
  }
};

// 로컬 알림 표시
export const showLocalNotification = (
  title: string,
  options?: NotificationOptions
): void => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/new_logo.png",
      badge: "/new_logo.png",
      ...options,
    });
  }
};

// 알림 타입에 따른 아이콘 및 스타일 결정
export const getNotificationConfig = (type: NotificationType) => {
  const configs = {
    order_filled: {
      icon: "✅",
      color: "#22c55e",
    },
    ranking_up: {
      icon: "🏆",
      color: "#f59e0b",
    },
    achievement: {
      icon: "🎉",
      color: "#9333ea",
    },
    competition: {
      icon: "🏅",
      color: "#4f46e5",
    },
    system: {
      icon: "ℹ️",
      color: "#64748b",
    },
  };

  return configs[type] || configs.system;
};

// 알림 생성 헬퍼
export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  metadata?: any
): AppNotification => {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    timestamp: new Date(),
    read: false,
    metadata,
  };
};

// 로컬 스토리지에 알림 저장
export const saveNotification = (notification: AppNotification): void => {
  const notifications = getStoredNotifications();
  notifications.unshift(notification);

  if (notifications.length > 100) {
    notifications.pop();
  }

  localStorage.setItem("notifications", JSON.stringify(notifications));
};

// 저장된 알림 가져오기
export const getStoredNotifications = (): AppNotification[] => {
  try {
    const stored = localStorage.getItem("notifications");
    if (!stored) return [];

    const notifications = JSON.parse(stored);
    return notifications.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  } catch (error) {
    console.error("알림 로드 실패:", error);
    return [];
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getStoredNotifications();
  const updated = notifications.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  localStorage.setItem("notifications", JSON.stringify(updated));
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = (): void => {
  const notifications = getStoredNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  localStorage.setItem("notifications", JSON.stringify(updated));
};

// 알림 삭제
export const deleteNotification = (notificationId: string): void => {
  const notifications = getStoredNotifications();
  const filtered = notifications.filter((n) => n.id !== notificationId);
  localStorage.setItem("notifications", JSON.stringify(filtered));
};

// 모든 알림 삭제
export const clearAllNotifications = (): void => {
  localStorage.setItem("notifications", JSON.stringify([]));
};

// 읽지 않은 알림 개수
export const getUnreadCount = (): number => {
  const notifications = getStoredNotifications();
  return notifications.filter((n) => !n.read).length;
};

// 테스트 알림 전송
export const sendTestNotification = async (): Promise<void> => {
  const testNotifications = [
    {
      type: "order_filled" as NotificationType,
      title: "주문 체결 완료",
      message: "삼성전자 50주 매수 주문이 체결되었습니다.",
      metadata: {
        ticker: "005930",
        orderType: "buy",
        shares: 50,
        price: 82000,
      },
    },
    {
      type: "ranking_up" as NotificationType,
      title: "랭킹 상승!",
      message: "축하합니다! 전체 랭킹이 3단계 상승했습니다. (7위 → 4위)",
      metadata: { rankChange: 3 },
    },
    {
      type: "achievement" as NotificationType,
      title: "업적 달성",
      message: '"포트폴리오 다각화" 업적을 달성했습니다!',
      metadata: { achievementId: "ach-3" },
    },
  ];

  const randomNotif =
    testNotifications[Math.floor(Math.random() * testNotifications.length)];
  const notification = createNotification(
    randomNotif.type,
    randomNotif.title,
    randomNotif.message,
    randomNotif.metadata
  );

  saveNotification(notification);

  // 로컬 알림 표시
  showLocalNotification(randomNotif.title, {
    body: randomNotif.message,
  });

  window.dispatchEvent(new CustomEvent("notificationUpdate"));
};
