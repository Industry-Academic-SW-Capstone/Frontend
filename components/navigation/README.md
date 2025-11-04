# Navigation Components

이 디렉토리는 앱의 네비게이션 시스템을 위한 컴포넌트들을 포함하고 있습니다.

## 구조 개요

### 뎁스 레벨

1. **메인 뎁스** (MainSwiper)
   - 홈
   - 대회
   - 랭킹
   - MY
   - 좌우 스와이프로 페이지 전환

2. **증권 뎁스** (StocksSwiper)
   - 자산
   - 탐색
   - 투자분석
   - 오른쪽에서 슬라이딩 진입
   - 좌우 스와이프로 페이지 전환

## 컴포넌트

### MainSwiper

메인 화면들(홈, 대회, 랭킹, MY) 사이의 네비게이션을 담당합니다.

**Props:**
- `selectedAccount`: 선택된 계정
- `user`: 사용자 정보
- `isDarkMode`: 다크모드 여부
- `setIsDarkMode`: 다크모드 설정 함수
- `currentScreen`: 현재 화면
- `onSlideChange`: 슬라이드 변경 시 호출되는 콜백

**특징:**
- Swiper.js의 Creative Effect 사용
- 양방향 스와이프 지원
- 부드러운 페이지 전환 애니메이션

**사용 예시:**
```tsx
<MainSwiper
  selectedAccount={selectedAccount}
  user={user}
  isDarkMode={isDarkMode}
  setIsDarkMode={setIsDarkMode}
  currentScreen={currentScreen}
  onSlideChange={setCurrentScreen}
/>
```

### StocksSwiper

증권 화면들(자산, 탐색, 투자분석) 사이의 네비게이션을 담당합니다.

**Props:**
- `currentView`: 현재 뷰
- `onSlideChange`: 슬라이드 변경 시 호출되는 콜백
- `onSelectStock`: 종목 선택 시 호출되는 콜백

**특징:**
- MainSwiper와 동일한 스와이프 경험 제공
- 증권 서브 페이지 간 전환

**사용 예시:**
```tsx
<StocksSwiper
  currentView={currentView}
  onSlideChange={setCurrentView}
  onSelectStock={handleSelectStock}
/>
```

### SlidingScreen

오른쪽에서 나타나는 전체 화면 모달 컴포넌트입니다.

**Props:**
- `isOpen`: 열림/닫힘 상태
- `onClose`: 닫기 시 호출되는 콜백
- `children`: 내부 콘텐츠
- `title`: (선택사항) 헤더 제목

**특징:**
- 오른쪽에서 왼쪽으로 슬라이딩 애니메이션
- 스와이프 제스처로 닫기 지원 (오른쪽으로 드래그)
- 배경 블러 처리
- 제목이 있는 경우 헤더 표시

**사용 예시:**
```tsx
<SlidingScreen
  isOpen={isStocksViewActive}
  onClose={handleExitStocks}
>
  <StocksContainerScreen onExit={handleExitStocks} />
</SlidingScreen>

<SlidingScreen
  isOpen={isNotificationsOpen}
  onClose={() => setIsNotificationsOpen(false)}
  title="알림"
>
  <NotificationsScreen />
</SlidingScreen>
```

## 애니메이션 상세

### Swiper 애니메이션
- **Effect**: Creative
- **Speed**: 400ms
- **Transition**: 
  - 이전 슬라이드: 왼쪽으로 100% 이동
  - 다음 슬라이드: 오른쪽에서 진입

### SlidingScreen 애니메이션
- **진입**: 오른쪽에서 왼쪽으로 슬라이딩 (300ms)
- **퇴장**: 왼쪽에서 오른쪽으로 슬라이딩 (300ms)
- **배경**: 페이드 인/아웃 (300ms)
- **제스처**: 50px 이상 드래그 시 닫기 트리거

## 스타일링

### CSS 클래스
```css
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
```

### 제스처 인터랙션
- 터치 이벤트 기반 드래그
- 실시간 transform 업데이트
- 임계값 기반 닫기 로직

## 통합 예시

```tsx
// app/page.tsx
export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isStocksViewActive, setIsStocksViewActive] = useState(false);

  const handleSetCurrentScreen = (screen: Screen) => {
    if (screen === 'stocks') {
      setIsStocksViewActive(true);
    } else {
      setCurrentScreen(screen);
      setIsStocksViewActive(false);
    }
  }

  return (
    <div>
      <MainSwiper
        currentScreen={currentScreen}
        onSlideChange={setCurrentScreen}
        // ... other props
      />
      
      <BottomNavBar 
        currentScreen={currentScreen} 
        setCurrentScreen={handleSetCurrentScreen}
        isStocksActive={isStocksViewActive}
      />

      <SlidingScreen
        isOpen={isStocksViewActive}
        onClose={() => setIsStocksViewActive(false)}
      >
        <StocksContainerScreen />
      </SlidingScreen>
    </div>
  );
}
```

## 주요 개선 사항

1. **컴포넌트화**: 재사용 가능한 네비게이션 컴포넌트로 분리
2. **Swiper.js 통합**: 부드러운 페이지 전환과 제스처 지원
3. **뎁스 구조**: 명확한 계층 구조 (메인 뎁스 ↔ 증권 뎁스)
4. **애니메이션**: 일관된 슬라이딩 애니메이션
5. **제스처 지원**: 스와이프로 페이지 전환 및 닫기

## 의존성

- `swiper`: ^12.0.3
- `react`: ^19.2.0
- `react-dom`: ^19.2.0

## 라이선스

이 프로젝트의 일부입니다.
