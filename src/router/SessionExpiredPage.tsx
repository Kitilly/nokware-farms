import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { copy } from '@/config/copy'
import { useAuthStore } from '@/store/auth.store'

export function SessionExpiredPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setPendingPhone = useAuthStore((s) => s.setPendingPhone)

  function handleSignInAgain() {
    if (user) setPendingPhone(user.phone)
    navigate('/onboarding/otp')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <EmptyState
        icon={<ShieldAlert className="h-7 w-7 text-warning" aria-hidden="true" />}
        title={copy.states.sessionExpired.title}
        body={copy.states.sessionExpired.body}
        action={<Button onClick={handleSignInAgain}>{copy.states.sessionExpired.action}</Button>}
      />
    </div>
  )
}
