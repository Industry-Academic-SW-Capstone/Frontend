"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
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
import {
  getUnreadCount,
  getStoredNotifications,
  saveNotification,
} from "@/lib/services/notificationService";
import { MOCK_NOTIFICATIONS } from "@/lib/constants";
import { useAccounts } from "@/lib/hooks/useAccounts";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { useFetchInfo } from "@/lib/hooks/me/useInfo";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  // Use global store for accounts
  const token = useAuthStore((state) => state.token);
  const { selectedAccount, setSelectedAccount, accounts } = useAccountStore();
  const { isLoading: isAccountsLoading } = useAccounts({ enabled: !!token });

  // Use hook for user info
  const { data: userInfo, isLoading: isUserLoading } = useFetchInfo({
    enabled: !!token,
  });

  // Transform userInfo to match User interface if necessary, or use directly if compatible
  // Assuming userInfo matches or we map it.
  // The User interface in types/stock.ts: { username, avatar, title, group: { id, name, averageReturn } }
  // The SignUpResponse (userInfo) might be different. Let's check types later.
  // For now, we'll assume we need to map or it matches partially.
  // Let's use a default user if loading or not found for safety during transition.
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
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }

    // 초기 모의 알림 데이터 로드 (한 번만)
    const storedNotifications = getStoredNotifications();
    if (storedNotifications.length === 0) {
      MOCK_NOTIFICATIONS.forEach((notif) => saveNotification(notif));
    }

    // 읽지 않은 알림 개수 초기화
    setUnreadNotifications(getUnreadCount());

    // 알림 업데이트 이벤트 리스너
    const handleNotificationUpdate = () => {
      setUnreadNotifications(getUnreadCount());
    };

    window.addEventListener("notificationUpdate", handleNotificationUpdate);
    return () => {
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate
      );
    };
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
    // Refetch user info or handle login success
    // For now, just set logged in
    console.log("너구나");
    setIsLoggedIn(true);
  };

  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  useEffect(() => {
    setTimeout(() => {
      if (!tokenRef.current) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }, 300);
  }, []);

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
      <div className="max-w-md mx-auto bg-bg-primary text-text-primary min-h-screen font-sans relative overflow-hidden">
        <Header
          selectedAccount={currentAccount}
          user={user}
          onAccountSwitch={() => setIsAccountSwitcherOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          unreadCount={unreadNotifications}
        />

        <main className="h-screen">
          <MainSwiper
            selectedAccount={currentAccount}
            user={user}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
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
          title="알림"
        >
          <NotificationsScreen />
        </SlidingScreen>
      </div>
    </>
  );
}
