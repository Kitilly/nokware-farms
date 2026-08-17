import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from './OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import { copy } from '@/config/copy'
import { appConfig } from '@/config/app.config'
import { formatMaskedPhone } from '@/lib/validators'
import { verifyOtp, resendOtp } from '@/services/otp'
import { useAuthStore } from '@/store/auth.store'
import { useOnboardingStore } from '@/store/onboarding.store'
import { useCountdown } from '@/hooks/useCountdown'
import { useAnalytics } from '@/hooks/useAnalytics'
import { CheckCircle2 } from 'lucide-react'

export function OtpScreen() {
  const navigate = useNavigate()
  const pendingPhone = useAuthStore((s) => s.pendingPhone)
  const completeVerification = useAuthStore((s) => s.completeVerification)
  const setStep = useOnboardingStore((s) => s.setStep)
  const { track } = useAnalytics()

  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'verifying' | 'invalid' | 'expired' | 'success'>('idle')
  const { secondsLeft, restart } = useCountdown(appConfig.otp.resendCooldownSeconds)

  // Only guard on mount — pendingPhone must not redirect reactively, or the
  // brief window between a successful verification and the follow-up
  // navigate() would race this effect and bounce the user back to Welcome.
  const hadPendingPhoneOnMount = useRef(Boolean(pendingPhone))
  useEffect(() => {
    if (!hadPendingPhoneOnMount.current) navigate('/onboarding/welcome', { replace: true })
  }, [navigate])

  async function handleComplete(value: string) {
    if (!pendingPhone) return
    setStatus('verifying')
    const result = await verifyOtp(pendingPhone, value)
    if (result.success && result.user) {
      setStatus('success')
      track('signup_completed')
      setTimeout(() => {
        completeVerification(result.user!)
        setStep('profile')
        navigate('/onboarding/profile')
      }, 700)
      return
    }
    setStatus(result.reason === 'expired' ? 'expired' : 'invalid')
  }

  async function handleResend() {
    if (!pendingPhone || secondsLeft > 0) return
    setCode('')
    setStatus('idle')
    await resendOtp(pendingPhone)
    restart(appConfig.otp.resendCooldownSeconds)
  }

  if (!pendingPhone) return null

  return (
    <OnboardingLayout onBack={() => navigate('/onboarding/welcome')}>
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-h1 text-charcoal-900">{copy.onboarding.otp.title}</h1>
        <p className="mt-2 text-body-lg text-charcoal-600">{copy.onboarding.otp.subtitleTemplate(formatMaskedPhone(pendingPhone))}</p>

        <div className="mt-8">
          <OtpInput
            length={appConfig.otp.length}
            value={code}
            onChange={(v) => {
              setCode(v)
              if (status === 'invalid' || status === 'expired') setStatus('idle')
            }}
            onComplete={handleComplete}
            disabled={status === 'verifying' || status === 'success'}
            error={status === 'invalid' || status === 'expired'}
          />

          <div className="mt-3 min-h-[1.5rem]" aria-live="polite">
            {status === 'invalid' && <p className="text-body text-error">{copy.onboarding.otp.invalidCode}</p>}
            {status === 'expired' && <p className="text-body text-error">{copy.onboarding.otp.expiredCode}</p>}
            {status === 'success' && (
              <p className="flex items-center gap-1.5 text-body text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {copy.onboarding.otp.success}
              </p>
            )}
          </div>

          <p className="mt-2 rounded-md bg-cream-200 px-3 py-2 text-caption text-charcoal-600">{copy.onboarding.otp.devHint}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/onboarding/welcome')} className="text-body font-medium text-forest-700 hover:underline focus-visible:outline-none">
            {copy.onboarding.otp.changeNumber}
          </button>
          <div className="text-body text-charcoal-600">
            {secondsLeft > 0 ? (
              <span>{copy.onboarding.otp.resendCountdownTemplate(secondsLeft)}</span>
            ) : (
              <button type="button" onClick={handleResend} className="font-medium text-forest-700 hover:underline focus-visible:outline-none">
                {copy.onboarding.otp.resendCta}
              </button>
            )}
          </div>
        </div>

        <Button
          className="mt-8"
          fullWidth
          isLoading={status === 'verifying'}
          disabled={code.length !== appConfig.otp.length}
          onClick={() => handleComplete(code)}
        >
          Verify
        </Button>
      </div>
    </OnboardingLayout>
  )
}
