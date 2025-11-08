# Toast 시스템

프로젝트 전역에서 사용할 수 있는 모던하고 인터랙티브한 Toast 알림 시스템입니다.

## 특징

- ✨ **4가지 타입**: info, success, error, warning
- 📍 **6개 위치 지원**: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- ⏱️ **자동 소멸**: 커스텀 duration 설정 가능
- 🎨 **모던한 디자인**: OnboardingScreen과 일관된 UI
- 🎭 **부드러운 애니메이션**: 슬라이드인, 페이드아웃 효과
- 📊 **진행률 표시**: 시각적 프로그레스 바
- 🎯 **ReactNode 지원**: 텍스트, JSX 모두 가능
- ♿ **접근성**: ARIA 라벨 지원
- 🔔 **커스텀 아이콘**: 기본 아이콘 또는 커스텀 아이콘 사용
- 💨 **Dismissible**: 수동으로 닫기 가능

## 사용 방법

### 기본 사용

```tsx
import { toast } from "@/lib/stores/useToastStore";

// 성공 메시지
toast.success("계정이 성공적으로 생성되었습니다!");

// 에러 메시지
toast.error("로그인에 실패했습니다.");

// 정보 메시지
toast.info("새로운 업데이트가 있습니다.");

// 경고 메시지
toast.warning("네트워크 연결이 불안정합니다.");
```

### 고급 옵션

```tsx
// 커스텀 duration
toast.success("저장되었습니다!", {
  duration: 5000, // 5초
});

// 위치 지정
toast.info("알림", {
  position: "bottom-right",
});

// 자동 소멸 없음
toast.error("중요한 메시지", {
  duration: 0, // 수동으로 닫아야 함
});

// 닫기 버튼 없음
toast.info("닫기 불가", {
  dismissible: false,
});

// 커스텀 아이콘
import { SparklesIcon } from "@/components/icons/Icons";

toast.success("업적 달성!", {
  icon: <SparklesIcon className="w-5 h-5 text-accent" />,
});

// ReactNode 컨텐츠
toast.info(
  <div>
    <div className="font-bold">새로운 기능!</div>
    <div className="text-xs mt-1">이제 실시간 차트를 확인할 수 있습니다.</div>
  </div>,
  { duration: 5000 }
);
```

### Toast 제어

```tsx
// Toast ID 받기
const toastId = toast.success("처리 중...");

// 특정 Toast 닫기
toast.dismiss(toastId);

// 모든 Toast 닫기
toast.dismissAll();
```

### 컴포넌트에서 사용

```tsx
"use client";
import React from "react";
import { toast } from "@/lib/stores/useToastStore";

const MyComponent = () => {
  const handleSubmit = async () => {
    try {
      // API 호출
      await api.submit();
      toast.success("제출이 완료되었습니다!");
    } catch (error) {
      toast.error("제출 중 오류가 발생했습니다.");
    }
  };

  return <button onClick={handleSubmit}>제출하기</button>;
};
```

### 로그인 예제

```tsx
const handleLogin = async () => {
  const loadingId = toast.info("로그인 중...", { duration: 0 });

  try {
    await login(credentials);
    toast.dismiss(loadingId);
    toast.success("로그인 성공!");
  } catch (error) {
    toast.dismiss(loadingId);
    toast.error("로그인 실패. 다시 시도해주세요.");
  }
};
```

### 복잡한 컨텐츠

```tsx
toast.success(
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <TrophyIcon className="w-5 h-5 text-accent" />
      <span className="font-bold">새 업적 달성!</span>
    </div>
    <div className="text-xs text-text-secondary">
      "첫 거래" 업적을 달성했습니다.
    </div>
    <div className="mt-1 px-3 py-1 bg-accent/20 rounded-lg text-xs font-semibold text-accent w-fit">
      +100 포인트
    </div>
  </div>,
  {
    duration: 6000,
    position: "top-right",
  }
);
```

## API 레퍼런스

### Toast 옵션

| 옵션          | 타입                                          | 기본값         | 설명                                 |
| ------------- | --------------------------------------------- | -------------- | ------------------------------------ |
| `content`     | `ReactNode`                                   | required       | Toast에 표시할 내용                  |
| `type`        | `'info' \| 'success' \| 'error' \| 'warning'` | `'info'`       | Toast 타입                           |
| `duration`    | `number`                                      | `3000`         | 표시 시간 (ms), 0이면 자동 소멸 없음 |
| `position`    | `ToastPosition`                               | `'top-center'` | 표시 위치                            |
| `dismissible` | `boolean`                                     | `true`         | 닫기 버튼 표시 여부                  |
| `icon`        | `ReactNode`                                   | `undefined`    | 커스텀 아이콘                        |

### Toast 메서드

| 메서드                             | 설명              |
| ---------------------------------- | ----------------- |
| `toast.success(content, options?)` | 성공 Toast 표시   |
| `toast.error(content, options?)`   | 에러 Toast 표시   |
| `toast.info(content, options?)`    | 정보 Toast 표시   |
| `toast.warning(content, options?)` | 경고 Toast 표시   |
| `toast.custom(content, options?)`  | 커스텀 Toast 표시 |
| `toast.dismiss(id)`                | 특정 Toast 닫기   |
| `toast.dismissAll()`               | 모든 Toast 닫기   |

### 위치 옵션

- `top-left`: 왼쪽 상단
- `top-center`: 중앙 상단 (기본값)
- `top-right`: 오른쪽 상단
- `bottom-left`: 왼쪽 하단
- `bottom-center`: 중앙 하단
- `bottom-right`: 오른쪽 하단

## 스타일 커스터마이징

Toast는 프로젝트의 디자인 시스템을 따릅니다:

- Primary color: `#4053e4`
- Success (positive): `#22c55e`
- Error (negative): `#ef4444`
- Warning (accent): `#f59e0b`

각 타입별로 자동으로 적절한 색상과 아이콘이 적용됩니다.

## 주의사항

1. **서버 컴포넌트**: `toast` 함수는 클라이언트 컴포넌트에서만 사용 가능합니다. `"use client"` 지시어를 추가하세요.

2. **다크 모드**: Toast는 자동으로 다크 모드를 지원합니다.

3. **성능**: 동시에 많은 Toast를 표시하면 성능에 영향을 줄 수 있습니다. 필요한 경우에만 사용하세요.

4. **접근성**: 모든 Toast는 `role="alert"`와 `aria-live="polite"` 속성을 가지고 있어 스크린 리더에서 읽힙니다.
