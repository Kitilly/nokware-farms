import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from './OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { copy } from '@/config/copy'
import { validateName, validateEmail } from '@/lib/validators'
import { useProfileStore } from '@/store/profile.store'
import { useOnboardingStore } from '@/store/onboarding.store'

export function ProfileScreen() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)
  const setStep = useOnboardingStore((s) => s.setStep)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({})

  function handleContinue() {
    const firstNameResult = validateName(firstName, 'First name')
    const lastNameResult = validateName(lastName, 'Last name')
    const emailResult = validateEmail(email)

    if (!firstNameResult.valid || !lastNameResult.valid || !emailResult.valid) {
      setErrors({ firstName: firstNameResult.message, lastName: lastNameResult.message, email: emailResult.message })
      return
    }

    setProfile({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() })
    setStep('location')
    navigate('/onboarding/location')
  }

  return (
    <OnboardingLayout onBack={() => navigate('/onboarding/otp')} step={{ current: 2, total: 3 }}>
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-h1 text-charcoal-900">{copy.onboarding.profile.title}</h1>
        <p className="mt-2 text-body-lg text-charcoal-600">{copy.onboarding.profile.subtitle}</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleContinue()
          }}
        >
          <Input
            label={copy.onboarding.profile.firstNameLabel}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            autoFocus
            autoComplete="given-name"
          />
          <Input
            label={copy.onboarding.profile.lastNameLabel}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
          />
          <Input
            label={copy.onboarding.profile.emailLabel}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Button type="submit" fullWidth className="mt-4">
            {copy.onboarding.profile.continueCta}
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  )
}
