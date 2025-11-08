"use client";
import React, { useState } from "react";
import { MOCK_ACHIEVEMENTS } from "@/lib/constants";
import { Achievement, User } from "@/lib/types/stock";
import * as Icons from "@/components/icons/Icons";
import TwoFactorSettings from "@/components/settings/TwoFactorSettings";

interface ProfileScreenProps {
  user: User;
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

const AchievementItem: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const Icon = iconMap[achievement.icon] || Icons.TrophyIcon;
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 card-hover overflow-hidden relative group ${
        achievement.unlocked
          ? "bg-bg-primary border border-border-color"
          : "bg-bg-primary opacity-50 grayscale"
      }`}
    >
      {/* Shimmer effect for unlocked achievements */}
      {achievement.unlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
      )}

      <div
        className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative z-10 ${
          achievement.unlocked
            ? "bg-accent/20 text-accent shadow-lg"
            : "bg-border-color text-text-secondary"
        }`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1 relative z-10">
        <p
          className={`font-bold text-text-primary mb-0.5 transition-colors duration-300 ${
            achievement.unlocked ? "group-hover:text-accent" : ""
          }`}
        >
          {achievement.name}
        </p>
        <p className="text-sm text-text-secondary">{achievement.description}</p>
      </div>

      {/* Corner accent for unlocked */}
      {achievement.unlocked && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-accent/20 rounded-bl-full" />
      )}
    </div>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  isDarkMode,
  setIsDarkMode,
}) => {
  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const visibleAchievements = showAllAchievements
    ? MOCK_ACHIEVEMENTS
    : MOCK_ACHIEVEMENTS.slice(0, 3);

  const handleAccordion = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="pt-4 space-y-6">
      {/* Profile Card with gradient background */}
      <div className="bg-bg-secondary p-8 rounded-3xl shadow-lg flex flex-col items-center text-center card-hover overflow-hidden relative group animate-fadeInUp">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-float" />

        <div className="relative z-10 w-full">
          <div className="relative inline-block mb-4">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-4 border-white dark:border-bg-secondary shadow-2xl transition-all duration-300 group-hover:scale-110"
            />
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 active:scale-95">
              <Icons.PencilIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <h2 className="text-3xl font-extrabold text-text-primary mb-3">
            {user.username}
          </h2>

          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <div className="font-bold text-sm bg-accent text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              {user.title}
            </div>
            <div className="flex items-center gap-2 text-sm bg-bg-primary px-4 py-2 rounded-full text-text-secondary font-bold border border-border-color shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Icons.BuildingOffice2Icon className="w-4 h-4" />
              <span>{user.group.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Section (Accordion) */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden animate-fadeInUp">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "account" ? "pb-3" : "pb-6"
          } focus:outline-none active:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("account")}
          aria-expanded={openSection === "account"}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Icons.UserIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-text-primary">계정 정보</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${
              openSection === "account" ? "rotate-90" : ""
            }`}
          />
        </button>
        {openSection === "account" && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "account"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } bg-bg-secondary`}
            style={{ overflow: "hidden" }}
          >
            <div className="divide-y divide-border-color">
              {/* Email */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <Icons.EnvelopeIcon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-medium">
                      이메일
                    </p>
                    <p className="text-text-primary font-semibold">
                      user@example.com
                    </p>
                  </div>
                </div>
              </div>
              {/* Phone */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <Icons.PhoneIcon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-medium">
                      전화번호
                    </p>
                    <p className="text-text-primary font-semibold">
                      010-1234-5678
                    </p>
                  </div>
                </div>
              </div>
              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 transition-colors duration-200 active:bg-bg-primary"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icons.PencilSquareIcon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    프로필 수정
                  </span>
                </div>
                <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Social Login Section (Accordion) */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden animate-fadeInUp">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "social" ? "pb-3" : "pb-6"
          } focus:outline-none active:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("social")}
          aria-expanded={openSection === "social"}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-xl">
              <Icons.LinkIcon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-bold text-xl text-text-primary">연동된 계정</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${
              openSection === "social" ? "rotate-90" : ""
            }`}
          />
        </button>
        {openSection === "social" && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "social"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } bg-bg-secondary`}
            style={{ overflow: "hidden" }}
          >
            <div className="divide-y divide-border-color">
              {/* Google */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
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
                    <p className="text-text-primary font-semibold">Google</p>
                    <p className="text-sm text-positive font-medium">연동됨</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-negative/10 text-negative font-semibold rounded-full text-sm hover:bg-negative/20 transition-colors duration-200 active:scale-95">
                  연동 해제
                </button>
              </div>
              {/* Apple */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold">Apple</p>
                    <p className="text-sm text-text-secondary font-medium">
                      연동 안 됨
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm hover:bg-primary/20 transition-colors duration-200 active:scale-95">
                  연동하기
                </button>
              </div>
              {/* Kakao */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FEE500] rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
                      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.794 1.932 5.238 4.805 6.63-.197.713-.644 2.43-.734 2.824-.11.483.177.477.373.346.157-.105 2.423-1.642 3.47-2.35.66.093 1.338.142 2.028.142 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold">카카오</p>
                    <p className="text-sm text-text-secondary font-medium">
                      연동 안 됨
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm hover:bg-primary/20 transition-colors duration-200 active:scale-95">
                  연동하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievements Section (Accordion) */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden animate-fadeInUp">
        <button
          className={`w-full flex items-center justify-between ${
            openSection === "achievements" && "pb-3"
          } p-6 focus:outline-none active:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("achievements")}
          aria-expanded={openSection === "achievements"}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Icons.TrophyIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-text-primary">업적</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${
              openSection === "achievements" ? "rotate-90" : ""
            }`}
          />
        </button>
        {openSection === "achievements" && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "achievements"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } bg-bg-secondary`}
            style={{ overflow: "hidden" }}
          >
            <div className="p-4 space-y-3">
              {visibleAchievements.map((ach, index) => (
                <div
                  key={ach.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AchievementItem achievement={ach} />
                </div>
              ))}
              {MOCK_ACHIEVEMENTS.length > 3 && (
                <button
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                  className="text-sm font-bold text-primary hover:text-secondary transition-colors duration-300 px-3 py-1 rounded-full hover:bg-primary/10 active:scale-95"
                >
                  {showAllAchievements ? "간략히 ▲" : "전체 ▼"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Section (Accordion) */}
      <div className="bg-bg-secondary rounded-3xl shadow-lg overflow-hidden animate-fadeInUp">
        <button
          className={`w-full flex items-center justify-between p-6 ${
            openSection === "settings" && "pb-3"
          } focus:outline-none active:bg-bg-primary/30 transition-colors`}
          onClick={() => handleAccordion("settings")}
          aria-expanded={openSection === "settings"}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-text-secondary/10 rounded-xl">
              <Icons.Cog6ToothIcon className="w-6 h-6 text-text-secondary" />
            </div>
            <h3 className="font-bold text-xl text-text-primary">설정</h3>
          </div>
          <Icons.ChevronRightIcon
            className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${
              openSection === "settings" ? "rotate-90" : ""
            }`}
          />
        </button>
        {openSection === "settings" && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openSection === "settings"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            } bg-bg-secondary`}
            style={{ overflow: "hidden" }}
          >
            <div className="divide-y divide-border-color">
              {/* Dark Mode Toggle */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-text-secondary/5 rounded-lg">
                    {isDarkMode ? (
                      <Icons.MoonIcon className="w-5 h-5 text-text-secondary" />
                    ) : (
                      <Icons.SunIcon className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <span className="text-text-primary font-semibold">
                    다크 모드
                  </span>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex items-center h-8 rounded-full w-14 transition-all duration-300 shadow-inner ${
                    isDarkMode ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                      isDarkMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {/* Notifications */}
              <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 transition-colors duration-200 active:bg-bg-primary">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-text-secondary/5 rounded-lg">
                    <Icons.BellIcon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    알림 설정
                  </span>
                </div>
                <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary" />
              </button>
              {/* Privacy */}
              <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 transition-colors duration-200 active:bg-bg-primary">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-text-secondary/5 rounded-lg">
                    <Icons.LockClosedIcon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    개인정보 보호
                  </span>
                </div>
                <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary" />
              </button>
              {/* 2차 인증 */}
              <TwoFactorSettings />
              {/* Support */}
              <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 transition-colors duration-200 active:bg-bg-primary">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-text-secondary/5 rounded-lg">
                    <Icons.QuestionMarkCircleIcon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    고객 지원
                  </span>
                </div>
                <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary" />
              </button>
              {/* Logout */}
              <button className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 transition-colors duration-200 active:bg-bg-primary">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-negative/10 rounded-lg">
                    <Icons.ArrowRightOnRectangleIcon className="w-5 h-5 text-negative" />
                  </div>
                  <span className="text-negative font-semibold">로그아웃</span>
                </div>
                <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
