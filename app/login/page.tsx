"use client"; // (중요!) 클라이언트 컴포넌트로 명시

import React, { useState } from "react";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

// simplewebauthn에서 제공하는 JSON 타입을 임포트하면 좋습니다.
// '@simplewebauthn/server/script/deps' 모듈이 프로젝트에 없을 수 있으므로, 로컬 타입 앨리어스를 사용합니다.
type GenerateRegistrationOptionsJSON = any;
type GenerateAuthenticationOptionsJSON = any;

export default function WebAuthnLogin() {
  // 1. TypeScript: useState 타입 명시
  const [error, setError] = useState<string | null>(null);

  // 1. 등록 핸들러
  const handleRegister = async () => {
    setError(null);
    try {
      // 1-1. 서버에서 등록 옵션(Challenge) 가져오기
      const res = await fetch("/api/webauthn/register-challenge", {
        method: "POST",
      });
      // 2. TypeScript: API 응답 타입 지정
      const regOptions: GenerateRegistrationOptionsJSON = await res.json();

      if (res.status !== 200) throw new Error((regOptions as any).error);

      // 1-2. 브라우저/OS의 WebAuthn API 호출
      const attestation = await startRegistration(regOptions);

      // 1-3. 생성된 Attestation을 서버로 보내 검증
      const verifyRes = await fetch("/api/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attestation),
      });

      const verification = await verifyRes.json();

      if (verification.verified) {
        alert("등록 성공!");
      } else {
        throw new Error(verification.error || "등록 검증 실패");
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  // 2. 로그인 핸들러
  const handleLogin = async () => {
    setError(null);
    try {
      // 2-1. 서버에서 로그인 옵션(Challenge) 가져오기
      const res = await fetch("/api/webauthn/login-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionStorage.getItem("email") }),
      });
      // 3. TypeScript: API 응답 타입 지정
      const authOptions: GenerateAuthenticationOptionsJSON = await res.json();

      if (res.status !== 200) throw new Error((authOptions as any).error);

      // 2-2. 브라우저/OS의 WebAuthn API 호출
      const assertion = await startAuthentication(authOptions);

      // 2-3. 생성된 Assertion(서명)을 서버로 보내 검증
      const verifyRes = await fetch("/api/webauthn/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion), // 직접 assertion 전달
      });

      const verification = await verifyRes.json();

      if (verification.verified) {
        alert("로그인 성공!");
      } else {
        throw new Error(verification.error || "로그인 검증 실패");
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h3>WebAuthn (App Router + TS + Upstash)</h3>
      <button onClick={handleRegister}>새 기기 등록 (Register)</button>
      <br />
      <br />
      <button onClick={handleLogin}>로그인 (Login)</button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
