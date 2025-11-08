import create from "zustand";

interface UIStore {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  darkMode: false,
  setDarkMode: (v: boolean) => set({ darkMode: v }),
  sidebarOpen: false,
  setSidebarOpen: (v: boolean) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

export default useUIStore;
