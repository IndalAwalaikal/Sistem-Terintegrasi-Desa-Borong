import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'id' | 'en';

interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  locale: Locale;
  searchQuery: string;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLocale: (locale: Locale) => void;
  setSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,
      locale: 'id',
      searchQuery: '',
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
          }
          return { theme: next };
        }),
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        set({ theme });
      },
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLocale: (locale) => {
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
        }
        set({ locale });
      },
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'desa-borong-ui',
    }
  )
);
