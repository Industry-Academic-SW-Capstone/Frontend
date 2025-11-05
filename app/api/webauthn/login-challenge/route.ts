import { NextRequest, NextResponse } from 'next/server';
import { getSession, Authenticator } from '@/lib/session';
import { kv } from '@/lib/redis';
import { generateAuthenticationOptions } from '@simplewebauthn/server';

// 환경 변수 검증
function validateEnv() {
  if (!process.env.WEBAUTHN_RP_ID) {
    throw new Error('WEBAUTHN_RP_ID 환경 변수가 설정되지 않았습니다.');
  }
  return {
    rpID: process.env.WEBAUTHN_RP_ID,
  };
}

// POST /api/webauthn/login-challenge
export async function POST(request: NextRequest) {
  try {
    const { rpID } = validateEnv();
    const userId = 'temp-user-id-123'; // (임시 ID)

    // 1. KV에서 Authenticator 정보 조회
    const authenticator = await kv.get<Authenticator>(userId);

    const allowCredentials: Array<{ id: string; type: 'public-key'; transports?: AuthenticatorTransport[] }> = [];
    
    if (authenticator) {
      try {
        // credentialID를 base64에서 base64url로 올바르게 변환
        const idBuffer = Buffer.from(authenticator.credentialID, 'base64');
        allowCredentials.push({
          id: idBuffer.toString('base64url'),
          type: 'public-key' as const,
          transports: ['internal', 'hybrid'],
        });
      } catch (error) {
        console.error('인증 정보 처리 실패:', error);
        return NextResponse.json(
          { error: '등록된 인증 정보를 찾을 수 없습니다. 먼저 등록해주세요.' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: '등록된 인증 정보를 찾을 수 없습니다. 먼저 등록해주세요.' },
        { status: 404 }
      );
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    // 2. 세션에 Challenge 저장
    const session = await getSession();
    session.challenge = options.challenge;
    session.userId = userId;
    await session.save();

    return NextResponse.json(options);
  } catch (error) {
    console.error('로그인 챌린지 생성 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `로그인 챌린지 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}