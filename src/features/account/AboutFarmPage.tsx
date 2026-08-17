import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { getSceneTreatment } from '@/data/mock/images'
import { appConfig } from '@/config/app.config'
import { copy } from '@/config/copy'

export function AboutFarmPage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>

        <MediaPlaceholder treatment={getSceneTreatment('about-farm')} alt={`${appConfig.brand.name} farm`} className="h-48 w-full rounded-2xl" iconClassName="h-10 w-10" />

        <h1 className="mt-5 text-h1 text-charcoal-900">About {appConfig.brand.name}</h1>
        <p className="mt-3 text-body-lg text-charcoal-700">{copy.home.farmStoryBody}</p>
        <p className="mt-3 text-body-lg text-charcoal-700">
          Based in {appConfig.brand.name === 'Nokware Farms' ? 'Nsawam, Eastern Region' : 'Ghana'}, we raise cattle, goats, sheep, pigs, rabbits, and poultry on
          open pasture, and process fresh meat under strict hygiene standards — all traceable back to our farm.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <ShieldCheck className="h-5 w-5 text-forest-700" aria-hidden="true" />
            <p className="mt-2 text-body-lg font-medium text-charcoal-900">Farm-verified</p>
            <p className="text-body text-charcoal-600">Every product traces back to our farm.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Sparkles className="h-5 w-5 text-forest-700" aria-hidden="true" />
            <p className="mt-2 text-body-lg font-medium text-charcoal-900">Hygienic processing</p>
            <p className="text-body text-charcoal-600">Strict handling and packaging standards.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Truck className="h-5 w-5 text-forest-700" aria-hidden="true" />
            <p className="mt-2 text-body-lg font-medium text-charcoal-900">Reliable delivery</p>
            <p className="text-body text-charcoal-600">Scheduled windows with live order tracking.</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
