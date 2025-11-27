"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Header from "@/components/Header";
import BottomNavBar from "@/components/BottomNavBar";
import MainSwiper from "@/components/navigation/MainSwiper";
import SlidingScreen from "@/components/navigation/SlidingScreen";
import StocksContainerScreen from "@/components/screens/StocksContainerScreen";
import NotificationsScreen from "@/components/screens/NotificationsScreen";
import AccountSwitcher from "@/components/AccountSwitcher";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import HomeScreenSkeleton from "@/components/screens/HomeScreenSkeleton";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import { Screen, Account, User } from "@/lib/types/stock";
import { MOCK_USER } from "@/lib/constants";
import { WebSocketProvider } from "@/lib/providers/SocketProvider";

import { useAccounts } from "@/lib/hooks/useAccounts";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { useFetchInfo, usePutInfo } from "@/lib/hooks/me/useInfo";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useUnreadCount } from "@/lib/hooks/notifications/useUnreadCount";
import { useHistoryStore } from "@/lib/stores/useHistoryStore";
import { useStockStore } from "@/lib/stores/useStockStore";
import {
  isTokenRegistered,
  requestNotificationPermission,
} from "@/lib/services/notificationService";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";
import { useTutorialStore } from "@/lib/store/useTutorialStore";

import { Base64 } from "js-base64";
import { useCompetitionEntryStore } from "@/lib/stores/useCompetitionEntryStore";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [isTutorialOn, setIsTutorialOn] = useState(false);

  // Use global store for accounts
  const token = useAuthStore((state) => state.token);
  const { selectedAccount, setSelectedAccount, accounts } = useAccountStore();
  const { setPendingEntry } = useCompetitionEntryStore();
  const { isLoading: isAccountsLoading } = useAccounts({ enabled: !!token });

  // Use hook for user info
  const { data: userInfo, isLoading: isUserLoading } = useFetchInfo({
    enabled: !!token,
  });

  const { mutate: updateInfo } = usePutInfo();

  // Use hook for unread notifications
  const { data: unreadCountData, refetch: refetchUnreadCount } = useUnreadCount(
    {
      enabled: !!token,
    }
  );
  const unreadNotifications = unreadCountData?.unreadCount || 0;

  // Transform userInfo to match User interface if necessary
  const user: User = userInfo
    ? {
        username: userInfo.name,
        avatar: userInfo.profileImage,
        title: "초보 투자자", // Mock or derive from data
        group: { id: "1", name: "새싹 투자자", averageReturn: 0 }, // Mock or derive
      }
    : MOCK_USER;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isStocksViewActive, setIsStocksViewActive] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPermissionPopupOpen, setIsPermissionPopupOpen] = useState(false);

  // History management
  const { popStep, popDepth, getCurrentDepth, getCurrentStep } =
    useHistoryStore();
  const { setStocksView } = useStockStore();

  // Check notification permission on load
  useEffect(() => {
    if (isTutorialOn) {
      setIsPermissionPopupOpen(false);
      return;
    } else if (userInfo && userInfo.notificationAgreement) {
      // Check if token is registered in localStorage
      // We need to wait for mount to access localStorage safely, but useEffect runs on mount.
      const hasToken = isTokenRegistered();
      if (!hasToken) {
        // If user agreed but no token on this device, ask to enable
        // Use a small timeout to not block initial render
        setTimeout(() => {
          setIsPermissionPopupOpen(true);
        }, 1000);
      }
    }
  }, [userInfo, isTutorialOn]);

  const handlePermissionConfirm = async () => {
    setIsPermissionPopupOpen(false);
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      // If denied or closed, we should probably update the agreement to false
      // to reflect the actual state, or just leave it as is?
      // User said: "If no, set notificationAgreement to false via usePutInfo"
      updateInfo({ notificationAgreement: false });
    }
  };

  const handlePermissionDeny = () => {
    setIsPermissionPopupOpen(false);
    updateInfo({ notificationAgreement: false });
  };

  useEffect(() => {
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleSetCurrentScreen = (screen: Screen) => {
    if (screen === "stocks") {
      setIsStocksViewActive(true);
    } else {
      setCurrentScreen(screen);
      setIsStocksViewActive(false);
    }
  };

  const handleExitStocks = () => {
    setIsStocksViewActive(false);
  };

  const handleLoginSuccess = (newUser: Partial<User>) => {
    setIsLoggedIn(true);
  };

  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Handle URL Hash for Competition Entry
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#entry-")) {
      try {
        const encodedData = hash.replace("#entry-", "");
        const decodedData = Base64.decode(encodedData);
        const [contestId, password, contestName] = decodedData.split("-@-");

        if (contestId) {
          // Store in sessionStorage for persistence across reloads/login
          sessionStorage.setItem(
            "pendingCompetitionEntry",
            JSON.stringify({
              contestId: Number(contestId),
              password: password === "undefined" ? undefined : password,
              contestName:
                contestName === "undefined" ? undefined : contestName,
            })
          );

          // Clear hash
          window.history.replaceState(null, "", window.location.pathname);
        }
      } catch (e) {
        console.error("Failed to parse competition entry hash", e);
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!tokenRef.current) {
        setIsLoggedIn(false);
        // Check if there is a pending entry to show a message
        const pendingEntry = sessionStorage.getItem("pendingCompetitionEntry");
        if (pendingEntry) {
          // Optional: You could show a toast here saying "Please login to join the competition"
          // For now, the OnboardingScreen will just show up
        }
      } else {
        setIsLoggedIn(true);
        // Check for pending competition entry
        const pendingEntry = sessionStorage.getItem("pendingCompetitionEntry");
        if (pendingEntry) {
          try {
            const { contestId, password, contestName } =
              JSON.parse(pendingEntry);

            setPendingEntry(contestId, password, contestName);
            setCurrentScreen("competitions");

            // Clear storage so it doesn't trigger again
            sessionStorage.removeItem("pendingCompetitionEntry");
          } catch (e) {
            console.error("Failed to parse pending entry from storage", e);
            sessionStorage.removeItem("pendingCompetitionEntry");
          }
        }
      }
    }, 400);
  }, []);

  // Tutorial Trigger
  const { startHomeTutorial } = useTutorialStore();

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setIsTutorialOn(false);
    updateInfo({ mainTutorialCompleted: true });
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      userInfo &&
      !userInfo.mainTutorialCompleted &&
      !isAccountsLoading &&
      !isUserLoading
    ) {
      setIsTutorialOn(true);
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        startHomeTutorial();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    isLoggedIn,
    userInfo,
    isAccountsLoading,
    isUserLoading,
    startHomeTutorial,
  ]);

  // popstate 이벤트 리스너: 브라우저 뒤로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      const currentDepth = getCurrentDepth();
      const currentStep = getCurrentStep();

      if (!currentDepth || currentStep === null) {
        // Case C: 스택이 비어있으면 앱 종료 (브라우저 기본 동작)
        return;
      }

      const stepHistory = currentDepth.stepHistory;

      if (stepHistory.length > 1) {
        // Case A: Step Back - 현재 Depth 내에서 이전 Step으로 이동
        popStep();
        const previousStep = stepHistory[stepHistory.length - 2];

        // UI 업데이트: Depth에 따라 다른 처리
        if (currentDepth.depthId === "main") {
          // Main Depth: currentScreen 업데이트
          const screenOrder: Screen[] = [
            "home",
            "competitions",
            "rankings",
            "profile",
          ];
          const previousScreen = screenOrder[previousStep];
          if (previousScreen) {
            setCurrentScreen(previousScreen);
          }
        } else if (currentDepth.depthId === "stocks") {
          // Stocks Depth: stocksView 업데이트
          const viewOrder = ["portfolio", "explore", "analysis"] as const;
          const previousView = viewOrder[previousStep];
          if (previousView) {
            setStocksView(previousView);
          }
        }
      } else {
        // Case B: Depth Back - 현재 Depth를 닫고 이전 Depth로 복귀
        const closedDepth = popDepth();

        if (closedDepth?.depthId === "stocks") {
          // Stocks 화면 닫기
          setIsStocksViewActive(false);
        } else if (closedDepth?.depthId.startsWith("detail_")) {
          // Detail 화면 닫기 (SlidingScreen)
          // SlidingScreen별 onClose는 해당 컴포넌트에서 처리
          if (closedDepth.depthId.startsWith("detail_notifications")) {
            setIsNotificationsOpen(false);
          }
          // 종목 상세는 StocksContainerScreen에서 처리
        }

        // 이전 Depth 복원 (애니메이션 없이)
        const previousDepth = getCurrentDepth();
        const previousStep = getCurrentStep();

        if (previousDepth?.depthId === "main" && previousStep !== null) {
          const screenOrder: Screen[] = [
            "home",
            "competitions",
            "rankings",
            "profile",
          ];
          const previousScreen = screenOrder[previousStep];
          if (previousScreen) {
            setCurrentScreen(previousScreen);
          }
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [popStep, popDepth, getCurrentDepth, getCurrentStep]);

  // If not logged in and not loading (or if we know there's no token), show Onboarding
  if (!token || !isLoggedIn) {
    return (
      <Suspense fallback={null}>
        <OnboardingScreen onLoginSuccess={handleLoginSuccess} />
      </Suspense>
    );
  }

  if ((!isLoggedIn || !userInfo) && !isUserLoading && !token) {
    return (
      <Suspense fallback={null}>
        <OnboardingScreen onLoginSuccess={handleLoginSuccess} />
      </Suspense>
    );
  }

  // Show loading if data is loading and we have a token (so we expect data)
  if ((isAccountsLoading || isUserLoading) && token) {
    return (
      <div className="max-w-md mx-auto bg-bg-primary text-text-primary min-h-screen font-sans relative overflow-hidden">
        <HeaderSkeleton />
        <main className="h-screen p-4 pt-20">
          <HomeScreenSkeleton />
        </main>
        <BottomNavBar
          currentScreen={currentScreen}
          setCurrentScreen={handleSetCurrentScreen}
          isStocksActive={isStocksViewActive}
        />
      </div>
    );
  }

  const currentAccount: Account = selectedAccount || {
    id: 1,
    memberId: 1,
    contestId: 1,
    name: "urous3814 기본계좌",
    type: "regular",
    totalValue: 1000000,
    cashBalance: 1000000,
    change: 0,
    changePercent: 0,
    isDefault: true,
    chartData: [],
  };

  return (
    <>
      <WebSocketProvider>
        <div className="max-w-md mx-auto bg-bg-primary text-text-primary min-h-screen font-sans relative overflow-hidden">
          <Header
            selectedAccount={currentAccount}
            user={user}
            onAccountSwitch={() => setIsAccountSwitcherOpen(true)}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            unreadCount={unreadNotifications}
          />

          <main className="h-screen mt-16">
            <MainSwiper
              selectedAccount={currentAccount}
              user={user}
              isStockContainerActive={isStocksViewActive}
              currentScreen={currentScreen}
              onSlideChange={handleSetCurrentScreen}
            />
          </main>

          <BottomNavBar
            currentScreen={currentScreen}
            setCurrentScreen={handleSetCurrentScreen}
            isStocksActive={isStocksViewActive}
          />

          {/* 증권 화면 - 오른쪽에서 슬라이딩 */}
          <SlidingScreen isOpen={isStocksViewActive} onClose={handleExitStocks}>
            <StocksContainerScreen onExit={handleExitStocks} />
          </SlidingScreen>

          <AccountSwitcher
            isOpen={isAccountSwitcherOpen}
            onClose={() => setIsAccountSwitcherOpen(false)}
          />

          {/* 알림 화면 - 오른쪽에서 슬라이딩 */}
          <SlidingScreen
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            depthId="detail_notifications"
          >
            <NotificationsScreen
              onClose={() => setIsNotificationsOpen(false)}
            />
          </SlidingScreen>

          {/* Permission Popup Modal */}
          {isPermissionPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-bg-primary w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-scaleIn p-6 text-center">
                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">🔔</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  알림을 켜시겠어요?
                </h3>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  중요한 투자 정보와 체결 알림을 <br />
                  놓치지 않고 받아보세요.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handlePermissionConfirm}
                    className="flex-1 py-3.5 rounded-xl bg-primary text-text-primary font-semibold active-transition"
                  >
                    좋아요
                  </button>
                  <button
                    onClick={handlePermissionDeny}
                    className="flex-1 py-3.5 rounded-xl bg-bg-secondary text-text-primary font-semibold active-transition"
                  >
                    다음에
                  </button>
                </div>
              </div>
            </div>
          )}

          <TutorialOverlay onComplete={handleTutorialComplete} />
        </div>
      </WebSocketProvider>
    </>
  );
}
