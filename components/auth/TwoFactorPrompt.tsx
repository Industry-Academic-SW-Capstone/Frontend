"use client";

import React, { useState } from "react";
import { use2FA } from "@/lib/hooks/use2FA";
import { startAuthentication } from "@simplewebauthn/browser";

interface TwoFactorPromptProps {
  onAuthenticated: () => void;
  onCancel?: () => void;
}

export default function TwoFactorPrompt({
  onAuthenticated,
  onCancel,
}: TwoFactorPromptProps) {
  const { config, verifyPinAuth, markBiometricAuthenticated } = use2FA();
  const [method, setMethod] = useState<"choice" | "pin" | "biometric">(
    "choice"
  );
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clickedPinIndexs, setClickedPinIndexs] = useState<number[]>([]);
  const [PinResetTimer, setPinResetTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // PIN 입력 처리
  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      if (PinResetTimer) clearTimeout(PinResetTimer);
      setClickedPinIndexs([-1]);

      setPinResetTimer(
        setTimeout(() => {
          setClickedPinIndexs([]);
        }, 700)
      );
      setPin((prev) => {
        const newPin = [...prev];
        const lastFilledIndex = newPin.findLastIndex((p) => p !== "");
        if (lastFilledIndex >= 0) {
          newPin[lastFilledIndex] = "";
        }
        return newPin;
      });
      setError("");
      return;
    }

    if (!/^\d$/.test(key)) return;

    if (PinResetTimer) clearTimeout(PinResetTimer);
    setClickedPinIndexs(() => {
      const pressed = Number(key);
      let fake = Math.floor(Math.random() * 10); // 0..9 난수 생성
      if (fake === pressed) {
        // 만약 동일하면 다음 숫자로 보정(0~9 범위 유지)
        fake = (fake + 1) % 10;
      }
      return [fake, pressed];
    });

    setPinResetTimer(
      setTimeout(() => {
        setClickedPinIndexs([]);
      }, 700)
    );
    setPin((prev) => {
      const newPin = [...prev];
      const firstEmptyIndex = newPin.findIndex((p) => p === "");

      if (firstEmptyIndex !== -1) {
        newPin[firstEmptyIndex] = key;

        // 모두 입력되었으면 검증
        if (firstEmptyIndex === 5) {
          const pinString = newPin.join("");
          setTimeout(() => {
            if (verifyPinAuth(pinString)) {
              onAuthenticated();
            } else {
              setError("PIN이 올바르지 않습니다");
              setPin(Array(6).fill(""));
            }
          }, 100);
        }
      }

      return newPin;
    });
  };

  // 생체 인증 처리
  const handleBiometricAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      // 1. 서버에서 로그인 옵션 가져오기
      const res = await fetch("/api/webauthn/login-challenge", {
        method: "POST",
      });
      const authOptions = await res.json();

      if (res.status !== 200) {
        throw new Error(authOptions.error || "인증 옵션 가져오기 실패");
      }

      // 2. 생체 인증
      const assertion = await startAuthentication(authOptions);

      // 3. 서버로 검증 요청
      const verifyRes = await fetch("/api/webauthn/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion),
      });

      const verification = await verifyRes.json();

      if (verification.verified) {
        markBiometricAuthenticated();
        onAuthenticated();
      } else {
        throw new Error(verification.error || "인증 실패");
      }
    } catch (err: any) {
      console.error("Biometric auth error:", err);
      setError(err.message || "생체 인증에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 선택 화면
  if (method === "choice") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md mx-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl animate-slideUp">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-300 to-gray-200  dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">보안 인증</h2>
            <p className="text-gray-400 text-sm">
              증권 거래를 위해 인증이 필요합니다
            </p>
          </div>

          {/* 인증 방법 선택 */}
          <div className="space-y-3">
            {config.biometricEnabled && (
              <button
                onClick={() => setMethod("biometric")}
                className="
                  w-full p-4 rounded-2xl
                  bg-linear-to-r from-blue-500/20 to-purple-500/20
                  border border-blue-500/30
                  hover:border-blue-500/50
                  transition-all duration-200
                  active:scale-95
                  flex items-center gap-4
                "
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-white">생체 인증</p>
                  <p className="text-xs text-gray-400">FaceID 또는 TouchID</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {config.pinEnabled && (
              <button
                onClick={() => setMethod("pin")}
                className="
                  w-full p-4 rounded-2xl
                  bg-white/5
                  border border-gray-600
                  hover:border-gray-500
                  transition-all duration-200
                  active:scale-95
                  flex items-center gap-4
                "
              >
                <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-white">PIN 입력</p>
                  <p className="text-xs text-gray-400">6자리 보안 PIN</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* 취소 버튼 */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full mt-4 py-3 text-gray-400 hover:text-white transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </div>
    );
  }

  // PIN 입력 화면
  if (method === "pin") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md mx-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl animate-slideUp">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => {
              setMethod("choice");
              setPin(Array(6).fill(""));
              setError("");
            }}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm">뒤로</span>
          </button>

          {/* PIN 디스플레이 */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-6">PIN 입력</h3>
            <div className="flex justify-center gap-3 mb-4">
              {pin.map((digit, index) => (
                <div
                  key={index}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    transition-all duration-300
                    ${digit ? "bg-blue-500 scale-110" : "bg-gray-700"}
                  `}
                >
                  {digit && <div className="w-3 h-3 rounded-full bg-white" />}
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-400 text-sm animate-shake">{error}</p>
            )}
          </div>

          {/* 숫자 키패드 */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className={`
                h-16 rounded-2xl bg-gray-800 hover:bg-gray-700
                text-white text-2xl font-semibold
                transition-all duration-200
                hover:shadow-lg hover:shadow-blue-500/20
                ${
                  clickedPinIndexs.includes(num)
                    ? "ring-3 ring-blue-300 scale-95"
                    : ""
                }
              `}
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleKeyPress("0")}
              className={`
                h-16 rounded-2xl bg-gray-800 hover:bg-gray-700
                text-white text-2xl font-semibold
                transition-all duration-200
                hover:shadow-lg hover:shadow-blue-500/20
                ${
                  clickedPinIndexs.includes(0)
                    ? "ring-3 ring-blue-300 scale-95"
                    : ""
                }
              `}
            >
              0
            </button>
            <button
              onClick={() => handleKeyPress("backspace")}
              className={`h-14 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all active:scale-95 ${
                clickedPinIndexs.includes(0)
                  ? "ring-3 ring-blue-300 scale-95"
                  : ""
              }`}
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 생체 인증 화면
  if (method === "biometric") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md mx-6 bg-linear-to-br from-blue-900 to-purple-900 rounded-3xl p-8 shadow-2xl animate-slideUp">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => setMethod("choice")}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm">뒤로</span>
          </button>

          {/* 스캔 애니메이션 */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping" />
              <div className="absolute inset-4 rounded-full border-4 border-blue-400/50 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">생체 인증</h3>
            <p className="text-gray-300 text-sm mb-8">
              기기의 생체 인증을 진행해주세요
            </p>

            <button
              onClick={handleBiometricAuth}
              disabled={isLoading}
              className="
                w-full py-4 rounded-2xl
                bg-linear-to-r from-blue-500 to-purple-500
                text-white font-semibold
                transition-all duration-200
                hover:shadow-lg hover:shadow-blue-500/50
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? "인증 중..." : "생체 인증 시작"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
