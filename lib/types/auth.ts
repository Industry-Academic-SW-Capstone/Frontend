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
  profileImage: string;
  twoFactorEnabled: boolean;
  notificationAgreement: boolean;
}

export interface UpdateInfoRequest {
  name?: string;
  profileImage?: string;
  notificationAgreement?: boolean;
}

export interface SignUpResponse {
  email: string;
  memberId: number;
  name: string;
  profileImage: string;
  provider: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  notificationAgreement: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface KakaoSignupRequest {
  email: string;
  name: string;
  profileImage: string;
}

export interface KakaoCallbackResponse {
  token?: string; // 로그인 성공 시
  userInfo?: KakaoSignupRequest; // 회원가입 필요 시
  message?: string;
}

export const DEFAULT_SESSION_TIMEOUT = 15 * 24 * 60 * 60 * 1000; // 15일
