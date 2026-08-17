import { Link } from 'react-router-dom'
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { getSceneTreatment } from '@/data/mock/images'
import { featureFlags } from '@/config/feature-flags'

export function PromoBanner() {
  if (!featureFlags.promotions) return null

  return (
    <section className="px-5 py-2 md:px-8">
      <Link to="/shop?promo=WELCOME10" className="group relative block overflow-hidden rounded-2xl">
        <MediaPlaceholder treatment={getSceneTreatment('promo-banner')} alt="Seasonal promotion" className="h-32 w-full md:h-40" iconClassName="h-8 w-8" />
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <p className="text-caption font-semibold uppercase tracking-wide text-cream-100/90">Limited time</p>
          <p className="mt-1 text-h3 text-cream-50">10% off your first order</p>
          <p className="mt-0.5 text-body text-cream-100/90">Use code WELCOME10 at checkout</p>
        </div>
      </Link>
    </section>
  )
}
