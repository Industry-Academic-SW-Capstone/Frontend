"use client";

import React from "react";
import { CheckCircleIcon, XMarkIcon } from "./icons/Icons";
import { Drawer } from "vaul";
import { useAccountStore } from "@/lib/store/useAccountStore";

import { useHaptic } from "@/lib/hooks/useHaptic"; // Import useHaptic

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  isOpen,
  onClose,
}) => {
  const { accounts, selectedAccount, setSelectedAccount } = useAccountStore();
  const { hapticSelection } = useHaptic(); // Initialize hook

  if (!selectedAccount) return null;

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
          className="fixed bottom-0 pb-safe left-0 right-0 z-70 w-full max-w-md mx-auto bg-bg-secondary rounded-t-2xl p-4 shadow-2xl"
          style={{ touchAction: "none" }}
        >
          <div className="flex justify-between items-center mb-4">
            <Drawer.Title className="text-lg font-bold text-text-primary">
              계좌 전환
            </Drawer.Title>
            <Drawer.Close asChild>
              <button className="p-2 rounded-full hover:bg-border-color">
                <XMarkIcon className="w-6 h-6 text-text-secondary" />
              </button>
            </Drawer.Close>
          </div>
          <div className="space-y-2">
            {[...accounts]
              .sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0))
              .map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    hapticSelection(); // Haptic on selection
                    setSelectedAccount(account);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-colors ${
                    selectedAccount.id === account.id
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-border-color"
                  }`}
                >
                  <div>
                    <p
                      className={`font-semibold ${
                        selectedAccount.id === account.id
                          ? "text-primary"
                          : "text-text-primary"
                      }`}
                    >
                      {account.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {account.totalValue.toLocaleString()}원
                    </p>
                  </div>
                  {selectedAccount.id === account.id && (
                    <CheckCircleIcon className="w-6 h-6 text-primary" />
                  )}
                </button>
              ))}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AccountSwitcher;
