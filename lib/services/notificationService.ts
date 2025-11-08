import type {
  Notification as AppNotification,
  NotificationType,
} from "../types/stock";

// 알림 권한 상태 확인
export const checkNotificationPermission = (): NotificationPermission => {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
};

// 알림 권한 요청
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.warn("이 브라우저는 알림을 지원하지 않습니다.");
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return "denied";
    }
  };

// 서비스 워커 등록
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!("serviceWorker" in navigator)) {
      console.warn("이 브라우저는 서비스 워커를 지원하지 않습니다.");
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("서비스 워커가 성공적으로 등록되었습니다:", registration);
      return registration;
    } catch (error) {
      console.error("서비스 워커 등록 실패:", error);
      return null;
    }
  };

// 푸시 구독
export const subscribeToPush = async (
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> => {
  try {
    // VAPID 공개 키 (실제 환경에서는 환경 변수로 관리)
    // 이것은 테스트용 키이며, 실제 운영 환경에서는 서버에서 생성한 키를 사용해야 합니다.
    const vapidPublicKey =
      "BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrCD6A0wvN0Q8OhqmC7Zr6qTmUmVgIIHpN95ckscMgU1XmZ-rI8";

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as any,
    });

    console.log("푸시 구독 성공:", subscription);

    // 실제 환경에서는 이 구독 정보를 서버에 전송해야 합니다.
    // await fetch('/api/subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify(subscription),
    //   headers: { 'Content-Type': 'application/json' },
    // });

    return subscription;
  } catch (error) {
    console.error("푸시 구독 실패:", error);
    return null;
  }
};

// VAPID 키 변환 헬퍼 함수
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 로컬 알림 표시
export const showLocalNotification = (
  title: string,
  options?: NotificationOptions
): void => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/logo.svg",
      badge: "/logo.svg",
      ...options,
    });
  }
};

// 서비스 워커를 통한 푸시 알림 표시 (백그라운드에서도 작동)
export const showPushNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification(title, {
    icon: "/logo.svg",
    badge: "/logo.svg",
    tag: "stonkapp-notification",
    requireInteraction: false,
    ...options,
  });
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

  // 최대 100개까지만 저장
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
    // Date 객체로 변환
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

  // 로컬 저장
  saveNotification(notification);

  // 푸시 알림 표시
  const config = getNotificationConfig(randomNotif.type);

  try {
    await showPushNotification(randomNotif.title, {
      body: randomNotif.message,
      icon: "/logo.svg",
      badge: "/logo.svg",
      tag: notification.id,
      data: notification,
    });
  } catch (error) {
    // 서비스 워커를 사용할 수 없으면 로컬 알림으로 대체
    showLocalNotification(randomNotif.title, {
      body: randomNotif.message,
    });
  }

  // CustomEvent로 알림 업데이트 전파
  window.dispatchEvent(new CustomEvent("notificationUpdate"));
};
