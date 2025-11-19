import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router"; // 리디렉션용 (선택 사항)
import { useAuthStore } from "@/lib/stores/useAuthStore"; // Zustand 스토어
import defaultClient from "@/lib/api/axiosClient"; // 생성한 axios 클라이언트
import { LoginRequest, LoginResponse } from "@/lib/types/auth"; // 위에서 정의한 타입
import { AxiosError } from "axios";

const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await defaultClient.post<LoginResponse>(
    "/api/members/login",
    credentials
  );
  return response.data;
};

/**
 * 로그인 뮤테이션을 위한 커스텀 훅
 * - 로그인 성공 시 토큰을 Zustand 스토어에 저장합니다.
 * - React-query 캐시를 정리합니다.
 */
export const useLogin = () => {
  const { setToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse, // 성공 시 반환될 타입
    AxiosError, // 에러 타입 (axios 기준)
    LoginRequest // mutation 함수에 전달될 변수(Variables) 타입
  >({
    mutationFn: loginApi, // API 호출 함수
    onSuccess: (data: LoginResponse) => {
      setToken(data.accessToken);

      queryClient.clear();
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
