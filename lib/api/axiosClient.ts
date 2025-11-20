import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";
import { getAuthToken, clearAuthToken } from "@/lib/stores/useAuthStore";

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export interface CreateClientOptions {
  baseURL?: string;
}

export function createAxiosClient(): AxiosInstance {
  const baseURL = DEFAULT_BASE_URL;

  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 요청 인터셉터: (Zustand 스토어에서 토큰을 가져옴)
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Zustand 스토어에서 직접 토큰을 가져옵니다.
      const token = getAuthToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // 요청 데이터 snake-case로 변환
      try {
        if (
          config.data &&
          (typeof config.data === "object" || Array.isArray(config.data))
        ) {
          config.data = decamelizeKeys(config.data, { deep: true });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("decamelize-keys 변환 실패:", e);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터:
  client.interceptors.response.use(
    (res) => {
      // 응답 데이터 camelCase로 변환
      try {
        if (
          res &&
          res.data &&
          (typeof res.data === "object" || Array.isArray(res.data))
        ) {
          res.data = camelcaseKeys(res.data, { deep: true });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("camelcase-keys 변환 실패:", e);
      }
      return res;
    },
    (error: AxiosError) => {
      // 401 Unauthorized 에러 발생 시 자동 로그아웃 처리
      if (error.response?.status === 401) {
        clearAuthToken();

        // 로그인 페이지로 리디렉션
        if (typeof window !== "undefined") {
          window.location.href = "/pwa";
        }
      }

      // 에러 응답 데이터 camelCase로 변환
      try {
        if (
          error.response &&
          error.response.data &&
          (typeof error.response.data === "object" ||
            Array.isArray(error.response.data))
        ) {
          (error.response as any).data = camelcaseKeys(error.response.data, {
            deep: true,
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("camelcase-keys 변환 실패(에러 응답):", e);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

const defaultClient = createAxiosClient();

export default defaultClient;
