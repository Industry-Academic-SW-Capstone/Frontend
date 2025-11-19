"use client";

import React, { useState } from "react";
import { use2FA } from "@/lib/hooks/auth/use2FA";
import PinInput from "@/components/auth/PinInput";
import BiometricSetup from "@/components/auth/BiometricSetup";

export default function TwoFactorSettings() {
  const { config, setupPin, setupBiometric, reset2FA } = use2FA();
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [pinStep, setPinStep] = useState<"setup" | "confirm">("setup");
  const [tempPin, setTempPin] = useState("");
  const [error, setError] = useState("");

  const handlePinSetupStart = () => {
    setShowPinSetup(true);
    setPinStep("setup");
    setTempPin("");
    setError("");
  };

  const handlePinSetup = (pin: string) => {
    setTempPin(pin);
    setPinStep("confirm");
  };

  const handlePinConfirm = (confirmPin: string) => {
    if (tempPin === confirmPin) {
      setupPin(tempPin);
      setShowPinSetup(false);
      setError("");
    } else {
      setError("PIN이 일치하지 않습니다");
      setTimeout(() => {
        setError("");
        setPinStep("setup");
        setTempPin("");
      }, 2000);
    }
  };

  const handleBiometricSuccess = (credentialId: string) => {
    setupBiometric(credentialId);
    setShowBiometricSetup(false);
  };

  const handleResetAll = () => {
    if (confirm("모든 2차 인증 설정을 삭제하시겠습니까?")) {
      reset2FA();
    }
  };

  // PIN 설정 모달
  if (showPinSetup) {
    if (pinStep === "setup") {
      return (
        <div className="fixed inset-0 z-50">
          <PinInput
            title="PIN 설정"
            subtitle="6자리 보안 PIN을 입력해주세요"
            onComplete={handlePinSetup}
            error={error}
          />
          <button
            onClick={() => setShowPinSetup(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      );
    } else {
      return (
        <div className="fixed inset-0 z-50">
          <PinInput
            title="PIN 확인"
            subtitle="동일한 PIN을 다시 입력해주세요"
            onComplete={handlePinConfirm}
            error={error}
          />
          <button
            onClick={() => setShowPinSetup(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      );
    }
  }

  // 생체 인증 설정 모달
  if (showBiometricSetup) {
    return (
      <div className="fixed inset-0 z-50">
        <BiometricSetup
          onSuccess={handleBiometricSuccess}
          onSkip={() => setShowBiometricSetup(false)}
        />
        <button
          onClick={() => setShowBiometricSetup(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* PIN 설정 */}
      <button
        onClick={handlePinSetupStart}
        className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 rounded-xl transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg transition-colors ${
              config.pinEnabled
                ? "bg-green-500/10 text-green-500"
                : "bg-bg-primary text-text-secondary group-hover:text-primary"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-text-primary font-semibold">보안 PIN</p>
            <p className="text-xs text-text-secondary">
              {config.pinEnabled ? "설정됨" : "미설정"}
            </p>
          </div>
        </div>
        <div
          className={`text-sm font-medium ${
            config.pinEnabled ? "text-green-500" : "text-accent"
          }`}
        >
          {config.pinEnabled ? "변경" : "설정"}
        </div>
      </button>

      {/* 생체 인증 설정 */}
      <button
        onClick={() => setShowBiometricSetup(true)}
        className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 rounded-xl transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg transition-colors ${
              config.biometricEnabled
                ? "bg-purple-500/10 text-purple-500"
                : "bg-bg-primary text-text-secondary group-hover:text-primary"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
              />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-text-primary font-semibold">생체 인증</p>
            <p className="text-xs text-text-secondary">
              {config.biometricEnabled ? "사용 가능" : "미설정"}
            </p>
          </div>
        </div>
        <div
          className={`text-sm font-medium ${
            config.biometricEnabled ? "text-purple-500" : "text-accent"
          }`}
        >
          {config.biometricEnabled ? "재설정" : "설정"}
        </div>
      </button>

      {/* 전체 초기화 */}
      {(config.pinEnabled || config.biometricEnabled) && (
        <button
          onClick={handleResetAll}
          className="w-full p-4 flex items-center justify-between hover:bg-red-500/10 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <span className="text-red-500 font-semibold">2차 인증 초기화</span>
          </div>
        </button>
      )}
    </div>
  );
}
