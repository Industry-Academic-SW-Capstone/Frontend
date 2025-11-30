import { useQuery } from "@tanstack/react-query";

export interface InsightSnapshot {
  id: string;
  mode_type: string;
  payload: {
    layout: string[];
    widgets: Record<string, any>;
  };
  created_at: string;
}

export const useInsight = () => {
  return useQuery({
    queryKey: ["insight", "latest"],
    queryFn: async () => {
      const response = await fetch("/api/insight/latest");
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to fetch insight");
      }

      return json.data as InsightSnapshot | null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
