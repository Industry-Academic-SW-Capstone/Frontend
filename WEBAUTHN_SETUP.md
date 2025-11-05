# WebAuthn 설정 가이드

## 개요
이 프로젝트는 WebAuthn API를 사용하여 비밀번호 없는 인증을 구현합니다. 지문, Face ID, 패턴 등 생체 인증을 사용할 수 있습니다.

## 주요 수정 사항

### 1. 패키지 버전 통일
- `@simplewebauthn/types`를 v12에서 v13으로 업그레이드하여 버전 호환성 문제 해결

### 2. 세션 관리 개선 (`lib/session.ts`)
- IronSession 타입 명시
- 쿠키 옵션 강화 (httpOnly, sameSite, maxAge 추가)
- 환경 변수 검증 추가
- SECRET_COOKIE_PASSWORD 최소 길이 검증

### 3. 등록 프로세스 수정

#### `register-challenge/route.ts`
- 환경 변수 검증 함수 추가
- credentialID 변환 로직 수정 (base64 → base64url 올바른 변환)
- authenticatorSelection 옵션 추가
- transports 필드 추가
- 에러 처리 강화

#### `register-verify/route.ts`
- SimpleWebAuthn v13 API에 맞게 credential 접근 방식 수정
- 등록 성공 시 자동 로그인 처리 추가
- 상세한 에러 메시지 제공
- 파싱 오류 처리 개선

### 4. 로그인 프로세스 수정

#### `login-challenge/route.ts`
- base64 → base64url 변환 로직 수정 (수동 replace에서 Buffer 사용으로 변경)
- 등록되지 않은 사용자 에러 처리 추가
- transports 필드 추가
- 환경 변수 검증 추가

#### `login-verify/route.ts`
- 클라이언트 요청 구조 단순화 (불필요한 wrapping 제거)
- `authenticator` 파라미터를 `credential`로 변경 (v13 API)
- 상세한 에러 메시지 제공
- 파싱 오류 처리 개선

### 5. 클라이언트 수정 (`app/login/page.tsx`)
- 로그인 요청 시 assertion을 직접 전달하도록 수정

## 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# 세션 암호화 키 (32자 이상)
SECRET_COOKIE_PASSWORD=your-secret-password-at-least-32-characters-long

# WebAuthn Relying Party ID (도메인 또는 localhost)
WEBAUTHN_RP_ID=localhost

# WebAuthn Relying Party 이름
WEBAUTHN_RP_NAME=StockIt

# WebAuthn Origin (전체 URL)
WEBAUTHN_ORIGIN=http://localhost:3000

# Upstash Redis
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

### 환경 변수 생성 방법

1. **SECRET_COOKIE_PASSWORD 생성**:
```bash
openssl rand -base64 32
```

2. **Upstash Redis 설정**:
   - [Upstash Console](https://console.upstash.com/)에서 Redis 데이터베이스 생성
   - REST API 탭에서 URL과 Token 복사

## 의존성 설치

```bash
npm install
```

또는 특정 패키지만:

```bash
npm install @simplewebauthn/types@^13.0.0
```

## 사용 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저에서 테스트
1. `http://localhost:3000/login` 접속
2. "새 기기 등록 (Register)" 버튼 클릭
3. 생체 인증 프롬프트가 나타나면 인증 진행
4. 등록 완료 후 "로그인 (Login)" 버튼으로 로그인 테스트

### 3. HTTPS 환경에서 테스트 (권장)

WebAuthn은 HTTPS 환경에서 가장 잘 작동합니다. 로컬 개발 시 HTTPS를 사용하려면:

```bash
# mkcert 설치 (macOS)
brew install mkcert
mkcert -install

# 인증서 생성
mkcert localhost

# Next.js를 HTTPS로 실행
next dev --experimental-https
```

## 보안 고려사항

1. **프로덕션 환경 설정**:
   - `WEBAUTHN_RP_ID`를 실제 도메인으로 설정
   - `WEBAUTHN_ORIGIN`을 `https://` URL로 설정
   - `SECRET_COOKIE_PASSWORD`를 강력한 무작위 값으로 설정

2. **사용자 관리**:
   - 현재는 임시 사용자 ID(`temp-user-id-123`)를 사용하고 있습니다.
   - 프로덕션에서는 실제 사용자 인증 시스템과 통합해야 합니다.

3. **Counter 검증**:
   - Authenticator counter는 리플레이 공격 방지를 위해 매번 업데이트됩니다.
   - KV 저장소에 올바르게 저장되는지 확인하세요.

## 문제 해결

### 1. "등록된 인증 정보를 찾을 수 없습니다"
- 먼저 "새 기기 등록" 버튼으로 등록을 완료하세요.
- Upstash Redis 연결 확인

### 2. "세션이 만료되었습니다"
- Challenge는 일회성이므로, 등록/로그인 프로세스를 처음부터 다시 시작하세요.

### 3. Origin 오류
- `WEBAUTHN_ORIGIN`이 현재 접속 중인 URL과 정확히 일치하는지 확인
- 프로토콜(http/https), 포트 번호까지 정확히 일치해야 함

### 4. TypeScript 오류
- `npm install`로 의존성을 다시 설치
- 버전 충돌이 있다면 `package-lock.json` 삭제 후 재설치

## API 엔드포인트

| 엔드포인트 | 메소드 | 설명 |
|-----------|--------|------|
| `/api/webauthn/register-challenge` | POST | 등록용 challenge 생성 |
| `/api/webauthn/register-verify` | POST | 등록 검증 |
| `/api/webauthn/login-challenge` | POST | 로그인용 challenge 생성 |
| `/api/webauthn/login-verify` | POST | 로그인 검증 |

## 데이터 구조

### Authenticator (Upstash Redis)
```typescript
{
  credentialID: string;  // Base64 인코딩
  publicKey: string;     // Base64 인코딩
  counter: number;       // 리플레이 공격 방지용
}
```

### Session (Iron Session)
```typescript
{
  userId?: string;       // 사용자 ID
  challenge?: string;    // WebAuthn challenge
  isLoggedIn?: boolean;  // 로그인 상태
}
```

## 참고 자료

- [SimpleWebAuthn 공식 문서](https://simplewebauthn.dev/)
- [WebAuthn API 가이드](https://webauthn.guide/)
- [MDN WebAuthn 문서](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
