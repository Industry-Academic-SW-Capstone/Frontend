"use client";

import React from 'react';
import { Account } from '@/lib/types';
import { CheckCircleIcon, XMarkIcon } from './icons/Icons';

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccount: Account;
  onSelect: (account: Account) => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ isOpen, onClose, accounts, selectedAccount, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg-secondary/40" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-bg-secondary/80 backdrop-blur-xl rounded-t-2xl p-4 transform transition-transform duration-300 ease-in-out" 
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">계좌 전환</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-border-color">
            <XMarkIcon className="w-6 h-6 text-text-secondary" />
          </button>
        </div>
        <div className="space-y-2">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => onSelect(account)}
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
      </div>
    </div>
  );
};

export default AccountSwitcher;
