"use client";
import React from "react";
import { Account, User } from "@/lib/types/stock";
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
    <header className="fixed top-0 pt-safe left-0 right-0 z-20 max-w-md mx-auto bg-bg-primary/80 backdrop-blur-lg">
      <div className="flex items-center justify-between p-4 h-16 pb-2">
        <div className="flex items-center gap-2">
          {user.group && (
            <div className="flex items-center gap-1 text-xs bg-bg-secondary px-2 py-1 rounded-full text-text-secondary font-semibold">
              <BuildingOffice2Icon className="w-4 h-4" />
              <span>{user.group.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ">
          {/* 알림 버튼 */}
          {onNotificationClick && (
            <button
              id="header-notification"
              onClick={onNotificationClick}
              className="relative p-1 active-transition rounded-full transition-colors"
            >
              <BellIcon className="w-6 h-6 text-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-1 bg-positive text-white text-xs font-bold rounded-full w-2 h-2 flex items-center justify-center"></span>
              )}
            </button>
          )}

          {/* 계좌 전환 버튼 */}
          <button
            id="header-account-switcher"
            onClick={onAccountSwitch}
            className="flex items-center gap-1 bg-bg-secondary px-3 py-1.5 rounded-full text-sm text-text-secondary active:text-text-primary font-semibold hover:bg-border-color transition-colors"
          >
            <span className="max-w-[100px] truncate">
              {selectedAccount.isDefault ? "기본 계좌" : selectedAccount.name}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
