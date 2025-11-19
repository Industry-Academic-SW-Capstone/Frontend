import defaultClient from "@/lib/api/axiosClient";
import { clearAuthToken } from "@/lib/stores/useAuthStore";
import { useState } from "react";

interface UseLogoutResult {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useLogout = (): UseLogoutResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await defaultClient.post("/members/logout");
      // if (response.status !== 200) {
      //   throw new Error("Logout failed");
      // }

      clearAuthToken();
      window.location.href = "/";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};
