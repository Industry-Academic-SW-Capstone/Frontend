import { create } from "zustand";

interface CompetitionEntryState {
  pendingCompetitionId: number | null;
  pendingPassword?: string;
  pendingContestName?: string;
  setPendingEntry: (
    contestId: number,
    password?: string,
    contestName?: string
  ) => void;
  clearPendingEntry: () => void;
}

export const useCompetitionEntryStore = create<CompetitionEntryState>(
  (set) => ({
    pendingCompetitionId: null,
    pendingPassword: undefined,
    pendingContestName: undefined,
    setPendingEntry: (contestId, password, contestName) =>
      set({
        pendingCompetitionId: contestId,
        pendingPassword: password,
        pendingContestName: contestName,
      }),
    clearPendingEntry: () =>
      set({
        pendingCompetitionId: null,
        pendingPassword: undefined,
        pendingContestName: undefined,
      }),
  })
);
