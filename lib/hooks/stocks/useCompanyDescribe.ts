import { useQuery } from "@tanstack/react-query";
import { CompanyDescription } from "@/lib/types/stock";
import defaultClient from "../../api/axiosClient";

async function fetchCompanyDescription(
  companyName: string
): Promise<CompanyDescription> {
  const res = await defaultClient.post(`/api/company/describe`, {
    company_name: companyName,
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch company description");
  }
  return res.data;
}

export function useCompanyDescribe(companyName: string) {
  const { data, isLoading, isError, refetch } = useQuery<CompanyDescription>({
    queryKey: ["companyDescribe", companyName],
    queryFn: () => fetchCompanyDescription(companyName),
    enabled: !!companyName,
    staleTime: 1000 * 60 * 60 * 3, // 3 hours (matching API cache TTL mentioned in prompt)
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
