"use client";

import React from 'react';
import { Account } from '@/lib/types';
import { CheckCircleIcon, XMarkIcon } from './icons/Icons';
import { Drawer } from 'vaul';

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccount: Account;
  onSelect: (account: Account) => void;
}


const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ isOpen, onClose, accounts, selectedAccount, onSelect }) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Drawer.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
      <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-md mx-auto bg-bg-secondary rounded-t-2xl p-4 shadow-2xl" style={{ touchAction: 'none' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">계좌 전환</h2>
          <Drawer.Close asChild>
            <button className="p-2 rounded-full hover:bg-border-color">
              <XMarkIcon className="w-6 h-6 text-text-secondary" />
            </button>
          </Drawer.Close>
        </div>
        <div className="space-y-2">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => { onSelect(account); onClose(); }}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-colors ${
                selectedAccount.id === account.id 
                ? 'bg-primary/10 border border-primary' 
                : 'hover:bg-border-color'
              }`}
            >
              <div>
                <p className={`font-semibold ${selectedAccount.id === account.id ? 'text-primary' : 'text-text-primary'}`}>{account.name}</p>
                <p className="text-sm text-text-secondary">{account.totalValue.toLocaleString()}원</p>
              </div>
              {selectedAccount.id === account.id && <CheckCircleIcon className="w-6 h-6 text-primary" />}
            </button>
          ))}
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default AccountSwitcher;
