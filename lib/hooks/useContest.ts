import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/api/axiosClient";
import { Competition, CreateCompetitionRequest } from "@/lib/types/stock";

const fetchContests = async (): Promise<Competition[]> => {
  const response = await axiosClient.get("/api/contests");
  return response.data;
};

const createContest = async (data: CreateCompetitionRequest): Promise<void> => {
  await axiosClient.post("/api/contests", data);
};

export const useContests = () => {
  return useQuery({
    queryKey: ["contests"],
    queryFn: fetchContests,
  });
};

export const useCreateContest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
    },
  });
};
