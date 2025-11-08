"use client";
import React, { useState, useEffect } from "react";
import { LeaderboardEntry, Achievement } from "@/lib/types/stock";
import * as Icons from "./icons/Icons";
import { MOCK_ACHIEVEMENTS } from "@/lib/constants";
import { Drawer } from "vaul";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LeaderboardEntry | null;
}

const iconMap: { [key: string]: React.FC<any> } = {
  BriefcaseIcon: Icons.BriefcaseIcon,
  ArrowTrendingUpIcon: Icons.ArrowTrendingUpIcon,
  ChartPieIcon: Icons.ChartPieIcon,
  BanknotesIcon: Icons.BanknotesIcon,
  TrophyIcon: Icons.TrophyIcon,
  UsersIcon: Icons.UsersIcon,
};

const MiniAchievement: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const Icon = iconMap[achievement.icon] || Icons.TrophyIcon;
  return (
    <div className="flex flex-col items-center text-center w-20">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-accent/20 text-accent">
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-xs mt-2 font-semibold text-text-primary truncate">
        {achievement.name}
      </p>
    </div>
  );
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [isRival, setIsRival] = useState(user?.isRival || false);
  const userAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.unlocked).slice(
    0,
    3
  );

  useEffect(() => {
    if (user) {
      setIsRival(user.isRival || false);
    }
  }, [user]);

  // Vaul Drawer는 open 상태만 관리하면 되므로 user가 없으면 Drawer를 닫음
  if (!isOpen || !user) return <></>;

  const handleToggleRival = () => {
    setIsRival(!isRival);
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-70 w-full max-w-md mx-auto bg-bg-secondary rounded-t-2xl p-4 shadow-2xl"
          style={{ touchAction: "none" }}
        >
          <div className="w-12 h-1.5 bg-border-color rounded-full mx-auto mb-4"></div>
          <Drawer.Close asChild>
            <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-border-color">
              <Icons.XMarkIcon className="w-6 h-6 text-text-secondary" />
            </button>
          </Drawer.Close>
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-full mb-3 border-4 border-bg-primary shadow-lg"
            />
            <Drawer.Title className="text-xl font-bold text-text-primary">
              {user.username}
            </Drawer.Title>
            <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
              <span>
                랭킹:{" "}
                <span className="font-bold text-text-primary">
                  {user.rank}위
                </span>
              </span>
              <span>
                수익률:{" "}
                <span className="font-bold text-positive">
                  {user.returnRate.toFixed(1)}%
                </span>
              </span>
            </div>
          </div>
          <div className="my-6">
            <h3 className="text-sm font-bold text-text-secondary text-center mb-3">
              대표 업적
            </h3>
            <div className="flex justify-center gap-4">
              {userAchievements.map((ach) => (
                <MiniAchievement key={ach.id} achievement={ach} />
              ))}
            </div>
          </div>
          <button
            onClick={handleToggleRival}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-colors ${
              isRival
                ? "bg-secondary hover:bg-secondary/90"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isRival ? (
              <Icons.UsersIcon className="w-5 h-5" />
            ) : (
              <Icons.UserPlusIcon className="w-5 h-5" />
            )}
            {isRival ? "라이벌" : "라이벌 추가"}
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default UserProfileModal;
