import { create } from "zustand";

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  activeTutorial: "home" | "stocks" | "stock-detail" | null;

  // Actions
  startHomeTutorial: () => void;
  startStocksTutorial: () => void;
  startStockDetailTutorial: () => void;
  endTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  isActive: false,
  currentStep: 0,
  activeTutorial: null,

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
    set({
      isActive: false,
      currentStep: 0,
      activeTutorial: null,
    });
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  setStep: (step) => set({ currentStep: step }),

  resetTutorial: () =>
    set({
      isActive: false,
      currentStep: 0,
      activeTutorial: null,
    }),
}));
