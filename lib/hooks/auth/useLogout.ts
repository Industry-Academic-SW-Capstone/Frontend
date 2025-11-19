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
      const response = await fetch("/api/members/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Optional: Clear local storage or state if needed
      // localStorage.removeItem("accessToken");

      // Redirect to login or landing page if handled by the component or global state
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
