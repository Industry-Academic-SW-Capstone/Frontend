import { NextRequest, NextResponse } from "next/server";
import { getSession, Authenticator } from "@/lib/session";
import { kv } from "@/lib/redis";
import {
  generateAuthenticationOptions,
  type AuthenticatorTransportFuture,
} from "@simplewebauthn/server";

// 환경 변수 검증
function validateEnv() {
  if (!process.env.WEBAUTHN_RP_ID) {
    throw new Error("WEBAUTHN_RP_ID 환경 변수가 설정되지 않았습니다.");
  }
  return {
    rpID: process.env.WEBAUTHN_RP_ID,
  };
}

// POST /api/webauthn/login-challenge
export async function POST(request: NextRequest) {
  try {
    const { rpID } = validateEnv();

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

    // 3) 둘 다 없으면 임시 이메일 사용

    let userId;
    if (!userEmail) {
      userId = "temp-user-id-123"; // (임시 ID)
    } else {
      userId = userEmail.split("@")[0]; // 이메일 앞부분을 userId로 사용
    }

    // 1. KV에서 Authenticator 정보 조회
    const authenticator = await kv.get<Authenticator>(userId);

    const allowCredentials: Array<{
      id: string;
      type: "public-key";
      transports?: AuthenticatorTransportFuture[];
    }> = [];

    if (authenticator) {
      try {
        // credentialID was stored as Base64URL string; use it directly
        allowCredentials.push({
          id: authenticator.credentialID,
          type: "public-key" as const,
          transports: authenticator.transports ?? ["internal"], // 등록 시 저장된 transports 사용
        });
      } catch (error) {
        console.error("인증 정보 처리 실패:", error);
        return NextResponse.json(
          { error: "등록된 인증 정보를 찾을 수 없습니다. 먼저 등록해주세요." },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "등록된 인증 정보를 찾을 수 없습니다. 먼저 등록해주세요." },
        { status: 404 }
      );
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: "required", // 생체 인증 필수
    });

    // 2. 세션에 Challenge 저장
    session.challenge = options.challenge;
    session.userId = userId;
    await session.save();

    return NextResponse.json(options);
  } catch (error) {
    console.error("로그인 챌린지 생성 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `로그인 챌린지 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
