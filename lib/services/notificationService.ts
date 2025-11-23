import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
} from "firebase/messaging";
import defaultClient from "../api/axiosClient";
import { NotificationType } from "../types/notification";

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

      // Dispatch event to trigger React Query refetch
      window.dispatchEvent(new CustomEvent("notificationUpdate"));
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
      if (typeof window !== "undefined") {
        localStorage.setItem("fcm_registered", "true");
      }
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("fcm_registered");
    }
    console.log("FCM token deleted");
  } catch (error) {
    console.error("Failed to delete FCM token:", error);
  }
};

// 토큰 등록 여부 확인
export const isTokenRegistered = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("fcm_registered") === "true";
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
    [NotificationType.EXECUTION]: {
      icon: "✅",
      color: "#22c55e",
    },
    [NotificationType.RANKING]: {
      icon: "🏆",
      color: "#f59e0b",
    },
    [NotificationType.ACHIEVEMENT]: {
      icon: "🎉",
      color: "#9333ea",
    },
    [NotificationType.CONTEST]: {
      icon: "🏅",
      color: "#4f46e5",
    },
    [NotificationType.SYSTEM]: {
      icon: "ℹ️",
      color: "#64748b",
    },
  };

  return configs[type] || configs[NotificationType.SYSTEM];
};
