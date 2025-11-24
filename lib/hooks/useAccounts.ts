import { useQuery } from "@tanstack/react-query";
import defaultClient from "@/lib/api/axiosClient";
import { Account, AccountData } from "@/lib/types/stock";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { useEffect } from "react";

const fetchAccounts = async (): Promise<AccountData[]> => {
  const response = await defaultClient.get<AccountData[]>(
    "/api/members/me/accounts"
  );
  return response.data;
};

export const useAccounts = (options?: { enabled?: boolean }) => {
  const { setAccounts, setSelectedAccount, selectedAccount } =
    useAccountStore();

  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    console.log(query);
    if (query.data) {
      console.log(query.data);
      const mappedAccounts: Account[] = query.data.map((account) => ({
        id: account.accountId,
        memberId: account.memberId,
        contestId: account.contestId,
        name: account.accountName,
        type: account.isDefault ? "regular" : "competition",
        totalValue: account.availableCash + account.holdAmount,
        cashBalance: account.availableCash,
        change: 0, // Mock data as API doesn't provide this
        changePercent: 0, // Mock data as API doesn't provide this
        isDefault: account.isDefault,
        chartData: [], // Mock data
      }));

      setAccounts(mappedAccounts);

      // If no account is selected, select the default one
      if (!selectedAccount) {
        const defaultAccount = mappedAccounts.find((acc) => acc.isDefault);
        if (defaultAccount) {
          setSelectedAccount(defaultAccount);
        } else if (mappedAccounts.length > 0) {
          setSelectedAccount(mappedAccounts[0]);
        }
      }
    }
  }, [query.data, setAccounts, setSelectedAccount, selectedAccount]);

  return query;
};
