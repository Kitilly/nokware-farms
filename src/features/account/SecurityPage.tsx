import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone, ShieldAlert } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsRow } from '@/components/domain/account/SettingsRow'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { toast } from '@/components/ui/Toast'
import { formatMaskedPhone } from '@/lib/validators'
import { useAuthStore } from '@/store/auth.store'
import { useOnboardingStore } from '@/store/onboarding.store'

export function SecurityPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const expireSessionNow = useAuthStore((s) => s.expireSessionNow)
  const setPendingPhone = useAuthStore((s) => s.setPendingPhone)
  const setOnboardingStep = useOnboardingStore((s) => s.setStep)

  function handleChangeNumber() {
    if (user) setPendingPhone(user.phone)
    setOnboardingStep('otp')
    navigate('/onboarding/otp')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/settings')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Settings
        </button>
        <h1 className="text-h1 text-charcoal-900">Security</h1>

        <div className="mt-5 space-y-0.5">
          <SettingsRow
            icon={<Smartphone className="h-4 w-4 text-charcoal-600" />}
            label="Phone number"
            description={user ? formatMaskedPhone(user.phone) : undefined}
            onClick={handleChangeNumber}
            trailing={<span className="text-caption font-medium text-forest-700">Change</span>}
          />
        </div>

        <Divider className="my-4" />

        <p className="mb-2 text-body font-medium text-charcoal-800">Active session</p>
        <p className="text-body text-charcoal-600">You’re signed in on this device. For your security, sessions expire automatically after a period of inactivity.</p>

        <div className="mt-4 rounded-lg border border-dashed border-border-strong p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-caption font-medium uppercase tracking-wide text-charcoal-400">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> Demo control
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              expireSessionNow()
              toast.info('Session expired', 'Try navigating to a protected page to see the recovery flow.')
            }}
          >
            Simulate session expiry
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
