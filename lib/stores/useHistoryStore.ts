import { create } from "zustand";

/**
 * 히스토리 관리 시스템: Depth(맥락)와 Step(화면 내 이동)의 이중 레이어 구조
 *
 * Depth: 완전히 새로운 화면이나 맥락으로의 진입 (예: 메인 -> 증권 -> 상세)
 * Step: 현재 Depth 안에서의 선형적 페이지 이동 (예: 홈 -> 랭킹 -> 프로필)
 */

export type DepthId = "main" | "stocks" | string; // string은 동적 detail depth용

export interface HistoryDepth {
  depthId: DepthId;
  stepHistory: number[]; // 이동 경로 기록 (예: [0, 1, 2])
}

export type HistoryStack = HistoryDepth[];

interface HistoryState {
  stack: HistoryStack;

  // Depth 관리
  pushDepth: (depthId: DepthId, initialStep: number) => void;
  popDepth: () => HistoryDepth | null;

  // Step 관리
  pushStep: (stepIndex: number) => void;
  popStep: () => number | null;

  // 조회
  getCurrentDepth: () => HistoryDepth | null;
  getCurrentStep: () => number | null;
  getStack: () => HistoryStack;

  // 초기화
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  stack: [],

  /**
   * 새로운 Depth를 스택에 추가
   * 동시에 브라우저 히스토리에도 빈 상태를 push하여 뒤로가기 방어권 획득
   */
  pushDepth: (depthId: DepthId, initialStep: number = 0) => {
    set((state) => {
      const newDepth: HistoryDepth = {
        depthId,
        stepHistory: [initialStep],
      };

      // 브라우저 히스토리에 빈 상태 추가
      if (typeof window !== "undefined") {
        window.history.pushState(
          { depthId, step: initialStep },
          "",
          window.location.pathname
        );
      }

      return {
        stack: [...state.stack, newDepth],
      };
    });
  },

  /**
   * 현재 Depth를 스택에서 제거하고 반환
   * 주의: 브라우저 히스토리는 popstate에서 자동으로 처리되므로 여기서는 건드리지 않음
   */
  popDepth: () => {
    const currentDepth = get().getCurrentDepth();

    set((state) => {
      if (state.stack.length === 0) return state;

      const newStack = state.stack.slice(0, -1);
      return { stack: newStack };
    });

    return currentDepth;
  },

  /**
   * 현재 Depth의 stepHistory에 새 인덱스 추가
   * 동시에 브라우저 히스토리에도 빈 상태를 push
   */
  pushStep: (stepIndex: number) => {
    set((state) => {
      if (state.stack.length === 0) {
        console.warn("pushStep: No depth in stack");
        return state;
      }

      const newStack = [...state.stack];
      const currentDepth = newStack[newStack.length - 1];

      // 중복 push 방지: 같은 step을 연속으로 push하지 않음
      const lastStep =
        currentDepth.stepHistory[currentDepth.stepHistory.length - 1];
      if (lastStep === stepIndex) {
        return state;
      }

      // stepHistory에 새 인덱스 추가
      currentDepth.stepHistory = [...currentDepth.stepHistory, stepIndex];

      // 브라우저 히스토리에 빈 상태 추가
      if (typeof window !== "undefined") {
        window.history.pushState(
          { depthId: currentDepth.depthId, step: stepIndex },
          "",
          window.location.pathname
        );
      }

      return { stack: newStack };
    });
  },

  /**
   * 현재 Depth의 마지막 step을 제거하고 반환
   * 주의: 브라우저 히스토리는 popstate에서 자동으로 처리되므로 여기서는 건드리지 않음
   */
  popStep: () => {
    const state = get();

    if (state.stack.length === 0) {
      return null;
    }

    const currentDepth = state.stack[state.stack.length - 1];

    if (currentDepth.stepHistory.length <= 1) {
      // 더 이상 뒤로 갈 step이 없음
      return null;
    }

    const lastStep =
      currentDepth.stepHistory[currentDepth.stepHistory.length - 1];

    set((state) => {
      const newStack = [...state.stack];
      const depth = newStack[newStack.length - 1];
      depth.stepHistory = depth.stepHistory.slice(0, -1);
      return { stack: newStack };
    });

    return lastStep;
  },

  /**
   * 현재 활성화된 Depth 반환 (스택 최상단)
   */
  getCurrentDepth: () => {
    const state = get();
    if (state.stack.length === 0) return null;
    return state.stack[state.stack.length - 1];
  },

  /**
   * 현재 활성화된 Step 반환 (현재 Depth의 마지막 step)
   */
  getCurrentStep: () => {
    const currentDepth = get().getCurrentDepth();
    if (!currentDepth || currentDepth.stepHistory.length === 0) return null;
    return currentDepth.stepHistory[currentDepth.stepHistory.length - 1];
  },

  /**
   * 전체 스택 반환 (디버깅용)
   */
  getStack: () => {
    return get().stack;
  },

  /**
   * 스택 초기화
   */
  reset: () => {
    set({ stack: [] });
  },
}));
