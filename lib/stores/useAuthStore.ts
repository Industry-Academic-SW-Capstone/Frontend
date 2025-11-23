import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { deleteFCMToken } from "@/lib/services/notificationService";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

/**
 * 인증 상태(JWT 토큰)를 관리하는 Zustand 스토어
 * - 'persist' 미들웨어를 사용하여 localStorage에 자동 저장/복원합니다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token: string) => {
        set({ token });
      },
      clearToken: () => {
        // FCM 토큰 삭제 (비동기지만 로그아웃 처리는 즉시 진행)
        deleteFCMToken().catch((err) =>
          console.error("Failed to delete FCM token on logout:", err)
        );

        set({ token: null });
        try {
          localStorage.removeItem("auth-token");
        } catch (e) {
          console.error("Failed to remove token from storage", e);
        }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-token", // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // localStorage 사용
    }
  )
);

// [중요] Axios 인터셉터 등 React 외부에서 스토어 상태를 읽기 위한 non-hook getter
export const getAuthToken = () => useAuthStore.getState().token;
export const isAuthenticated = () => !!useAuthStore.getState().token;

// [중요] 401 에러 발생 시 React 외부에서 호출할 로그아웃 함수
export const clearAuthToken = () => useAuthStore.getState().clearToken();
