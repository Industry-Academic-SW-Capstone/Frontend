// 2차 인증 관련 타입 정의

export type TwoFactorMethod = "pin" | "biometric" | "both" | null;

export interface TwoFactorConfig {
  pinEnabled: boolean;
  biometricEnabled: boolean;
  pin?: string; // 해시된 PIN (실제로는 서버에 저장해야 함)
  biometricCredentialId?: string; // WebAuthn credential ID
  lastAuthTime?: number; // 마지막 인증 시간 (타임스탬프)
  sessionTimeout?: number; // 세션 타임아웃 (밀리초, 기본 5분)
}

export interface AuthState {
  isAuthenticated: boolean;
  authenticatedAt?: number;
  method?: TwoFactorMethod;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  profile_image: string;
}

export interface SignUpResponse {
  email: string;
  memberId: string;
  name: string;
  profile_image: string;
  provider: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const DEFAULT_SESSION_TIMEOUT = 15 * 24 * 60 * 60 * 1000; // 15일
