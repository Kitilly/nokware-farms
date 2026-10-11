import { Link } from 'react-router-dom'
import { ArrowRight, Tag } from 'lucide-react'
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { getSceneTreatment, getSubCategoryTreatment } from '@/data/mock/images'
import { featureFlags } from '@/config/feature-flags'
import { appConfig } from '@/config/app.config'

export function HomeHero() {
  return (
    <section className="px-5 pt-3 pb-4 md:px-8 md:pt-6">
      <div className="relative overflow-hidden rounded-2xl bg-forest-800 text-cream-50 md:grid md:grid-cols-[1.15fr_1fr] md:items-stretch">
        <MediaPlaceholder
          treatment={getSceneTreatment('welcome-hero')}
          alt=""
          className="absolute inset-0 h-full w-full md:hidden"
          iconClassName="hidden"
        />

        <div className="relative px-6 py-8 md:px-10 md:py-14">
          <p className="text-label font-semibold uppercase tracking-[0.14em] text-forest-200">From our farm in {appConfig.country.name}</p>
          <h1 className="mt-3 max-w-[18ch] font-display text-[2rem] leading-[1.08] font-semibold text-cream-50 md:text-[3rem]">
            Farm-raised livestock &amp; fresh meat, delivered.
          </h1>
          <p className="mt-4 max-w-[46ch] text-body-lg text-cream-100/80">
            Choose a whole animal or a fresh cut. Every order is handled by our own team, from pasture to your door.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/shop/live-livestock"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-cream-50 px-4 md:px-5 text-body-lg font-semibold text-forest-800 transition-colors hover:bg-cream-200"
            >
              Shop livestock <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/shop/fresh-meat"
              className="inline-flex h-11 items-center rounded-md border border-cream-50/30 px-4 md:px-5 text-body-lg font-medium text-cream-50 transition-colors hover:bg-cream-50/10"
            >
              Fresh meat
            </Link>
          </div>

          {featureFlags.promotions && (
            <Link
              to="/shop?promo=WELCOME10"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta-500/90 py-1.5 pr-3.5 pl-2.5 text-body text-cream-50 transition-colors hover:bg-terracotta-500"
            >
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="whitespace-nowrap">
                10% off<span className="hidden sm:inline"> your</span> first order · <span className="font-semibold tracking-wide">WELCOME10</span>
              </span>
            </Link>
          )}
        </div>

        <div className="relative hidden grid-cols-2 grid-rows-2 gap-2 p-2 md:grid">
          <MediaPlaceholder treatment={getSubCategoryTreatment('cattle')} alt="" className="row-span-2 rounded-xl" iconClassName="h-14 w-14" />
          <MediaPlaceholder treatment={getSubCategoryTreatment('chickens')} alt="" className="rounded-xl" iconClassName="h-10 w-10" />
          <MediaPlaceholder treatment={getSubCategoryTreatment('goats')} alt="" className="rounded-xl" iconClassName="h-10 w-10" />
        </div>
      </div>
    </section>
  )
}
