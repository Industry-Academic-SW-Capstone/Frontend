import { create } from "zustand";
import { ReactNode } from "react";

export type ToastType = "info" | "success" | "error" | "warning";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface Toast {
  id: string;
  content: ReactNode;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  icon?: ReactNode;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      dismissible: true,
      position: "top-center",
      duration: 3000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto dismiss if duration is set
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Helper function for easy toast creation
export const toast = {
  success: (
    content: ReactNode,
    options?: Partial<Omit<Toast, "id" | "type" | "content">>
  ) =>
    useToastStore.getState().addToast({ content, type: "success", ...options }),

  error: (
    content: ReactNode,
    options?: Partial<Omit<Toast, "id" | "type" | "content">>
  ) =>
    useToastStore.getState().addToast({ content, type: "error", ...options }),

  info: (
    content: ReactNode,
    options?: Partial<Omit<Toast, "id" | "type" | "content">>
  ) => useToastStore.getState().addToast({ content, type: "info", ...options }),

  warning: (
    content: ReactNode,
    options?: Partial<Omit<Toast, "id" | "type" | "content">>
  ) =>
    useToastStore.getState().addToast({ content, type: "warning", ...options }),

  custom: (
    content: ReactNode,
    options?: Partial<Omit<Toast, "id" | "content">>
  ) => useToastStore.getState().addToast({ content, type: "info", ...options }),

  dismiss: (id: string) => useToastStore.getState().removeToast(id),

  dismissAll: () => useToastStore.getState().clearAll(),
};
