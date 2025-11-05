import { NextRequest, NextResponse } from 'next/server';
import { getSession, Authenticator } from '@/lib/session';
import { kv } from '@/lib/redis';
import { 
  verifyRegistrationResponse,
  type RegistrationResponseJSON 
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

// POST /api/webauthn/register-verify
export async function POST(request: NextRequest) {
  try {
    // 1. 클라이언트에서 보낸 attestation 응답 받기
    const attestationResponse: RegistrationResponseJSON = await request.json();

    const { rpID, origin } = validateEnv();

    // 2. 세션에서 challenge와 userId 가져오기
    const session = await getSession();
    const expectedChallenge = session.challenge;
    const userId = session.userId;

    if (!expectedChallenge || !userId) {
      return NextResponse.json(
        { error: '세션이 만료되었습니다. 다시 시도해주세요.' },
        { status: 400 }
      );
    }

    // 3. 등록 응답 검증
    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: attestationResponse,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: true,
      });
    } catch (error) {
      console.error('등록 검증 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      return NextResponse.json(
        { error: `등록 검증 실패: ${errorMessage}` },
        { status: 400 }
      );
    }

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo?.credential) {
      return NextResponse.json(
        { verified: false, error: '등록 검증에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 4. 인증 정보 저장
    const credential = registrationInfo.credential;

    // transports 정보 추출 (클라이언트에서 제공)
    const transports = attestationResponse.response.transports;

    // Upstash Redis는 자동으로 JSON 직렬화를 처리하므로 객체를 직접 저장
    const newAuthenticator: Authenticator = {
      credentialID: Buffer.from(credential.id).toString('base64'),
      publicKey: Buffer.from(credential.publicKey).toString('base64'),
      counter: credential.counter,
      transports: transports, // 실제 사용된 transports 저장
    };

    await kv.set(userId, newAuthenticator);

    // 5. 세션 정리 및 로그인 상태로 설정
    session.challenge = undefined;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ verified: true, message: '등록이 완료되었습니다.' });
  } catch (error) {
    console.error('등록 처리 중 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `등록 처리 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}