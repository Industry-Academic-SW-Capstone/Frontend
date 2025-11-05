"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PinInput from "@/components/auth/PinInput";
import BiometricSetup from "@/components/auth/BiometricSetup";
import { use2FA } from "@/lib/hooks/use2FA";
import * as Icons from "@/components/icons/Icons";
import Portal from "@/components/Portal";

type Step =
  | "welcome"
  | "pin-setup"
  | "pin-confirm"
  | "biometric-setup"
  | "complete";

export default function TFARegisterPage({
  handleNext,
  children,
  handleBack,
}: {
  handleNext: () => void;
  children: React.ReactNode;
  handleBack: () => void;
}) {
  const router = useRouter();
  const { setupPin, setupBiometric } = use2FA();

  const [step, setStep] = useState<Step>("welcome");
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  // PIN 설정
  const handlePinSetup = (inputPin: string) => {
    setPin(inputPin);
    setError("");
    setStep("pin-confirm");
  };

  // PIN 확인
  const handlePinConfirm = (confirmPin: string) => {
    if (pin === confirmPin) {
      setupPin(pin);
      setError("");
      setStep("biometric-setup");
    } else {
      setError("PIN이 일치하지 않습니다");
      setTimeout(() => {
        setError("");
        setStep("pin-setup");
        setPin("");
      }, 2000);
    }
  };

  // 생체 인증 설정 성공
  const handleBiometricSuccess = (credentialId: string) => {
    setupBiometric(credentialId);
    handleNext();
  };

  // 생체 인증 건너뛰기
  const handleSkipBiometric = () => {
    handleNext();
  };

  // Welcome 화면
  if (step === "welcome") {
    return (
      <div className="p-6 flex flex-col h-full text-center">
        {children}
        <button onClick={handleBack} className="self-start mb-4">
          <Icons.ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="h-full flex flex-col justify-between">
          <div>
            <Icons.LockClosedIcon className="w-20 h-20 mt-6 text-primary mx-auto" />

            <h2 className="text-3xl font-bold mt-4">2차인증 설정하기</h2>
            <p className="text-text-secondary mt-3 mb-8">
              계정을 안전하게 보호하기 위해
              <br />
              2차 인증을 설정해주세요
            </p>
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={() => setStep("pin-setup")}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl"
            >
              설정 시작하기
            </button>
            <button
              onClick={handleNext}
              className="w-full text-text-secondary font-semibold py-3"
            >
              나중에 설정할게요
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PIN 설정
  if (step === "pin-setup") {
    return (
      <PinInput
        title="PIN 설정"
        subtitle="6자리 보안 PIN을 입력해주세요"
        onComplete={handlePinSetup}
        error={error}
      />
    );
  }

  // PIN 확인
  if (step === "pin-confirm") {
    return (
      <PinInput
        title="PIN 확인"
        subtitle="동일한 PIN을 다시 입력해주세요"
        onComplete={handlePinConfirm}
        error={error}
      />
    );
  }

  // 생체 인증 설정
  if (step === "biometric-setup") {
    return (
      <div className="z-50">
        <BiometricSetup
          onSuccess={handleBiometricSuccess}
          onSkip={handleSkipBiometric}
        />
      </div>
    );
  }

  return null;
}
