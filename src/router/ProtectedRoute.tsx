import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useOnboardingStore } from '@/store/onboarding.store'
import { useAuthStore } from '@/store/auth.store'
import { SessionExpiredPage } from './SessionExpiredPage'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const completed = useOnboardingStore((s) => s.completed)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const sessionExpiresAt = useAuthStore((s) => s.sessionExpiresAt)

  if (!completed) return <Navigate to="/onboarding/welcome" replace />

  const sessionExpired = isAuthenticated && sessionExpiresAt !== null && Date.now() >= sessionExpiresAt
  if (sessionExpired) return <SessionExpiredPage />

  return <>{children}</>
}
