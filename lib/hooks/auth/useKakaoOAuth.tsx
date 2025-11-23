import defaultClient from "@/lib/api/axiosClient";
import { useState } from "react";

declare global {
  interface Window {
    Kakao: any; // SDK의 구체적인 타입은 복잡하므로 any로 허용하거나 필요시 구체화
  }
}

export default function useKakaoOAuth() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 카카오 로그인 실행 함수
   * @param onLoginSuccess - 로그인 성공 시 수행할 콜백 (Access Token 전달됨)
   * @param onLoginFail - 로그인 실패 시 수행할 콜백
   */
  const loginWithKakao = (redirectUri?: string) => {
    // 1. SDK 로드 여부 체크
    if (typeof window === "undefined" || !window.Kakao) {
      alert("카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);

    // 2. 중복 초기화 방지 및 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    // 3. 리다이렉트 로그인 실행
    console.log("Kakao Login Start (Redirect)");
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri || window.location.origin,
    });
  };

  //**
  // 카카오 로그인 콜백 함수
  // @param code - 카카오 로그인 콜백으로 전달된 code
  // */
  const fetchKakaoCallback = async (code: string, redirectUri?: string) => {
    const res = await defaultClient.get(
      `/api/auth/kakao/callback?code=${code}&redirect_uri=${
        redirectUri || window.location.origin
      }`
    );
    return res.data;
  };

  return { loginWithKakao, fetchKakaoCallback, isLoading };
}
