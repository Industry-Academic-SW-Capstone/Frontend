# WebAuthn QR 코드 문제 해결

## 🐛 문제 상황

### 증상
- ✅ **등록**: FaceID/Touch ID로 정상 작동
- ❌ **로그인**: QR 코드 스캔 화면이 표시됨
  - "iOS 16 또는 이후 버전이 설치된 기기로 이 QR 코드를 스캔하세요"
  - iPhone 15 (최신 iOS)에서도 QR 코드 표시

## 🔍 원인 분석

### 1. **잘못된 `transports` 설정**

로그인 시 `transports` 배열에 `'hybrid'`가 포함되어 있었습니다:

```typescript
// ❌ 문제가 있는 코드
transports: ['internal', 'hybrid']  // hybrid = QR 코드 스캔!
```

**Transports 의미:**
- `'internal'`: Platform authenticator (같은 기기의 FaceID/Touch ID)
- `'hybrid'`: 크로스-디바이스 인증 (QR 코드로 다른 기기 연결)
- `'usb'`: USB 보안 키
- `'nfc'`: NFC 보안 키
- `'ble'`: Bluetooth 보안 키

### 2. **등록 시 `transports` 정보를 저장하지 않음**

등록할 때 실제로 사용된 transports를 저장하지 않고, 로그인 시 임의로 설정했습니다.

### 3. **`authenticatorAttachment` 미설정**

등록 시 `authenticatorAttachment: 'platform'`을 설정하지 않아 브라우저가 어떤 authenticator를 사용할지 명확하게 알 수 없었습니다.

### 4. **`userVerification` 설정 문제**

`'preferred'`로 설정되어 있어 생체 인증이 선택사항이었습니다.

## ✅ 해결 방법

### 1. **Authenticator 타입에 `transports` 추가**

```typescript
// lib/session.ts
export interface Authenticator {
  credentialID: string;
  publicKey: string;
  counter: number;
  transports?: AuthenticatorTransportFuture[]; // 추가!
}
```

### 2. **등록 시 설정 개선**

```typescript
// register-challenge/route.ts
const options = await generateRegistrationOptions({
  rpID,
  rpName,
  userID: new Uint8Array(Buffer.from(user.id, 'utf8')),
  userName: user.name,
  attestationType: 'none',
  authenticatorSelection: {
    authenticatorAttachment: 'platform', // ✅ 같은 기기만 사용!
    residentKey: 'preferred',
    userVerification: 'required',        // ✅ 생체 인증 필수!
  },
  excludeCredentials,
});
```

**주요 변경 사항:**
- `authenticatorAttachment: 'platform'`: 같은 기기의 생체 인증만 사용
- `userVerification: 'required'`: 생체 인증 필수

### 3. **등록 검증 시 `transports` 저장**

```typescript
// register-verify/route.ts
const transports = attestationResponse.response.transports;

const newAuthenticator: Authenticator = {
  credentialID: Buffer.from(credential.id).toString('base64'),
  publicKey: Buffer.from(credential.publicKey).toString('base64'),
  counter: credential.counter,
  transports: transports, // ✅ 실제 사용된 transports 저장!
};
```

### 4. **로그인 시 저장된 `transports` 사용**

```typescript
// login-challenge/route.ts
allowCredentials.push({
  id: idBuffer.toString('base64url'),
  type: 'public-key' as const,
  transports: authenticator.transports, // ✅ 저장된 값 사용!
});

const options = await generateAuthenticationOptions({
  rpID,
  allowCredentials,
  userVerification: 'required', // ✅ 생체 인증 필수!
});
```

## 📝 수정된 파일

1. **`lib/session.ts`**: Authenticator 인터페이스에 `transports` 추가
2. **`register-challenge/route.ts`**: 
   - `authenticatorAttachment: 'platform'` 추가
   - `userVerification: 'required'` 변경
3. **`register-verify/route.ts`**: `transports` 정보 저장
4. **`login-challenge/route.ts`**: 
   - 저장된 `transports` 사용
   - `userVerification: 'required'` 변경

## 🎯 예상 동작

### Before (문제 상황)
```
등록: FaceID ✅
↓
로그인: QR 코드 ❌ (hybrid transport 때문)
```

### After (수정 후)
```
등록: FaceID ✅ (platform + transports 저장)
↓
로그인: FaceID ✅ (저장된 transports 사용)
```

## 🧪 테스트 방법

### 중요: 기존 등록 데이터 삭제 필요!

기존에 등록한 데이터에는 `transports` 정보가 없으므로 **반드시 재등록**이 필요합니다.

#### 옵션 1: Upstash Console에서 삭제
1. [Upstash Console](https://console.upstash.com/) 접속
2. Redis 데이터베이스 선택
3. Data Browser에서 `temp-user-id-123` 키 삭제

#### 옵션 2: 다른 사용자 ID로 테스트
코드에서 임시 사용자 ID를 변경하여 테스트

### 테스트 순서

1. **기존 데이터 삭제**
2. **재등록**:
   ```
   http://localhost:3000/login
   "새 기기 등록" 클릭
   FaceID/Touch ID로 인증
   ```
3. **로그인**:
   ```
   "로그인" 클릭
   FaceID/Touch ID로 인증 ✅ (QR 코드 없음!)
   ```

## 🔬 디버깅 팁

등록 후 Redis에 저장된 데이터를 확인하면:

```json
{
  "credentialID": "...",
  "publicKey": "...",
  "counter": 0,
  "transports": ["internal"]  // ✅ 'hybrid' 없음!
}
```

`transports`에 `'internal'`만 있으면 같은 기기의 생체 인증만 사용합니다.

## 📚 참고 자료

### AuthenticatorTransport 값들

| 값 | 의미 | 사용 예시 |
|---|------|----------|
| `internal` | Platform authenticator | FaceID, Touch ID, Windows Hello |
| `hybrid` | 크로스-디바이스 | QR 코드로 스마트폰 연결 |
| `usb` | USB 연결 | YubiKey 등 USB 보안 키 |
| `nfc` | NFC 연결 | NFC 보안 키 |
| `ble` | Bluetooth | Bluetooth 보안 키 |
| `smart-card` | 스마트 카드 | 스마트 카드 리더기 |

### AuthenticatorAttachment 값들

| 값 | 의미 |
|---|------|
| `platform` | 같은 기기에 내장된 authenticator (FaceID, Touch ID) |
| `cross-platform` | 외부 authenticator (USB 키, 다른 기기) |

### UserVerification 값들

| 값 | 의미 |
|---|------|
| `required` | 생체 인증 필수 |
| `preferred` | 생체 인증 권장 (선택사항) |
| `discouraged` | 생체 인증 비권장 |

## 🎉 결과

- ✅ 등록: FaceID/Touch ID로 작동
- ✅ 로그인: FaceID/Touch ID로 작동 (QR 코드 없음!)
- ✅ 같은 기기에서 일관된 생체 인증 경험
- ✅ 크로스-디바이스 인증 방지
