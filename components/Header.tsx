"use client";
import React from "react";
import { Account, User } from "@/lib/types/types";
import { ChevronDownIcon, BuildingOffice2Icon, BellIcon } from "./icons/Icons";

interface HeaderProps {
  selectedAccount: Account;
  user: User;
  onAccountSwitch: () => void;
  onNotificationClick?: () => void;
  unreadCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  user,
  onAccountSwitch,
  onNotificationClick,
  unreadCount = 0,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 max-w-md mx-auto bg-bg-primary/80 backdrop-blur-lg border-b border-border-color">
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center gap-2">
          {user.group && (
            <div className="flex items-center gap-1 text-xs bg-bg-secondary px-2 py-1 rounded-full text-text-secondary font-semibold">
              <BuildingOffice2Icon className="w-4 h-4" />
              <span>{user.group.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 알림 버튼 */}
          {onNotificationClick && (
            <button
              onClick={onNotificationClick}
              className="relative p-2 hover:bg-bg-secondary rounded-full transition-colors"
            >
              <BellIcon className="w-6 h-6 text-text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-negative text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* 계좌 전환 버튼 */}
          <button
            onClick={onAccountSwitch}
            className="flex items-center gap-1 bg-bg-secondary px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-border-color transition-colors"
          >
            <span className="max-w-[100px] truncate">
              {selectedAccount.name}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
