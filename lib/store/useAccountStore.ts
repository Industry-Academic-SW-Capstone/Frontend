import { create } from "zustand";
import { Account } from "@/lib/types/stock";

interface AccountStore {
  accounts: Account[];
  selectedAccount: Account | null;
  setAccounts: (accounts: Account[]) => void;
  setSelectedAccount: (account: Account) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: [],
  selectedAccount: null,
  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
}));
