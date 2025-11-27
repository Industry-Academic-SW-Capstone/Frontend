"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_ACHIEVEMENTS } from "@/lib/constants";
import { Achievement, Screen, User } from "@/lib/types/stock";
import * as Icons from "@/components/icons/Icons";
import TwoFactorSettings from "@/components/settings/TwoFactorSettings";
import { useLogout } from "@/lib/hooks/auth/useLogout";
import { useFetchInfo, usePutInfo } from "@/lib/hooks/me/useInfo";
import Toast, { ToastType } from "@/components/ui/Toast";
import {
  isTokenRegistered,
  requestNotificationPermission,
  deleteFCMToken,
} from "@/lib/services/notificationService";
import { useAvatar } from "@/lib/utils/useAvatar";
import TierBadge from "@/components/ui/TierBadge";
import { use2FA } from "@/lib/hooks/auth/use2FA";
import { useTierInfo } from "@/lib/hooks/missions/useTierInfo";
import { parseTier, calculateNextTierTarget } from "@/lib/utils/tierUtils";
import TierSystemGuide from "@/components/ranking/TierSystemGuide";

interface ProfileScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const iconMap: { [key: string]: React.FC<any> } = {
  BriefcaseIcon: Icons.BriefcaseIcon,
  ArrowTrendingUpIcon: Icons.ArrowTrendingUpIcon,
  ChartPieIcon: Icons.ChartPieIcon,
  BanknotesIcon: Icons.BanknotesIcon,
  TrophyIcon: Icons.TrophyIcon,
  UsersIcon: Icons.UsersIcon,
};

const avatarPresets = useAvatar();

const AchievementItem: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const Icon = iconMap[achievement.icon] || Icons.TrophyIcon;
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 card-hover overflow-hidden relative group ${
        achievement.unlocked
          ? "bg-linear-to-br from-bg-primary to-bg-secondary border border-accent/20 shadow-sm"
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
  onNavigate,
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

  // Fetch Tier Info
  const { data: tierData, isLoading: isTierLoading } = useTierInfo();

  // Parse Tier Data
  const currentTier = tierData ? parseTier(tierData.currentTier) : "Bronze";
  const nextTierTarget = tierData
    ? calculateNextTierTarget(tierData.totalScore, tierData.scoreToNextTier)
    : 1000;
  const progressPercent = tierData ? tierData.progressPercentage : 0;

  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  // Notification State
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  useEffect(() => {
    setIsPushEnabled(isTokenRegistered());
  }, []);

  const handleTogglePush = async () => {
    if (isPushEnabled) {
      if (confirm("푸시 알림을 끄시겠습니까?")) {
        await deleteFCMToken();
        setIsPushEnabled(false);
        showToast("알림이 해제되었습니다.");
      }
    } else {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        setIsPushEnabled(true);
        showToast("알림이 설정되었습니다.");
      } else {
        showToast("알림 권한이 차단되어 있습니다.", "error");
      }
    }
  };

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
    // Ignore events from Portals (like Drawer)
    if (!e.currentTarget.contains(e.target as Node)) return;

    const scrollContainer = e.currentTarget.closest(".overflow-y-auto");
    if (scrollContainer && scrollContainer.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    } else if (!scrollContainer && window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    if (pullStartY > 0 && currentY > pullStartY) {
      // Prevent default only if we are pulling down to refresh?
      // No, we shouldn't prevent default indiscriminately.
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
        console.error("Refresh failed", error);
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
  const { reset2FA } = use2FA();
  const handleLogout = async () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      reset2FA();
      await logout();
      router.push("/pwa"); // Redirect to landing page
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

  const handleResetTutorial = () => {
    if (confirm("튜토리얼을 초기화하시겠습니까?")) {
      updateInfo(
        {
          mainTutorialCompleted: false,
          securitiesDepthTutorialCompleted: false,
          stockDetailTutorialCompleted: false,
        },
        {
          onSuccess: () => {
            showToast(
              "튜토리얼이 초기화되었습니다. 홈 화면으로 이동합니다.",
              "success"
            );
            onNavigate("home" as unknown as Screen);
            // Optionally refresh user info to ensure UI updates immediately
            refetch();
          },
          onError: () => {
            showToast("튜토리얼 초기화에 실패했습니다.", "error");
          },
        }
      );
    }
  };

  return (
    <div
      className="pt-4 space-y-6 pb-24 min-h-screen-safe relative"
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
        className="absolute top-0 left-0 w-full flex justify-center pointer-events-none transition-all duration-300 ease-out z-10"
        style={{
          transform: `translateY(${
            pullCurrentY > 0 ? Math.min(pullCurrentY / 2, 60) : 0
          }px)`,
          opacity:
            pullCurrentY > 0 ? Math.min(pullCurrentY / PULL_THRESHOLD, 1) : 0,
        }}
      >
        <div
          className={`p-2 rounded-full z-50 bg-bg-secondary shadow-md border border-border-color flex items-center justify-center ${
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
      <div className="bg-bg-secondary rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-border-color">
        <div className="relative inline-block mb-5">
          <img
            src={
              user.avatar ? user.avatar : "/image/avatar/small/avatar_bear.png"
            }
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-bg-primary shadow-sm object-cover"
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

        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap relative">
          {isTierLoading ? (
            <div className="h-6 w-20 bg-bg-third animate-pulse rounded-full" />
          ) : (
            <TierBadge tier={currentTier} />
          )}
          <div className="px-4 py-1.5 bg-accent/10 text-accent text-sm font-bold rounded-full">
            {user.title}
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="w-full mt-6 px-4">
          {isTierLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-bg-third animate-pulse rounded w-full" />
              <div className="h-3 bg-bg-third animate-pulse rounded-full w-full" />
            </div>
          ) : tierData ? (
            <>
              <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
                <span className="p-1">{tierData.totalScore} RP</span>
                <div className="flex gap-2 items-center">
                  <span>Next: {nextTierTarget} RP</span>
                  <TierSystemGuide>
                    <button className="p-1 text-text-secondary hover:text-accent transition-colors">
                      <Icons.InformationCircleIcon className="w-5 h-5" />
                    </button>
                  </TierSystemGuide>
                </div>
              </div>
              <div className="w-full h-3 bg-bg-third rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-2">
                활동 점수 {tierData.activityScore} + 실력 점수{" "}
                {tierData.skillScore}
              </p>
            </>
          ) : (
            <p className="text-sm text-text-secondary">
              티어 정보를 불러올 수 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* Promotion Status Card - Hidden for now as API doesn't support it yet */}
      {/* <PromotionStatusCard tierInfo={tierInfo} /> */}

      {/* Grouped Sections */}
      <div className=" bg-bg-secondary rounded-3xl shadow-sm border border-border-color overflow-hidden divide-y divide-border-color">
        {/* Account Info Section */}
        <div>
          <button
            className={`w-full flex items-center justify-between p-6 hover:bg-bg-third transition-colors`}
            onClick={() => handleAccordion("account")}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-bg-third rounded-xl text-text-secondary">
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
            <div className="p-2 space-y-1 bg-bg-third/50">
              <div className="p-4 flex items-center justify-between hover:bg-bg-third rounded-xl transition-colors mx-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-secondary rounded-lg text-text-secondary shadow-sm">
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

              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full p-4 flex items-center justify-between hover:bg-bg-third rounded-xl transition-colors mx-2 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-secondary rounded-lg text-text-secondary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                    <Icons.PencilSquareIcon className="w-5 h-5" />
                  </div>
                  <span className="text-text-primary font-semibold group-hover:text-primary transition-colors">
                    프로필 수정
                  </span>
                </div>
                <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <button
            className={`w-full flex items-center justify-between p-6 hover:bg-bg-third transition-colors`}
            onClick={() => handleAccordion("settings")}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-bg-third rounded-xl text-text-secondary">
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
            <div className="p-2 space-y-1 bg-bg-third/50">
              {/* Notifications */}
              <div className="p-4 flex justify-between items-center hover:bg-bg-third rounded-xl transition-colors mx-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-secondary rounded-lg text-text-secondary shadow-sm">
                    <Icons.BellIcon className="w-5 h-5" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    알림 설정
                  </span>
                </div>
                <button
                  onClick={handleTogglePush}
                  className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-300 focus:outline-none ${
                    isPushEnabled
                      ? "bg-accent"
                      : "bg-border-color dark:bg-bg-third"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-md ${
                      isPushEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Tutorial Reset */}
              <div className="p-4 flex justify-between items-center hover:bg-bg-third rounded-xl transition-colors mx-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-secondary rounded-lg text-text-secondary shadow-sm">
                    <Icons.AcademicCapIcon className="w-5 h-5" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    튜토리얼 초기화
                  </span>
                </div>
                <button
                  onClick={handleResetTutorial}
                  className="px-4 py-2 bg-bg-secondary text-text-primary text-sm font-bold rounded-lg border border-border-color hover:bg-bg-primary transition-colors"
                >
                  초기화
                </button>
              </div>

              <div className="mx-2">
                <TwoFactorSettings />
              </div>

              {/* Bankruptcy Button */}
              <div className="p-4 flex justify-between items-center hover:bg-bg-third rounded-xl transition-colors mx-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-bg-secondary rounded-lg text-text-secondary shadow-sm">
                    <Icons.ExclamationTriangleIcon className="w-5 h-5 text-error" />
                  </div>
                  <span className="text-text-primary font-semibold">
                    파산 신청
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "정말 파산 신청을 하시겠습니까? 모든 자산과 티어가 초기화됩니다."
                      )
                    ) {
                      showToast(
                        "파산 신청이 완료되었습니다. (Mock)",
                        "success"
                      );
                    }
                  }}
                  className="px-4 py-2 bg-error/10 text-error text-sm font-bold rounded-lg hover:bg-error/20 transition-colors"
                >
                  신청하기
                </button>
              </div>

              <div className="my-2 border-t border-border-color/50 mx-4" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full p-4 flex items-center justify-between hover:bg-error/5 rounded-xl transition-colors mx-2 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-error/10 rounded-lg text-error group-hover:bg-error group-hover:text-white transition-colors shadow-sm">
                    <Icons.ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </div>
                  <span className="text-error font-semibold">
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </span>
                </div>
              </button>
            </div>
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

            <div className="space-y-6 ">
              {/* Presets */}
              <div>
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {avatarPresets.map((avatar) => (
                    <button
                      key={avatar.name}
                      onClick={() => {
                        setEditAvatar(avatar.src);
                        setIsAvatarModalOpen(false);
                      }}
                      className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all ${
                        editAvatar === avatar.src
                          ? "border-accent scale-105"
                          : "border-transparent hover:border-accent/50"
                      }`}
                    >
                      <img
                        src={avatar.src}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                      {editAvatar === avatar.src && (
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
