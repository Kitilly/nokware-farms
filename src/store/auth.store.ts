import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000 // 12h — long enough not to interrupt a live demo

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  sessionExpiresAt: number | null
  pendingPhone: string | null
  setPendingPhone: (phone: string) => void
  completeVerification: (user: User) => void
  logout: () => void
  isSessionValid: () => boolean
  expireSessionNow: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      sessionExpiresAt: null,
      pendingPhone: null,

      setPendingPhone: (phone) => set({ pendingPhone: phone }),

      completeVerification: (user) =>
        set({
          user,
          isAuthenticated: true,
          sessionExpiresAt: Date.now() + SESSION_DURATION_MS,
        }),

      logout: () => set({ user: null, isAuthenticated: false, sessionExpiresAt: null, pendingPhone: null }),

      isSessionValid: () => {
        const { isAuthenticated, sessionExpiresAt } = get()
        if (!isAuthenticated || !sessionExpiresAt) return false
        return Date.now() < sessionExpiresAt
      },

      expireSessionNow: () => set({ sessionExpiresAt: Date.now() - 1 }),
    }),
    { name: 'farm-app-auth' },
  ),
)
