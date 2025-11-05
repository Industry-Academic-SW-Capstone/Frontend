import { NextRequest, NextResponse } from 'next/server';
import { getSession, Authenticator } from '@/lib/session';
import { 
  generateRegistrationOptions,
  type AuthenticatorTransportFuture 
} from '@simplewebauthn/server';
import { kv } from '@/lib/redis';

// 환경 변수 검증
function validateEnv() {
  if (!process.env.WEBAUTHN_RP_ID) {
    throw new Error('WEBAUTHN_RP_ID 환경 변수가 설정되지 않았습니다.');
  }
  if (!process.env.WEBAUTHN_RP_NAME) {
    throw new Error('WEBAUTHN_RP_NAME 환경 변수가 설정되지 않았습니다.');
  }
  return {
    rpID: process.env.WEBAUTHN_RP_ID,
    rpName: process.env.WEBAUTHN_RP_NAME,
  };
}

// POST /api/webauthn/register-challenge
export async function POST(request: NextRequest) {
  try {
    const { rpID, rpName } = validateEnv();

    // 임시 사용자 정보
    const user = {
      id: 'temp-user-id-123',
      name: 'testuser@stockit.com',
    };

    // KV에서 기존 Authenticator 정보 가져와서 제외하기
    const authenticator = await kv.get<Authenticator>(user.id);
    const excludeCredentials: Array<{ id: string; transports?: AuthenticatorTransportFuture[] }> = [];
    
    if (authenticator) {
      try {
        // credentialID는 base64로 저장되어 있으므로, base64url로 변환
        const idBuffer = Buffer.from(authenticator.credentialID, 'base64');
        excludeCredentials.push({
          id: idBuffer.toString('base64url'),
          transports: authenticator.transports, // 저장된 transports 사용
        });
      } catch (parseError) {
        console.error('기존 인증 정보 처리 실패:', parseError);
        // 처리 실패해도 계속 진행 (새로 등록 가능)
      }
    }

    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userID: new Uint8Array(Buffer.from(user.id, 'utf8')),
      userName: user.name,
      attestationType: 'none', // 대부분의 경우 'none'으로 충분
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // 같은 기기의 생체 인증만 사용
        residentKey: 'preferred',
        userVerification: 'required', // 생체 인증 필수
      },
      excludeCredentials, // 이미 등록된 기기 제외
    });

    // 세션에 challenge 저장
    const session = await getSession();
    session.challenge = options.challenge;
    session.userId = user.id;
    await session.save();

    return NextResponse.json(options);
  } catch (error) {
    console.error('등록 챌린지 생성 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `등록 챌린지 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}