"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_ACHIEVEMENTS } from "@/lib/constants";
import { Achievement, User } from "@/lib/types/stock";
import * as Icons from "@/components/icons/Icons";
import TwoFactorSettings from "@/components/settings/TwoFactorSettings";
import { useLogout } from "@/lib/hooks/auth/useLogout";
import { useFetchInfo, usePutInfo } from "@/lib/hooks/me/useInfo";
import Toast, { ToastType } from "@/components/ui/Toast";

interface ProfileScreenProps {
  user: User; // Fallback or initial data
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const iconMap: { [key: string]: React.FC<any> } = {
  BriefcaseIcon: Icons.BriefcaseIcon,
  ArrowTrendingUpIcon: Icons.ArrowTrendingUpIcon,
  ChartPieIcon: Icons.ChartPieIcon,
  BanknotesIcon: Icons.BanknotesIcon,
  TrophyIcon: Icons.TrophyIcon,
  UsersIcon: Icons.UsersIcon,
};

const AVATAR_PRESETS = Array.from(
  { length: 6 },
  (_, i) => `https://picsum.photos/seed/avatar${i + 1}/100`
);

const AchievementItem: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const Icon = iconMap[achievement.icon] || Icons.TrophyIcon;
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 card-hover overflow-hidden relative group ${
        achievement.unlocked
          ? "bg-gradient-to-br from-bg-primary to-bg-secondary border border-accent/20 shadow-sm"
          : "bg-bg-primary/50 opacity-60 grayscale"
      }`}
    >
      {/* Shimmer effect for unlocked achievements */}
      {achievement.unlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />
      )}

      <div
        className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative z-10 ${
          achievement.unlocked
            ? "bg-accent/10 text-accent shadow-inner"
            : "bg-border-color/50 text-text-secondary"
        }`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1 relative z-10">
        <p
          className={`font-bold text-text-primary mb-1 transition-colors duration-300 ${
            achievement.unlocked ? "group-hover:text-accent" : ""
          }`}
        >
          {achievement.name}
        </p>
        <p className="text-xs text-text-secondary leading-relaxed">
          {achievement.description}
        </p>
      </div>

      {/* Corner accent for unlocked */}
      {achievement.unlocked && (
        <div className="absolute top-0 right-0 w-8 h-8 bg-accent/10 rounded-bl-2xl -mr-4 -mt-4 transition-all duration-300 group-hover:w-12 group-hover:h-12" />
      )}
    </div>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user: initialUser,
  isDarkMode,
  setIsDarkMode,
}) => {
  const router = useRouter();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const {
    data: fetchedUser,
    isLoading: isLoadingUser,
    refetch,
  } = useFetchInfo();
  const { mutate: updateInfo, isPending: isUpdating } = usePutInfo();

  const user = fetchedUser
    ? {
        ...initialUser,
        username: fetchedUser.name,
        avatar: fetchedUser.profileImage,
        // Map other fields if necessary, or use initialUser as fallback for missing fields in API response
      }
    : initialUser;

  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullCurrentY, setPullCurrentY] = useState(0);
  const PULL_THRESHOLD = 80; // Threshold to trigger refresh

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (fetchedUser) {
      setEditName(fetchedUser.name);
      setEditAvatar(fetchedUser.profileImage);
    }
  }, [fetchedUser]);

  // Pull to Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    if (pullStartY > 0 && currentY > pullStartY && window.scrollY === 0) {
      setPullCurrentY(currentY - pullStartY);
    }
  };

  const handleTouchEnd = async () => {
    if (pullCurrentY > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await refetch();
        showToast("프로필 정보가 업데이트되었습니다.", "success");
      } catch (error) {
        showToast("정보 업데이트에 실패했습니다.", "error");
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullCurrentY(0);
  };

  const visibleAchievements = showAllAchievements
    ? MOCK_ACHIEVEMENTS
    : MOCK_ACHIEVEMENTS.slice(0, 3);

  const handleAccordion = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleLogout = async () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      await logout();
      router.push("/"); // Redirect to landing page
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInfo(
      { name: editName, profileImage: editAvatar },
      {
        onSuccess: () => {
          setIsEditingProfile(false);
          showToast("프로필이 수정되었습니다.", "success");
          refetch(); // Refresh user data
        },
        onError: () => {
          showToast("프로필 수정에 실패했습니다.", "error");
        },
      }
    );
  };

  return (
    <div
      className="pt-4 space-y-6 pb-24 min-h-screen relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 w-full flex justify-center pointer-events-none transition-all duration-300 ease-out"
        style={{
          transform: `translateY(${
            pullCurrentY > 0 ? Math.min(pullCurrentY / 2, 60) : 0
          }px)`,
          opacity:
            pullCurrentY > 0 ? Math.min(pullCurrentY / PULL_THRESHOLD, 1) : 0,
        }}
      >
        <div
          className={`p-2 rounded-full bg-bg-secondary shadow-md border border-border-color flex items-center justify-center ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <Icons.ArrowPathIcon
            className={`w-6 h-6 text-accent ${
              pullCurrentY > PULL_THRESHOLD
                ? "rotate-180 transition-transform duration-300"
                : ""
            }`}
          />
        </div>
      </div>

      {/* Profile Card - Simplified Design */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-border-color/50">
        <div className="relative inline-block mb-5">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-bg-primary shadow-xl object-cover"
          />
          <button
            onClick={() => setIsEditingProfile(true)}
            className="absolute bottom-0 right-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent-hover transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Icons.PencilIcon className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight">
          {user.username}
        </h2>

        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
          <div className="px-4 py-1.5 bg-accent/10 text-accent text-sm font-bold rounded-full">
            {user.title}
          </div>
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-bg-primary border border-border-color rounded-full text-sm font-medium text-text-secondary">
            <Icons.BuildingOffice2Icon className="w-4 h-4" />
            <span>{user.group.name}</span>
          </div>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden border border-border-color/50">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "account" ? "bg-bg-primary/50" : ""
          } hover:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("account")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Icons.UserIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">계정 정보</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
              openSection === "account" ? "rotate-90" : ""
            }`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openSection === "account"
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-2 space-y-1">
            <div className="p-4 flex items-center justify-between hover:bg-bg-primary/30 rounded-xl transition-colors mx-2">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-bg-primary rounded-lg text-text-secondary">
                  <Icons.EnvelopeIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-medium mb-0.5">
                    이메일
                  </p>
                  <p className="text-text-primary font-semibold">
                    {fetchedUser?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone number removed as requested */}

            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 rounded-xl transition-colors mx-2 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Icons.PencilSquareIcon className="w-5 h-5" />
                </div>
                <span className="text-text-primary font-semibold group-hover:text-accent transition-colors">
                  프로필 수정
                </span>
              </div>
              <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Social Login Section - Commented out as requested */}
      {/*
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden border border-border-color/50">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "social" ? "bg-bg-primary/50" : ""
          } hover:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("social")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <Icons.LinkIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">연동된 계정</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
              openSection === "social" ? "rotate-90" : ""
            }`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openSection === "social"
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-4 bg-bg-primary/30 rounded-2xl border border-border-color/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-text-primary font-bold">Google</p>
                  <p className="text-xs text-positive font-medium">연동됨</p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-bg-primary text-text-disabled text-xs font-bold rounded-full border border-border-color cursor-not-allowed"
              >
                해제 불가
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-bg-primary/30 rounded-2xl border border-border-color/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-primary font-bold">Apple</p>
                  <p className="text-xs text-text-disabled font-medium">
                    미연동
                  </p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-bg-primary text-text-disabled text-xs font-bold rounded-full border border-border-color cursor-not-allowed"
              >
                연동하기
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-bg-primary/30 rounded-2xl border border-border-color/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FEE500] rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.794 1.932 5.238 4.805 6.63-.197.713-.644 2.43-.734 2.824-.11.483.177.477.373.346.157-.105 2.423-1.642 3.47-2.35.66.093 1.338.142 2.028.142 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-primary font-bold">카카오</p>
                  <p className="text-xs text-text-disabled font-medium">
                    미연동
                  </p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-bg-primary text-text-disabled text-xs font-bold rounded-full border border-border-color cursor-not-allowed"
              >
                연동하기
              </button>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Achievements Section */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden border border-border-color/50">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "achievements" ? "bg-bg-primary/50" : ""
          } hover:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("achievements")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <Icons.TrophyIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">업적</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
              openSection === "achievements" ? "rotate-90" : ""
            }`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openSection === "achievements"
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {visibleAchievements.map((ach, index) => (
                <div
                  key={ach.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AchievementItem achievement={ach} />
                </div>
              ))}
            </div>

            {MOCK_ACHIEVEMENTS.length > 3 && (
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className="w-full py-3 mt-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {showAllAchievements ? (
                  <>
                    <span>접기</span>
                    <Icons.ChevronUpIcon className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>전체 보기 ({MOCK_ACHIEVEMENTS.length})</span>
                    <Icons.ChevronDownIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden border border-border-color/50">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "settings" ? "bg-bg-primary/50" : ""
          } hover:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("settings")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-500/10 rounded-2xl text-gray-500">
              <Icons.Cog6ToothIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-text-primary">설정</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
              openSection === "settings" ? "rotate-90" : ""
            }`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openSection === "settings"
              ? "max-h-[1200px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-2 space-y-1">
            {/* Dark Mode */}
            <div className="p-4 flex justify-between items-center hover:bg-bg-primary/30 rounded-xl transition-colors mx-2">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-bg-primary rounded-lg text-text-secondary">
                  {isDarkMode ? (
                    <Icons.MoonIcon className="w-5 h-5" />
                  ) : (
                    <Icons.SunIcon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-text-primary font-semibold">
                  다크 모드
                </span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-300 focus:outline-none ${
                  isDarkMode ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-md ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 rounded-xl transition-colors mx-2 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-bg-primary rounded-lg text-text-secondary group-hover:text-primary transition-colors">
                  <Icons.BellIcon className="w-5 h-5" />
                </div>
                <span className="text-text-primary font-semibold">
                  알림 설정
                </span>
              </div>
              <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Privacy - Commented out */}
            {/*
            <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 rounded-xl transition-colors mx-2 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-bg-primary rounded-lg text-text-secondary group-hover:text-primary transition-colors">
                  <Icons.LockClosedIcon className="w-5 h-5" />
                </div>
                <span className="text-text-primary font-semibold">
                  개인정보 보호
                </span>
              </div>
              <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </button>
            */}

            <div className="mx-2">
              <TwoFactorSettings />
            </div>

            {/* Support - Commented out */}
            {/*
            <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 rounded-xl transition-colors mx-2 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-bg-primary rounded-lg text-text-secondary group-hover:text-primary transition-colors">
                  <Icons.QuestionMarkCircleIcon className="w-5 h-5" />
                </div>
                <span className="text-text-primary font-semibold">
                  고객 지원
                </span>
              </div>
              <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </button>
            */}

            <div className="my-2 border-t border-border-color/50 mx-4" />

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full p-4 flex items-center justify-between hover:bg-negative/10 rounded-xl transition-colors mx-2 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-negative/10 rounded-lg text-negative group-hover:bg-negative group-hover:text-white transition-colors">
                  <Icons.ArrowRightOnRectangleIcon className="w-5 h-5" />
                </div>
                <span className="text-negative font-semibold">
                  {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bg-secondary w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-border-color flex justify-between items-center">
              <h3 className="text-xl font-bold text-text-primary">
                프로필 수정
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-2 hover:bg-bg-primary rounded-full transition-colors"
              >
                <Icons.XMarkIcon className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <img
                    src={editAvatar}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-bg-primary shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.CameraIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="text-sm text-accent font-medium cursor-pointer hover:underline"
                >
                  사진 변경
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">
                  닉네임
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-4 bg-bg-primary rounded-xl border border-border-color focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all font-semibold text-text-primary"
                  placeholder="닉네임을 입력하세요"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-text-secondary bg-bg-primary hover:bg-border-color transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-accent hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bg-secondary w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scaleIn p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-primary">
                프로필 사진 선택
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-2 hover:bg-bg-primary rounded-full transition-colors"
              >
                <Icons.XMarkIcon className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Presets */}
              <div>
                <p className="text-sm font-bold text-text-secondary mb-3">
                  기본 이미지
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {AVATAR_PRESETS.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setEditAvatar(url);
                        setIsAvatarModalOpen(false);
                      }}
                      className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all ${
                        editAvatar === url
                          ? "border-accent scale-105"
                          : "border-transparent hover:border-accent/50"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {editAvatar === url && (
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <Icons.CheckCircleIcon className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom URL */}
              <div>
                <p className="text-sm font-bold text-text-secondary mb-3">
                  이미지 URL
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 p-3 bg-bg-primary rounded-xl border border-border-color focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  />
                  <button
                    onClick={() => {
                      if (customAvatarUrl) {
                        setEditAvatar(customAvatarUrl);
                        setIsAvatarModalOpen(false);
                      }
                    }}
                    disabled={!customAvatarUrl}
                    className="px-4 py-2 bg-accent text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
                  >
                    적용
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
