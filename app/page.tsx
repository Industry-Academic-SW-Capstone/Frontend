'use client';

import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import Header from '@/components/Header';
import BottomNavBar from '@/components/BottomNavBar';
import HomeScreen from '@/components/screens/HomeScreen';
import CompetitionsScreen from '@/components/screens/CompetitionsScreen';
import RankingsScreen from '@/components/screens/RankingsScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen selectedAccount={selectedAccount} />;
      case 'competitions':
        return <CompetitionsScreen />;
      case 'rankings':
        return <RankingsScreen selectedAccount={selectedAccount} user={user} />;
      case 'profile':
        return <ProfileScreen user={user} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default:
        return <HomeScreen selectedAccount={selectedAccount} />;
    }
  };

  if (!isLoggedIn) {
    return <OnboardingScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <div className="max-w-md mx-auto bg-bg-primary text-text-primary min-h-screen font-sans relative overflow-hidden">
        <div className={`main-view-container ${isStocksViewActive ? 'exiting' : ''}`}>
          <Header 
            title={getHeaderTitle()} 
            selectedAccount={selectedAccount}
            user={user}
            onAccountSwitch={() => setIsAccountSwitcherOpen(true)}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            unreadCount={unreadNotifications}
          />
          <main className="px-4 pb-28 pt-20 overflow-y-auto h-full">
            <div key={currentScreen} className="animate-fadeIn">
              {renderScreen()}
            </div>
          </main>
          <BottomNavBar 
            currentScreen={currentScreen} 
            setCurrentScreen={handleSetCurrentScreen} 
          />
        </div>
        
        <div className={`stocks-view-container ${isStocksViewActive ? 'active' : ''}`}>
          <StocksContainerScreen onExit={handleExitStocks} />
        </div>

        <AccountSwitcher
          isOpen={isAccountSwitcherOpen}
          onClose={() => setIsAccountSwitcherOpen(false)}
          accounts={MOCK_ACCOUNTS}
          selectedAccount={selectedAccount}
          onSelect={handleSelectAccount}
        />

        {/* 알림 모달 with improved animations */}
        {isNotificationsOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="h-full flex flex-col bg-bg-primary animate-slideInRight">
              <div className="flex items-center justify-between p-4 border-b border-border-color bg-bg-primary shadow-lg">
                <h2 className="text-xl font-bold text-text-primary">알림</h2>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 hover:bg-bg-secondary rounded-full transition-all duration-300 hover:rotate-90 active:scale-95"
                >
                  <span className="text-2xl leading-none text-text-primary">×</span>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <NotificationsScreen />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Analytics />
    </>
  );
}
