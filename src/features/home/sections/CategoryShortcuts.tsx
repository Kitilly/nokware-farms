import { Link } from 'react-router-dom'
import { categories } from '@/config/categories.config'
import { resolveIcon } from '@/lib/icon-registry'
import { copy } from '@/config/copy'

export function CategoryShortcuts() {
  return (
    <section className="py-2">
      <h2 className="mb-3 px-5 text-h3 text-charcoal-900 md:px-8">{copy.home.sections.categories}</h2>
      <div className="grid grid-cols-4 gap-3 px-5 md:px-8 md:flex md:gap-5">
        {categories.map((c) => {
          const Icon = resolveIcon(c.icon)
          return (
            <Link key={c.id} to={`/shop/${c.id}`} className="flex flex-col items-center gap-2 text-center md:w-24">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 transition-colors group-hover:bg-forest-100">
                <Icon className="h-6 w-6 text-forest-700" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-caption font-medium text-charcoal-700">{c.shortLabel}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
