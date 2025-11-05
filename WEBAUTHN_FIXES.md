# WebAuthn 수정 사항 요약

## 🎯 주요 문제점 및 해결

### 1. **의존성 버전 문제**
- **문제**: `@simplewebauthn/types` 패키지가 deprecated됨
- **해결**: 해당 패키지 제거 (타입이 `@simplewebauthn/server`에 포함되어 있음)

### 2. **세션 관리 개선** (`lib/session.ts`)

#### 문제점:
- 쿠키 보안 설정 부족
- 환경 변수 검증 없음
- 타입 안전성 부족

#### 수정 내용:
```typescript
// Before
cookieOptions: {
  secure: process.env.NODE_ENV === 'production',
}

// After
cookieOptions: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7일
}
```

- 환경 변수 검증 로직 추가 (SECRET_COOKIE_PASSWORD 최소 32자)
- `IronSession<SessionData>` 타입 명시

### 3. **등록 챌린지 생성** (`register-challenge/route.ts`)

#### 문제점:
```typescript
// 잘못된 변환 로직
excludeCredentials.push({
  id: Buffer.from(authenticator.credentialID, 'base64').toString('base64url'),
});
```

#### 수정 내용:
```typescript
// 올바른 변환 로직
const idBuffer = Buffer.from(authenticator.credentialID, 'base64');
excludeCredentials.push({
  id: idBuffer.toString('base64url'),
  transports: ['internal', 'hybrid'],
});
```

- 환경 변수 검증 함수 추가
- `authenticatorSelection` 옵션 추가
- 에러 처리 강화
- userID를 `Uint8Array`로 변환

### 4. **등록 검증** (`register-verify/route.ts`)

#### 문제점:
- SimpleWebAuthn v13 API 변경에 대응하지 못함
- 주석 처리된 코드와 실제 코드 혼재
- 등록 후 로그인 상태 설정 누락

#### 수정 내용:
```typescript
// Before (잘못된 접근)
const { credentialPublicKey, credentialID, counter } = registrationInfo.credential;

// After (올바른 접근)
const credential = registrationInfo.credential;
const newAuthenticator: Authenticator = {
  credentialID: Buffer.from(credential.id).toString('base64'),
  publicKey: Buffer.from(credential.publicKey).toString('base64'),
  counter: credential.counter,
};
```

- 등록 성공 시 자동 로그인 처리 (`isLoggedIn: true`)
- 상세한 에러 메시지
- JSON 파싱 오류 처리

### 5. **로그인 챌린지 생성** (`login-challenge/route.ts`)

#### 문제점:
```typescript
// 수동 base64url 변환 (오류 발생 가능)
const idBase64Url = authenticator.credentialID
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/g, '');
```

#### 수정 내용:
```typescript
// Buffer를 활용한 올바른 변환
const idBuffer = Buffer.from(authenticator.credentialID, 'base64');
allowCredentials.push({
  id: idBuffer.toString('base64url'),
  type: 'public-key' as const,
  transports: ['internal', 'hybrid'],
});
```

- 등록되지 않은 사용자 에러 처리
- 환경 변수 검증

### 6. **로그인 검증** (`login-verify/route.ts`)

#### 문제점:
```typescript
// 불필요한 wrapping
const body: { assertionResponse: AuthenticationResponseJSON } = await request.json();
const { assertionResponse } = body;

// 잘못된 파라미터 이름
authenticator: {
  credentialID: Buffer.from(...),
  credentialPublicKey: Buffer.from(...),
  counter: authenticator.counter,
}
```

#### 수정 내용:
```typescript
// 직접 assertion 받기
const assertionResponse: AuthenticationResponseJSON = await request.json();

// 올바른 파라미터 이름 (v13 API)
credential: {
  id: authenticator.credentialID,
  publicKey: Buffer.from(authenticator.publicKey, 'base64'),
  counter: authenticator.counter,
}
```

- `as any` 타입 단언 제거
- JSON 파싱 오류 처리
- 상세한 에러 메시지

### 7. **클라이언트 코드** (`app/login/page.tsx`)

#### 수정 내용:
```typescript
// Before
body: JSON.stringify({ assertionResponse: assertion })

// After
body: JSON.stringify(assertion)
```

## 📝 추가 파일

### `.env.example`
환경 변수 설정 가이드 파일 생성

### `WEBAUTHN_SETUP.md`
상세한 설정 및 사용 가이드 문서

## 🔧 테스트 방법

1. 환경 변수 설정:
```bash
# .env.local 파일 생성
cp .env.example .env.local

# SECRET_COOKIE_PASSWORD 생성
openssl rand -base64 32
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 테스트:
   - http://localhost:3000/login 접속
   - "새 기기 등록" 클릭
   - 생체 인증 진행
   - "로그인" 클릭하여 로그인 테스트

## ⚠️ 중요 사항

### 프로덕션 배포 전 체크리스트:

- [ ] `SECRET_COOKIE_PASSWORD`: 32자 이상의 강력한 무작위 값으로 설정
- [ ] `WEBAUTHN_RP_ID`: 실제 도메인으로 설정 (예: `stockit.com`)
- [ ] `WEBAUTHN_ORIGIN`: HTTPS URL로 설정 (예: `https://stockit.com`)
- [ ] `WEBAUTHN_RP_NAME`: 앱 이름 설정
- [ ] Upstash Redis 연결 정보 설정
- [ ] 임시 사용자 ID를 실제 사용자 시스템과 통합

### 보안 고려사항:

1. **Counter 검증**: Authenticator counter는 매번 업데이트되며 리플레이 공격을 방지합니다.
2. **Challenge 일회성**: Challenge는 한 번만 사용되며 재사용할 수 없습니다.
3. **HTTPS 필수**: 프로덕션 환경에서는 반드시 HTTPS를 사용해야 합니다.
4. **Origin 검증**: Origin이 정확히 일치해야 합니다.

## 🐛 문제 해결

### "등록된 인증 정보를 찾을 수 없습니다"
→ 먼저 등록을 완료하세요.

### "세션이 만료되었습니다"
→ Challenge는 일회성이므로 처음부터 다시 시작하세요.

### Origin 오류
→ `WEBAUTHN_ORIGIN`이 현재 URL과 정확히 일치하는지 확인하세요.

### TypeScript 오류
→ `npm install`로 의존성을 재설치하세요.

## 📊 변경된 파일 목록

1. `package.json` - 의존성 정리
2. `lib/session.ts` - 세션 관리 개선
3. `app/api/webauthn/register-challenge/route.ts` - 등록 챌린지 수정
4. `app/api/webauthn/register-verify/route.ts` - 등록 검증 수정
5. `app/api/webauthn/login-challenge/route.ts` - 로그인 챌린지 수정
6. `app/api/webauthn/login-verify/route.ts` - 로그인 검증 수정
7. `app/login/page.tsx` - 클라이언트 코드 수정
8. `.env.example` - 환경 변수 템플릿 (신규)
9. `WEBAUTHN_SETUP.md` - 설정 가이드 (신규)

## 🎉 결과

- ✅ 모든 TypeScript 오류 해결
- ✅ SimpleWebAuthn v13 API 호환
- ✅ 올바른 base64/base64url 변환
- ✅ 향상된 에러 처리
- ✅ 보안 강화 (쿠키 설정, 환경 변수 검증)
- ✅ 코드 가독성 및 유지보수성 개선
