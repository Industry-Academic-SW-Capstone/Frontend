import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserTutorialProgress {
  hasSeenHomeTutorial: boolean;
  hasSeenStocksTutorial: boolean;
  hasSeenStockDetailTutorial: boolean;
}

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  activeTutorial: "home" | "stocks" | "stock-detail" | null;

  // User specific state
  currentUserId: number | null;
  userProgress: Record<number, UserTutorialProgress>;

  // Computed properties (for backward compatibility / ease of use)
  hasSeenHomeTutorial: boolean;
  hasSeenStocksTutorial: boolean;
  hasSeenStockDetailTutorial: boolean;

  // Actions
  setUserId: (userId: number | null) => void;
  startHomeTutorial: () => void;
  startStocksTutorial: () => void;
  startStockDetailTutorial: () => void;
  endTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      activeTutorial: null,
      currentUserId: null,
      userProgress: {},

      // Initial computed values (will be updated via setUserId)
      hasSeenHomeTutorial: false,
      hasSeenStocksTutorial: false,
      hasSeenStockDetailTutorial: false,

      setUserId: (userId) => {
        const state = get();
        // If userId is null, we might want to reset or keep default
        if (userId === null) {
          set({
            currentUserId: null,
            hasSeenHomeTutorial: false,
            hasSeenStocksTutorial: false,
            hasSeenStockDetailTutorial: false,
          });
          return;
        }

        const progress = state.userProgress[userId] || {
          hasSeenHomeTutorial: false,
          hasSeenStocksTutorial: false,
          hasSeenStockDetailTutorial: false,
        };

        set({
          currentUserId: userId,
          hasSeenHomeTutorial: progress.hasSeenHomeTutorial,
          hasSeenStocksTutorial: progress.hasSeenStocksTutorial,
          hasSeenStockDetailTutorial: progress.hasSeenStockDetailTutorial,
        });
      },

      startHomeTutorial: () =>
        set({
          isActive: true,
          currentStep: 0,
          activeTutorial: "home",
        }),

      startStocksTutorial: () =>
        set({
          isActive: true,
          currentStep: 0,
          activeTutorial: "stocks",
        }),

      startStockDetailTutorial: () =>
        set({
          isActive: true,
          currentStep: 0,
          activeTutorial: "stock-detail",
        }),

      endTutorial: () => {
        const { activeTutorial, currentUserId, userProgress } = get();

        if (currentUserId === null) {
          // Fallback for no user (shouldn't happen in logged-in app usually)
          set({ isActive: false, currentStep: 0, activeTutorial: null });
          return;
        }

        const currentProgress = userProgress[currentUserId] || {
          hasSeenHomeTutorial: false,
          hasSeenStocksTutorial: false,
          hasSeenStockDetailTutorial: false,
        };

        const newProgress = { ...currentProgress };

        if (activeTutorial === "home") newProgress.hasSeenHomeTutorial = true;
        if (activeTutorial === "stocks")
          newProgress.hasSeenStocksTutorial = true;
        if (activeTutorial === "stock-detail")
          newProgress.hasSeenStockDetailTutorial = true;

        set((state) => ({
          isActive: false,
          currentStep: 0,
          activeTutorial: null,
          userProgress: {
            ...state.userProgress,
            [currentUserId]: newProgress,
          },
          // Update computed values immediately
          hasSeenHomeTutorial: newProgress.hasSeenHomeTutorial,
          hasSeenStocksTutorial: newProgress.hasSeenStocksTutorial,
          hasSeenStockDetailTutorial: newProgress.hasSeenStockDetailTutorial,
        }));
      },

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      setStep: (step) => set({ currentStep: step }),

      resetTutorial: () => {
        const { currentUserId } = get();
        if (currentUserId === null) return;

        set((state) => ({
          isActive: false,
          currentStep: 0,
          activeTutorial: null,
          userProgress: {
            ...state.userProgress,
            [currentUserId]: {
              hasSeenHomeTutorial: false,
              hasSeenStocksTutorial: false,
              hasSeenStockDetailTutorial: false,
            },
          },
          hasSeenHomeTutorial: false,
          hasSeenStocksTutorial: false,
          hasSeenStockDetailTutorial: false,
        }));
      },
    }),
    {
      name: "tutorial-storage",
      partialize: (state) => ({
        userProgress: state.userProgress,
        currentUserId: state.currentUserId,
      }),
    }
  )
);
