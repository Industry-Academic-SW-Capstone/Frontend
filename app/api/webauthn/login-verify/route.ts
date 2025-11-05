import { NextRequest, NextResponse } from 'next/server';
import { getSession, Authenticator } from '@/lib/session';
import { kv } from '@/lib/redis';
import { 
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON 
} from '@simplewebauthn/server';

// 환경 변수 검증
function validateEnv() {
  if (!process.env.WEBAUTHN_RP_ID) {
    throw new Error('WEBAUTHN_RP_ID 환경 변수가 설정되지 않았습니다.');
  }
  if (!process.env.WEBAUTHN_ORIGIN) {
    throw new Error('WEBAUTHN_ORIGIN 환경 변수가 설정되지 않았습니다.');
  }
  return {
    rpID: process.env.WEBAUTHN_RP_ID,
    origin: process.env.WEBAUTHN_ORIGIN,
  };
}

// POST /api/webauthn/login-verify
export async function POST(request: NextRequest) {
  try {
    // 1. 클라이언트에서 보낸 assertion 응답 받기
    const assertionResponse: AuthenticationResponseJSON = await request.json();

    const { rpID, origin } = validateEnv();

    // 2. 세션에서 Challenge, UserId 가져오기
    const session = await getSession();
    const expectedChallenge = session.challenge;
    const userId = session.userId;

    if (!expectedChallenge || !userId) {
      return NextResponse.json(
        { error: '세션이 만료되었습니다. 다시 시도해주세요.' },
        { status: 400 }
      );
    }

    // 3. KV에서 Authenticator 정보 가져오기
    const authenticator = await kv.get<Authenticator>(userId);
    
    if (!authenticator) {
      return NextResponse.json(
        { error: '등록된 인증 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 4. 인증 응답 검증
    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: assertionResponse,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: authenticator.credentialID,
          publicKey: Buffer.from(authenticator.publicKey, 'base64'),
          counter: authenticator.counter,
        },
        requireUserVerification: true,
      });
    } catch (error) {
      console.error('로그인 검증 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      return NextResponse.json(
        { error: `로그인 검증 실패: ${errorMessage}` },
        { status: 400 }
      );
    }

    const { verified, authenticationInfo } = verification;

    if (!verified) {
      return NextResponse.json(
        { verified: false, error: '인증에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 5. (매우 중요!) Counter 업데이트
    const updatedAuthenticator: Authenticator = {
      ...authenticator,
      counter: authenticationInfo.newCounter,
    };
    // Upstash Redis는 자동으로 JSON 직렬화를 처리하므로 객체를 직접 저장
    await kv.set(userId, updatedAuthenticator);

    // 6. 세션 로그인 성공 처리
    session.challenge = undefined;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ verified: true, message: '로그인 성공!' });
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `로그인 처리 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}