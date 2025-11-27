"use client";

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";

interface BiometricSetupProps {
  onSuccess: (credentialId: string) => void;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
}

export default function BiometricSetup({
  onSuccess,
  onSkip,
  title = "생체 인증 설정",
  subtitle = "FaceID 또는 TouchID로 빠르고 안전하게 로그인하세요",
}: BiometricSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scanning">("intro");

  const handleSetupBiometric = async () => {
    setError(null);
    setIsLoading(true);
    setStep("scanning");

    try {
      // 1. 서버에서 등록 옵션 가져오기
      const res = await fetch("/api/webauthn/register-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionStorage.getItem("email") }),
      });
      const regOptions = await res.json();

      if (res.status !== 200) {
        throw new Error(regOptions.error || "등록 옵션 가져오기 실패");
      }

      // 2. 생체 인증 등록
      const attestation = await startRegistration(regOptions);

      // 3. 서버로 검증 요청
      const verifyRes = await fetch("/api/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attestation),
      });

      const verification = await verifyRes.json();

      if (verification.verified) {
        // 성공! credential ID 반환
        onSuccess(attestation.id);
      } else {
        throw new Error(verification.error || "등록 검증 실패");
      }
    } catch (err: any) {
      console.error("Biometric setup error:", err);
      setError(err.message || "생체 인증 등록에 실패했습니다");
      setStep("intro");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "scanning") {
    return (
      <div className="flex z-50 flex-col items-center justify-center min-h-screen-safe bg-linear-to-br from-gray-900 via-gray-800 to-black px-6">
        <div className="w-full max-w-md text-center">
          {/* 스캔 애니메이션 */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            {/* 외부 링 */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-900/30 animate-ping" />
            <div className="absolute inset-4 rounded-full border-4 border-gray-800/50 animate-pulse" />

            {/* 중앙 아이콘 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            생체 인증 중...
          </h2>
          <p className="text-gray-300 text-sm">
            기기의 생체 인증을 진행해주세요
          </p>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex z-50 flex-col items-center justify-center min-h-screen-safe bg-linear-to-br from-gray-900 via-gray-800 to-black px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">PIN 설정 완료!</h1>
          <p className=" text-gray-400 mb-12">
            생체 인증을 추가로 설정하시겠어요?
          </p>

          <div className="space-y-3">
            <button
              onClick={handleSetupBiometric}
              disabled={isLoading}
              className="
                    w-full py-4 rounded-2xl
                    bg-white/10
                    text-white font-semibold text-lg
                    transition-all duration-200
                    shadow-md 
                    active:scale-95
                    hover:bg-white/15
                  "
            >
              {isLoading ? "설정 중..." : "생체 인증 설정하기"}
            </button>
            {onSkip && (
              <button
                onClick={onSkip}
                disabled={isLoading}
                className="
                    w-full py-4 rounded-2xl
                    bg-white/3 backdrop-blur-sm
                    text-white font-medium
                    transition-all duration-200
                    shadow-md
                    hover:bg-white/6
                    active:scale-95
                  "
              >
                나중에 설정하기
              </button>
            )}
          </div>
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
