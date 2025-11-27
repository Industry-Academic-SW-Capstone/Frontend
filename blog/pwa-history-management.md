# PWA에서 뒤로가기 지옥 탈출하기: Depth와 Step을 분리한 이중 레이어 히스토리 관리

> "분명 뒤로가기를 눌렀는데 왜 앱이 꺼지죠?"

PWA(Progressive Web App)를 개발하다 보면 가장 골치 아픈 순간 중 하나가 바로 **안드로이드의 하드웨어 뒤로가기 버튼** 처리입니다. 웹 브라우저에서는 당연한 '뒤로가기' 동작이, 앱처럼 보이는 PWA 환경에서는 사용자의 기대와 다르게 동작하여 UX를 심각하게 해치는 경우가 많습니다.

이번 포스트에서는 Next.js 기반의 주식 투자 PWA 'StockIt'을 개발하며 겪었던 네비게이션 문제와, 이를 해결하기 위해 고안한 **이중 레이어(Dual-Layer) 히스토리 관리 시스템**에 대해 이야기해보려 합니다.

---

## 1. 문제의 시작: SPA와 브라우저 히스토리의 괴리

저희 앱은 `Swiper`를 활용한 슬라이드 방식의 네비게이션을 메인으로 사용하고 있습니다.

- 메인 화면 (홈, 랭킹, 프로필 등)
- 증권 탭 (포트폴리오, 탐색, 분석)
- 종목 상세 (슬라이딩 패널)

이 모든 화면 전환이 URL 변경 없이 하나의 페이지(`page.tsx`) 안에서 상태(State) 변경으로만 이루어지는 SPA(Single Page Application) 구조입니다.

### 사용자의 기대 vs 실제 동작

**상황**: 사용자가 [홈] -> [랭킹] 탭으로 이동한 뒤, 습관적으로 스마트폰의 **[뒤로가기]** 버튼을 누릅니다.

- **사용자의 기대**: 다시 [홈] 화면으로 돌아간다.
- **실제 동작**: 브라우저의 히스토리 스택이 비어있으므로, **앱이 종료**되거나 이전 사이트로 이동해버린다.

이 문제를 해결하려면 화면이 바뀔 때마다 브라우저 히스토리에 무언가를 쌓아둬야(Push) 합니다. 하지만 무턱대고 `history.pushState`를 남발하면, 뒤로가기를 수십 번 눌러도 앱이 안 꺼지는 '개미지옥'에 빠지게 됩니다.

## 2. 해결책 탐색: 네비게이션을 어떻게 정의할 것인가?

단순히 URL 라우팅을 쓰자니 모바일 앱 특유의 부드러운 전환 애니메이션을 포기해야 했고, Next.js의 Router만으로는 이 복잡한 상태를 제어하기 어려웠습니다.

그래서 우리는 앱의 네비게이션을 두 가지 차원으로 분리해서 정의하기로 했습니다.

### Depth (맥락의 깊이) vs Step (화면 내 이동)

1.  **Depth (Stack 구조)**: 책장에서 새로운 책을 꺼내는 것과 같습니다.

    - 예: 메인 화면 -> 증권 화면 -> 종목 상세 화면
    - 새로운 Depth가 열리면 이전 Depth는 '일시 정지' 상태가 됩니다.
    - 뒤로가기 시 현재 Depth를 닫고 이전 Depth를 복원합니다.

2.  **Step (Sequence 구조)**: 펼친 책 안에서 페이지를 넘기는 것입니다.
    - 예: 홈 탭 -> 랭킹 탭 -> 프로필 탭
    - 같은 맥락 안에서의 이동입니다.
    - 뒤로가기 시 바로 이전 페이지로 돌아갑니다.

이 구조를 통해 **"앱 안에서 길을 잃지 않으면서도, 원할 때 정확히 밖으로 나갈 수 있는"** 시스템을 설계했습니다.

---

## 3. 구현: Zustand를 활용한 히스토리 스토어

먼저 이 논리를 관리할 중앙 통제소가 필요했습니다. `useHistoryStore`를 만들어 Depth와 Step을 관리하는 스택(Stack) 구조를 구현했습니다.

### 데이터 구조

```typescript
// lib/stores/useHistoryStore.ts

export interface HistoryDepth {
  depthId: string; // 예: "main", "stocks", "detail_samsung"
  stepHistory: number[]; // 예: [0, 1, 2] (홈->랭킹->프로필)
}

interface HistoryState {
  stack: HistoryDepth[];
  // ... actions
}
```

### 핵심 로직: "뒤로가기 방어권" 획득

화면이 이동할 때마다 내부 상태만 바꾸는 것이 아니라, 브라우저에게도 "나 여기 있어!"라고 알려줘야 합니다.

```typescript
pushStep: (stepIndex: number) => {
  set((state) => {
    // ... 내부 스택 업데이트 로직 ...

    // 핵심: 브라우저 히스토리에 빈 상태를 push하여 뒤로가기 이벤트를 가로챌 준비를 함
    if (typeof window !== "undefined") {
      window.history.pushState(
        { depthId: currentDepth.depthId, step: stepIndex },
        "",
        window.location.pathname
      );
    }

    return { stack: newStack };
  });
},
```

이렇게 하면 사용자가 뒤로가기 버튼을 눌렀을 때 앱이 꺼지는 대신 `popstate` 이벤트가 발생하게 됩니다.

---

## 4. 브라우저와의 동기화: popstate 이벤트 핸들링

이제 가장 중요한 부분입니다. 사용자가 뒤로가기 버튼을 눌렀을 때 발생하는 `popstate` 이벤트를 잡아서, 우리가 원하는 대로 동작하게 만들어야 합니다.

`app/pwa/page.tsx`에서 이 로직을 처리했습니다.

```typescript
// app/pwa/page.tsx

useEffect(() => {
  const handlePopState = () => {
    const currentDepth = getCurrentDepth();
    const stepHistory = currentDepth.stepHistory;

    // Case A: Step Back (같은 맥락 내 이동)
    if (stepHistory.length > 1) {
      popStep(); // 내부 스택에서 제거
      const previousStep = stepHistory[stepHistory.length - 2];

      // UI 업데이트 (Swiper 이동 등)
      if (currentDepth.depthId === "main") {
        setCurrentScreen(screenOrder[previousStep]);
      }
    }
    // Case B: Depth Back (맥락 종료)
    else {
      const closedDepth = popDepth(); // 현재 Depth 제거

      // UI 업데이트 (모달 닫기, 화면 전환 등)
      if (closedDepth?.depthId === "stocks") {
        setIsStocksViewActive(false);
      }

      // 이전 Depth의 상태 복원 (중요!)
      // 사용자가 이전에 보던 화면으로 정확히 돌아가야 함
    }
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, [...]);
```

### 트러블슈팅: 상태 복원의 디테일

구현 중 가장 까다로웠던 점은 **"Depth가 닫히고 이전 화면으로 돌아갈 때의 UX"**였습니다.

예를 들어, [홈] -> [랭킹] -> [증권 탭] 순서로 이동했다가 뒤로가기를 눌러 증권 탭을 닫았을 때, 메인 화면은 [홈]이 아닌 **[랭킹]** 상태로 남아있어야 합니다.

이를 위해 `popDepth`가 일어날 때 단순히 화면을 닫는 것뿐만 아니라, 남아있는 스택의 최상단(`getCurrentDepth`) 정보를 확인하여 UI를 동기화해주는 로직을 추가했습니다. 덕분에 사용자는 맥락이 끊기지 않는 경험을 할 수 있게 되었습니다.

### 트러블슈팅 2: 과도한 방어 로직의 함정

개발 막바지에 "탭을 눌러도 화면이 이동하지 않는다"는 치명적인 버그가 발견되었습니다. 원인은 `MainSwiper` 컴포넌트에 넣어둔 **"현재 Depth가 Main일 때만 움직여라"**라는 방어 로직 때문이었습니다.

```typescript
// 문제의 코드
if (currentDepth?.depthId === "main") {
  swiperRef.current.slideTo(index);
}
```

초기 렌더링 시점이나 특정 상태 복원 시점에 `currentDepth`가 아직 초기화되지 않았거나 미세하게 타이밍이 어긋나는 경우, 이 조건문 때문에 정작 움직여야 할 때 움직이지 못하는 현상이 발생했습니다.

**해결**: `MainSwiper`는 어차피 Main Depth를 담당하는 컴포넌트이므로, 굳이 현재 Depth를 확인할 필요가 없다고 판단했습니다. 과도한 방어 로직을 제거하고, props로 들어온 `currentScreen` 값에 충실하게 반응하도록 수정하여 문제를 해결했습니다.

> **Lesson**: 상태 관리의 정합성을 맞추는 것도 중요하지만, UI 컴포넌트는 자신의 역할(여기서는 화면 전환)에 충실해야 합니다. 너무 많은 책임을 지우려다 보면 오히려 기본 기능이 망가질 수 있습니다.

### 트러블슈팅 3: 놓치기 쉬운 Depth ID

새로운 기능을 추가하다 보면 `SlidingScreen` 같은 공통 컴포넌트를 재사용하게 되는데, 이때 `depthId` prop을 전달하는 것을 깜빡하기 쉽습니다.

```typescript
// 실수하기 쉬운 코드
<SlidingScreen isOpen={isOpen} onClose={close}>
  <NewFeature />
</SlidingScreen>
```

이렇게 하면 화면은 열리지만 히스토리 스택에는 아무것도 쌓이지 않습니다. 사용자가 뒤로가기를 누르면 이 화면이 닫히는 게 아니라, 그 뒤에 있는(이전에 열어둔) Depth가 닫히거나 앱이 종료되어 버립니다.

**해결**: `SlidingScreen` 컴포넌트 내부에서 `depthId`가 없을 때 경고(console.warn)를 띄우도록 하여 개발 단계에서 실수를 잡을 수 있게 했습니다. (실제 코드에는 아직 반영 안 했지만 좋은 아이디어입니다!)

---

## 5. 결과 및 인사이트

이 시스템을 적용한 후, 다음과 같은 변화가 있었습니다.

1.  **앱 종료 방지**: 실수로 뒤로가기를 눌러 앱이 꺼지는 일이 사라졌습니다.
2.  **직관적인 네비게이션**: 모달이나 상세 화면에서 뒤로가기를 누르면 정확히 이전 화면으로 닫힙니다.
3.  **Native-like Experience**: 웹이지만 네이티브 앱과 거의 동일한 네비게이션 경험을 제공합니다.

### 개발하며 느낀 점

PWA는 웹의 장점과 앱의 장점을 모두 가질 수 있지만, 그만큼 두 환경의 차이를 메우기 위한 디테일한 노력이 필요하다는 것을 다시 한번 느꼈습니다. 특히 '뒤로가기' 같은 기본적인 UX는 사용자가 의식하지 못할 정도로 자연스러워야 합니다.

단순히 라이브러리를 가져다 쓰는 것보다, 우리 앱의 네비게이션 구조(Depth & Step)를 명확히 정의하고 그에 맞는 커스텀 로직을 구현한 것이 주효했습니다.

앞으로는 이 구조를 바탕으로 제스처 네비게이션이나 딥링크 처리까지 확장해 나갈 예정입니다. PWA의 한계를 넘는 도전은 계속됩니다! 🚀
