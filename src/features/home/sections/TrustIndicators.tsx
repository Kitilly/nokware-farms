import { ShieldCheck, Sparkles, Receipt, Truck } from 'lucide-react'
import { copy } from '@/config/copy'

const icons = [ShieldCheck, Sparkles, Receipt, Truck]

export function TrustIndicators() {
  return (
    <section className="bg-cream-200 px-5 py-8 md:px-8">
      <h2 className="mb-5 text-h3 text-charcoal-900">{copy.home.sections.trust}</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {copy.trust.items.map((item, i) => {
          const Icon = icons[i % icons.length]
          return (
            <div key={item.title} className="flex flex-col gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-600">
                <Icon className="h-5 w-5 text-cream-50" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="text-body-lg font-medium text-charcoal-900">{item.title}</p>
              <p className="text-body text-charcoal-600">{item.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
