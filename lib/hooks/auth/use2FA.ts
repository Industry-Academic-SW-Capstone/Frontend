"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TwoFactorConfig,
  AuthState,
  DEFAULT_SESSION_TIMEOUT,
  UpdateInfoRequest,
} from "@/lib/types/auth";
import { usePutInfo } from "../me/useInfo";

const STORAGE_KEY_CONFIG = "stockit_2fa_config";
const STORAGE_KEY_AUTH = "stockit_auth_state";

// PIN 해싱 (간단한 해시, 실제로는 bcrypt 등 사용)
function hashPin(pin: string): string {
  return btoa(pin); // 실제로는 더 강력한 해싱 사용
}

function verifyPin(input: string, stored: string): boolean {
  return hashPin(input) === stored;
}

export function use2FA() {
  const [config, setConfigState] = useState<TwoFactorConfig>({
    pinEnabled: false,
    biometricEnabled: false,
    sessionTimeout: DEFAULT_SESSION_TIMEOUT,
  });

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });

  // SessionStorage에서 설정 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedConfig = sessionStorage.getItem(STORAGE_KEY_CONFIG);
    const storedAuth = sessionStorage.getItem(STORAGE_KEY_AUTH);

    if (storedConfig) {
      try {
        setConfigState(JSON.parse(storedConfig));
      } catch (error) {
        console.error("Failed to parse 2FA config:", error);
      }
    }

    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        // 세션 타임아웃 확인
        const timeout = config.sessionTimeout || DEFAULT_SESSION_TIMEOUT;
        if (
          auth.authenticatedAt &&
          Date.now() - auth.authenticatedAt < timeout
        ) {
          setAuthState(auth);
        } else {
          // 만료됨
          sessionStorage.removeItem(STORAGE_KEY_AUTH);
        }
      } catch (error) {
        console.error("Failed to parse auth state:", error);
      }
    }
  }, []);

  const { mutate: putInfo } = usePutInfo();

  // 설정 저장
  const saveConfig = useCallback((newConfig: Partial<TwoFactorConfig>) => {
    const twoFactor: UpdateInfoRequest = {
      twoFactorEnabled: newConfig.pinEnabled || newConfig.biometricEnabled,
    };
    setConfigState((prev) => {
      putInfo(twoFactor);

      const updated = { ...prev, ...newConfig };
      sessionStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // PIN 설정
  const setupPin = useCallback(
    (pin: string) => {
      const hashed = hashPin(pin);
      saveConfig({
        pinEnabled: true,
        pin: hashed,
      });
    },
    [saveConfig]
  );

  // 생체 인증 설정
  const setupBiometric = useCallback(
    (credentialId: string) => {
      saveConfig({
        biometricEnabled: true,
        biometricCredentialId: credentialId,
      });
    },
    [saveConfig]
  );

  // PIN 검증
  const verifyPinAuth = useCallback(
    (pin: string): boolean => {
      if (!config.pin) return false;
      const isValid = verifyPin(pin, config.pin);

      if (isValid) {
        const newAuthState: AuthState = {
          isAuthenticated: true,
          authenticatedAt: Date.now(),
          method: "pin",
        };
        setAuthState(newAuthState);
        sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newAuthState));
      }

      return isValid;
    },
    [config.pin]
  );

  // 생체 인증 성공 처리
  const markBiometricAuthenticated = useCallback(() => {
    const newAuthState: AuthState = {
      isAuthenticated: true,
      authenticatedAt: Date.now(),
      method: "biometric",
    };
    setAuthState(newAuthState);
    sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newAuthState));
  }, []);

  // 인증 상태 확인 (타임아웃 체크 포함)
  const isAuthValid = useCallback((): boolean => {
    if (!authState.isAuthenticated || !authState.authenticatedAt) {
      return false;
    }

    const timeout = config.sessionTimeout || DEFAULT_SESSION_TIMEOUT;
    const isExpired = Date.now() - authState.authenticatedAt > timeout;

    if (isExpired) {
      // 세션 만료
      setAuthState({ isAuthenticated: false });
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
      return false;
    }

    return true;
  }, [authState, config.sessionTimeout]);

  // 로그아웃
  const clearAuth = useCallback(() => {
    setAuthState({ isAuthenticated: false });
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  // 2차 인증 완전 초기화
  const reset2FA = useCallback(() => {
    setConfigState({
      pinEnabled: false,
      biometricEnabled: false,
      sessionTimeout: DEFAULT_SESSION_TIMEOUT,
    });
    setAuthState({ isAuthenticated: false });
    sessionStorage.removeItem(STORAGE_KEY_CONFIG);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  return {
    config,
    authState,
    setupPin,
    setupBiometric,
    verifyPinAuth,
    markBiometricAuthenticated,
    isAuthValid,
    clearAuth,
    reset2FA,
    saveConfig,
  };
}
