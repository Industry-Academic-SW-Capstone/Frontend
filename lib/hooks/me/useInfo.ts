import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient"; // 생성한 axios 클라이언트
import { SignUpResponse, UpdateInfoRequest } from "@/lib/types/auth"; // 위에서 정의한 타입
import { AxiosError } from "axios";
import { useEffect } from "react";

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
  const queryClient = useQueryClient();
  return useMutation<
    SignUpResponse, // 성공 시 반환될 타입
    AxiosError, // 에러 타입 (axios 기준)
    UpdateInfoRequest // mutation 함수에 전달될 변수(Variables) 타입
  >({
    mutationFn: putInfoApi, // API 호출 함수
    onSuccess: (data: SignUpResponse) => {
      queryClient.invalidateQueries({ queryKey: ["info"] });
    },
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
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryFn: fetchInfoApi,
    queryKey: ["info"],
    enabled: options?.enabled,
    retry: 1, // 503 에러면 재시도를 줄이는 것이 좋을 수 있습니다.
  });

  useEffect(() => {
    if (isError && error) {
      // error를 AxiosError로 단언하여 response 접근
      const axiosError = error as AxiosError;

      // 503 Service Unavailable 에러 체크
      if (
        axiosError.response?.status === 503 ||
        axiosError.response?.status === 403
      ) {
        console.warn("503 에러 발생: 로컬 스토리지 초기화");
        localStorage.clear();
        window.location.reload();
      }
    }
  }, [isError, error]);

  return { data, isLoading, isError, refetch, isFetching };
};
