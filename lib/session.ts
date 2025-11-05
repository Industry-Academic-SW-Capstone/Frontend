import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers'; // (중요!) App Router용

// 1. 세션에 저장될 데이터 타입을 정의합니다.
export interface SessionData {
  userId?: string;
  challenge?: string;
  isLoggedIn?: boolean;
}

// 2. 세션 옵션 (이전과 동일)
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  cookieName: 'webauthn-stockit-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7일
  },
};

// 환경 변수 검증
if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error('SECRET_COOKIE_PASSWORD 환경 변수가 설정되지 않았습니다.');
}

if (process.env.SECRET_COOKIE_PASSWORD.length < 32) {
  throw new Error('SECRET_COOKIE_PASSWORD는 최소 32자 이상이어야 합니다.');
}

// 3. (중요!) App Router Route Handler에서 사용할 세션 유틸리티
// export function withSession... HOC는 더 이상 사용하지 않습니다.
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );
  return session;
}

// 4. (참고) Upstash에 저장할 Authenticator 타입 (선택 사항)
export interface Authenticator {
  credentialID: string; // Base64
  publicKey: string;    // Base64
  counter: number;
}