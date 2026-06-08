import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { id: string; name: string; email: string; avatarUrl?: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  setAuth: (data: { user?: any; accessToken: string; refreshToken: string; tenantId?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tenantId: null,
      setAuth: (data) => set((state) => ({
        ...state,
        ...data,
        user: data.user || state.user,
      })),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, tenantId: null }),
    }),
    { name: 'auth-storage' }
  )
);
