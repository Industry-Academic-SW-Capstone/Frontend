import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router"; // 리디렉션용 (선택 사항)
import { useAuthStore } from "@/lib/stores/useAuthStore"; // Zustand 스토어
import defaultClient from "@/lib/api/axiosClient"; // 생성한 axios 클라이언트
import {
  SignUpRequest,
  SignUpResponse,
  UpdateInfoRequest,
} from "@/lib/types/auth"; // 위에서 정의한 타입
import { AxiosError } from "axios";

const putInfoApi = async (
  credentials: UpdateInfoRequest
): Promise<SignUpResponse> => {
  const response = await defaultClient.put<SignUpResponse>(
    "/api/members/me",
    credentials
  );
  return response.data;
};

/**
 * 회원정보 수정을 위한 커스텀 훅
 */
export const usePutInfo = () => {
  return useMutation<
    SignUpResponse, // 성공 시 반환될 타입
    AxiosError, // 에러 타입 (axios 기준)
    UpdateInfoRequest // mutation 함수에 전달될 변수(Variables) 타입
  >({
    mutationFn: putInfoApi, // API 호출 함수
    onSuccess: (data: SignUpResponse) => {},
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });
};

export const fetchInfoApi = async () => {
  const response = await defaultClient.get<SignUpResponse>("/api/members/me");
  return response.data;
};

export const useFetchInfo = (options?: { enabled?: boolean }) => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryFn: fetchInfoApi, // API 호출 함수
    queryKey: ["info"],
    enabled: options?.enabled,
  });

  return { data, isLoading, isError, refetch, isFetching };
};
