import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from './OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { getSceneTreatment } from '@/data/mock/images'
import { copy } from '@/config/copy'
import { categories } from '@/config/categories.config'
import { resolveIcon } from '@/lib/icon-registry'
import { useProfileStore } from '@/store/profile.store'

export function PersonalizedWelcomeScreen() {
  const navigate = useNavigate()
  const firstName = useProfileStore((s) => s.firstName)

  return (
    <OnboardingLayout>
      <div className="flex flex-1 flex-col justify-center">
        <MediaPlaceholder
          treatment={getSceneTreatment('farm-story')}
          alt="Nokware Farms fields"
          className="h-44 w-full rounded-2xl"
        />

        <h1 className="mt-6 text-h1 text-charcoal-900">{copy.onboarding.complete.greetingTemplate(firstName || 'there')}</h1>
        <p className="mt-3 text-body-lg text-charcoal-600">{copy.onboarding.complete.story}</p>
        <p className="mt-3 rounded-md bg-forest-50 px-3.5 py-3 text-body text-forest-800">{copy.onboarding.complete.trustStatement}</p>

        <div className="mt-6">
          <p className="mb-2.5 text-body font-medium text-charcoal-800">Explore</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const Icon = resolveIcon(c.icon)
              return (
                <Chip key={c.id} icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />} onClick={() => navigate(`/shop/${c.id}`)}>
                  {c.shortLabel}
                </Chip>
              )
            })}
          </div>
        </div>

        <Button fullWidth className="mt-8" onClick={() => navigate('/home')}>
          {copy.onboarding.complete.startShoppingCta}
        </Button>
      </div>
    </OnboardingLayout>
  )
}
