import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from './OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { getSceneTreatment } from '@/data/mock/images'
import { copy } from '@/config/copy'
import { appConfig } from '@/config/app.config'
import { validatePhone } from '@/lib/validators'
import { requestOtp } from '@/services/otp'
import { useAuthStore } from '@/store/auth.store'
import { useAnalytics } from '@/hooks/useAnalytics'

export function WelcomeScreen() {
  const navigate = useNavigate()
  const setPendingPhone = useAuthStore((s) => s.setPendingPhone)
  const { track } = useAnalytics()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleContinue() {
    const validation = validatePhone(phone)
    if (!validation.valid) {
      setError(validation.message)
      return
    }
    setError(undefined)
    setIsSubmitting(true)
    track('signup_started')
    const fullPhone = `${appConfig.phone.dialCode} ${phone}`
    await requestOtp(fullPhone)
    setPendingPhone(fullPhone)
    setIsSubmitting(false)
    navigate('/onboarding/otp')
  }

  return (
    <OnboardingLayout>
      <div className="flex flex-1 flex-col justify-center">
        <MediaPlaceholder
          treatment={getSceneTreatment('welcome-hero')}
          alt="Nokware Farms — pasture and harvest"
          className="h-52 w-full rounded-2xl md:h-64"
        />

        <div className="mt-7">
          <h1 className="font-display text-display text-forest-800">{copy.onboarding.welcome.title}</h1>
          <p className="mt-2 text-h3 text-charcoal-700">{copy.onboarding.welcome.subtitle}</p>
          <p className="mt-2 text-body-lg text-charcoal-600">{copy.onboarding.welcome.body}</p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleContinue()
          }}
        >
          <PhoneInput value={phone} onChange={setPhone} error={error} autoFocus label={copy.onboarding.welcome.phoneLabel} />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            {copy.onboarding.welcome.continueCta}
          </Button>
          <p className="text-center text-caption text-charcoal-500">{copy.onboarding.welcome.termsAcknowledgement}</p>
        </form>
      </div>
    </OnboardingLayout>
  )
}
