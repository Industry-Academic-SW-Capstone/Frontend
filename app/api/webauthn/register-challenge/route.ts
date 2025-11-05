import { NextRequest, NextResponse } from "next/server";
import { getSession, Authenticator } from "@/lib/session";
import {
  generateRegistrationOptions,
  type AuthenticatorTransportFuture,
} from "@simplewebauthn/server";
import { kv } from "@/lib/redis";

// 환경 변수 검증
function validateEnv() {
  if (!process.env.WEBAUTHN_RP_ID) {
    throw new Error("WEBAUTHN_RP_ID 환경 변수가 설정되지 않았습니다.");
  }
  if (!process.env.WEBAUTHN_RP_NAME) {
    throw new Error("WEBAUTHN_RP_NAME 환경 변수가 설정되지 않았습니다.");
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

    // 서버에서 세션을 먼저 가져와서 POST body와 세션 모두에서 email을 시도해서 가져옵니다.
    const session = await getSession();

    let userEmail: string | undefined;
    // 1) 요청 바디(JSON)에서 email 추출 시도
    try {
      const body = await request.json();
      if (body && typeof body.email === "string" && body.email.trim() !== "") {
        userEmail = body.email.trim();
      }
    } catch (err) {
      // JSON 파싱 실패 시 무시하고 다음 단계로 진행
    }

    // 2) 바디에 없으면 (서버)세션에서 이메일 확인
    if (
      !userEmail &&
      (session as any)?.email &&
      typeof (session as any).email === "string"
    ) {
      userEmail = (session as any).email;
    }

    // 3) 둘 다 없으면 임시 사용자 사용
    let user;
    if (userEmail) {
      user = {
        id: userEmail.split("@")[0],
        name: userEmail,
      };
    } else {
      user = {
        id: "temp-user-id-123",
        name: "testuser@stockit.com",
      };
    }

    // KV에서 기존 Authenticator 정보 가져와서 제외하기
    const authenticator = await kv.get<Authenticator>(user.id);
    const excludeCredentials: Array<{
      id: string;
      transports?: AuthenticatorTransportFuture[];
    }> = [];

    if (authenticator) {
      try {
        excludeCredentials.push({
          id: authenticator.credentialID,
          transports: authenticator.transports ?? ["internal"],
        });
      } catch (parseError) {
        console.error("기존 인증 정보 처리 실패:", parseError);
      }
    }

    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userID: new Uint8Array(Buffer.from(user.id, "utf8")),
      userName: user.name,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "required",
      },
      excludeCredentials,
    });

    // 세션에 challenge 저장
    session.challenge = options.challenge;
    session.userId = user.id;
    await session.save();

    return NextResponse.json(options);
  } catch (error) {
    console.error("등록 챌린지 생성 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `등록 챌린지 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
