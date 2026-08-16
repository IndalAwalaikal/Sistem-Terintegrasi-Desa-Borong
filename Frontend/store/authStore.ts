import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthSession } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setSession: (session: AuthSession) => void;
  setTokens: (token: string, refreshToken: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setSession: (session) =>
        set({
          user: session.user,
          token: session.token,
          refreshToken: session.refreshToken,
          isAuthenticated: true,
        }),
      setTokens: (token, refreshToken) => set({ token, refreshToken, isAuthenticated: true }),
      updateUser: (user) => set({ user }),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'desa-borong-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
