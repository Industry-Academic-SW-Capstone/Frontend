# Upstash Redis JSON 처리 오류 수정

## 🐛 문제 분석

### 에러 메시지
```
인증 정보 파싱 실패: SyntaxError: "[object Object]" is not valid JSON
    at JSON.parse (<anonymous>)
    at POST (app/api/webauthn/login-challenge/route.ts:29:51)
```

### 원인

Upstash Redis의 동작 방식을 잘못 이해하여 발생한 문제입니다.

#### 잘못된 코드
```typescript
// ❌ 잘못된 방식
const authDataString = await kv.get<string>(userId);
const authenticator: Authenticator = JSON.parse(authDataString);  // 에러 발생!

await kv.set(userId, JSON.stringify(newAuthenticator));  // 불필요한 직렬화
```

#### 문제점
1. **Upstash Redis는 자동으로 JSON 직렬화/역직렬화를 처리합니다**
2. `kv.get<T>()`는 이미 파싱된 객체를 반환합니다
3. `kv.set()`은 객체를 자동으로 JSON으로 변환합니다
4. 따라서 수동으로 `JSON.parse()`나 `JSON.stringify()`를 사용하면 오류가 발생합니다

## ✅ 해결 방법

### 올바른 코드
```typescript
// ✅ 올바른 방식
const authenticator = await kv.get<Authenticator>(userId);  // 이미 객체로 반환됨

await kv.set(userId, newAuthenticator);  // 자동으로 직렬화됨
```

## 📝 수정된 파일

### 1. `register-challenge/route.ts`
```typescript
// Before
const authDataString = await kv.get<string>(user.id);
if (authDataString) {
  const authenticator: Authenticator = JSON.parse(authDataString);
  // ...
}

// After
const authenticator = await kv.get<Authenticator>(user.id);
if (authenticator) {
  // 직접 사용 가능
  // ...
}
```

### 2. `register-verify/route.ts`
```typescript
// Before
await kv.set(userId, JSON.stringify(newAuthenticator));

// After
await kv.set(userId, newAuthenticator);
```

### 3. `login-challenge/route.ts`
```typescript
// Before
const authDataString = await kv.get<string>(userId);
if (authDataString) {
  const authenticator: Authenticator = JSON.parse(authDataString);
  // ...
}

// After
const authenticator = await kv.get<Authenticator>(userId);
if (authenticator) {
  // 직접 사용 가능
  // ...
}
```

### 4. `login-verify/route.ts`
```typescript
// Before
const authDataString = await kv.get<string>(userId);
const authenticator: Authenticator = JSON.parse(authDataString);
await kv.set(userId, JSON.stringify(updatedAuthenticator));

// After
const authenticator = await kv.get<Authenticator>(userId);
await kv.set(userId, updatedAuthenticator);
```

## 🔍 Upstash Redis 사용법 정리

### GET 작업
```typescript
// 제네릭 타입을 지정하면 자동으로 파싱됨
const user = await kv.get<User>('user:123');
// user는 User 타입의 객체

const data = await kv.get<string>('simple-string');
// 단순 문자열도 그대로 반환

const count = await kv.get<number>('counter');
// 숫자도 그대로 반환
```

### SET 작업
```typescript
// 객체를 직접 전달
await kv.set('user:123', { name: 'John', age: 30 });
// 자동으로 JSON으로 직렬화됨

// 문자열
await kv.set('key', 'value');

// 숫자
await kv.set('counter', 42);
```

### 주의사항
- **절대 `JSON.parse()`나 `JSON.stringify()`를 사용하지 마세요**
- Upstash Redis가 자동으로 처리합니다
- 제네릭 타입을 올바르게 지정하면 타입 안전성도 확보됩니다

## 🎯 결과

- ✅ 로그인 시 파싱 에러 해결
- ✅ 코드 간소화 (불필요한 직렬화 제거)
- ✅ 타입 안전성 향상
- ✅ 더 명확한 코드

## 🧪 테스트 방법

1. 기존 Redis 데이터 삭제 (이전 잘못된 형식 제거):
   - Upstash Console에서 데이터 삭제
   - 또는 새로운 사용자 ID로 테스트

2. 등록 테스트:
   ```
   http://localhost:3000/login
   "새 기기 등록" 클릭
   ```

3. 로그인 테스트:
   ```
   "로그인" 클릭
   에러 없이 성공해야 함
   ```

## 📚 참고 자료

- [Upstash Redis 공식 문서](https://docs.upstash.com/redis)
- [Upstash Redis SDK](https://github.com/upstash/upstash-redis)
