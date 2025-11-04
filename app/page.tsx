'use client';

import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import Header from '@/components/Header';
import BottomNavBar from '@/components/BottomNavBar';
import MainSwiper from '@/components/navigation/MainSwiper';
import SlidingScreen from '@/components/navigation/SlidingScreen';
import StocksContainerScreen from '@/components/screens/StocksContainerScreen';
import NotificationsScreen from '@/components/screens/NotificationsScreen';
import AccountSwitcher from '@/components/AccountSwitcher';
import OnboardingScreen from '@/components/screens/OnboardingScreen';
import { Screen, Account, User } from '@/lib/types';
import { MOCK_ACCOUNTS, MOCK_USER } from '@/lib/constants';
import { getUnreadCount, getStoredNotifications, saveNotification } from '@/lib/services/notificationService';
import { MOCK_NOTIFICATIONS } from '@/lib/constants';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedAccount, setSelectedAccount] = useState<Account>(MOCK_ACCOUNTS[0]);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isStocksViewActive, setIsStocksViewActive] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }

    // 초기 모의 알림 데이터 로드 (한 번만)
    const storedNotifications = getStoredNotifications();
    if (storedNotifications.length === 0) {
      MOCK_NOTIFICATIONS.forEach(notif => saveNotification(notif));
    }

    // 읽지 않은 알림 개수 초기화
    setUnreadNotifications(getUnreadCount());

    // 알림 업데이트 이벤트 리스너
    const handleNotificationUpdate = () => {
      setUnreadNotifications(getUnreadCount());
    };

    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSetCurrentScreen = (screen: Screen) => {
    if (screen === 'stocks') {
        setIsStocksViewActive(true);
    } else {
        setCurrentScreen(screen);
        setIsStocksViewActive(false);
    }
  }

  const handleExitStocks = () => {
    setIsStocksViewActive(false);
  }

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsAccountSwitcherOpen(false);
  };
  
  const handleLoginSuccess = (newUser: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...newUser }));
    setIsLoggedIn(true);
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
        case 'home': return '홈';
        case 'competitions': return '대회';
        case 'rankings': return '랭킹';
        case 'profile': return 'MY';
        default: return 'StonkApp';
    }
  }

  if (!isLoggedIn) {
    return <OnboardingScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <div className="max-w-md mx-auto bg-bg-primary text-text-primary min-h-screen font-sans relative overflow-hidden">
        <Header 
          selectedAccount={selectedAccount}
          user={user}
          onAccountSwitch={() => setIsAccountSwitcherOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          unreadCount={unreadNotifications}
        />
        
        <main className="h-screen">
          <MainSwiper
            selectedAccount={selectedAccount}
            user={user}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            currentScreen={currentScreen}
            onSlideChange={setCurrentScreen}
          />
        </main>
        
        <BottomNavBar 
          currentScreen={currentScreen} 
          setCurrentScreen={handleSetCurrentScreen}
          isStocksActive={isStocksViewActive}
        />

        {/* 증권 화면 - 오른쪽에서 슬라이딩 */}
        <SlidingScreen
          isOpen={isStocksViewActive}
          onClose={handleExitStocks}
        >
          <StocksContainerScreen onExit={handleExitStocks} />
        </SlidingScreen>

        <AccountSwitcher
          isOpen={isAccountSwitcherOpen}
          onClose={() => setIsAccountSwitcherOpen(false)}
          accounts={MOCK_ACCOUNTS}
          selectedAccount={selectedAccount}
          onSelect={handleSelectAccount}
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
      
      <Analytics />
    </>
  );
}
