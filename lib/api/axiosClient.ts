import axios, { AxiosInstance, AxiosError } from "axios";
import camelcaseKeys from "camelcase-keys";

/**
 * 중앙화된 axios 클라이언트
 * - 기본 baseURL은 환경변수 NEXT_PUBLIC_API_URL 또는 '/api'를 사용합니다.
 * - 브라우저에서 쿠키 기반 인증을 사용하는 경우를 대비해 withCredentials를 true로 설정합니다.
 * - 요청 인터셉터에서 필요 시 Authorization 헤더를 붙일 수 있도록 훅을 제공합니다.
 */

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export interface CreateClientOptions {
  baseURL?: string;
  getToken?: () => string | null | undefined;
}

export function createAxiosClient(
  options?: CreateClientOptions
): AxiosInstance {
  const baseURL = options?.baseURL ?? DEFAULT_BASE_URL;

  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 요청 인터셉터: getToken이 전달되면 Authorization 헤더 추가
  client.interceptors.request.use((config: any) => {
    const token = options?.getToken?.();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // 응답 인터셉터: 에러 표준화 및 401 처리용 훅
  client.interceptors.response.use(
    (res) => {
      // 응답 데이터의 키들을 재귀적으로 camelCase로 변환합니다.
      try {
        if (res && res.data && typeof res.data === "object") {
          res.data = camelcaseKeys(res.data, { deep: true });
        }
      } catch (e) {
        // 변환 중 문제가 생기면 원본 데이터를 그대로 반환합니다.
        // (변환 실패가 요청 자체 실패로 이어지지 않도록 방어)
        // eslint-disable-next-line no-console
        console.warn("camelcase-keys 변환 실패:", e);
      }
      return res;
    },
    (error: AxiosError) => {
      // 에러 응답의 데이터도 camelCase로 변환하여 호출자에서 일관된 형태로 처리할 수 있게 합니다.
      try {
        if ((error as any).response && (error as any).response.data && typeof (error as any).response.data === "object") {
          (error as any).response.data = camelcaseKeys((error as any).response.data, { deep: true });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("camelcase-keys 변환 실패(에러 응답):", e);
      }
      // 여기서 공통 에러 처리 (로그아웃, 토큰 리프레시 시도 등)를 추가할 수 있습니다.
      return Promise.reject(error);
    }
  );

  return client;
}

// 기본 익스포트: 단순한 사용성을 위해 프로젝트 전역에서 재사용 가능한 인스턴스를 제공합니다.
const defaultClient = createAxiosClient();

export default defaultClient;
