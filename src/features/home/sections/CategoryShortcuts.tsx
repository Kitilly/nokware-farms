import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { categories } from '@/config/categories.config'
import { resolveIcon } from '@/lib/icon-registry'
import { copy } from '@/config/copy'

export function CategoryShortcuts() {
  return (
    <section>
      <h2 className="mb-3 px-5 text-h2 text-charcoal-900 md:px-8">{copy.home.sections.categories}</h2>
      <div className="grid grid-cols-4 gap-3 px-5 md:gap-4 md:px-8">
        {categories.map((c) => {
          const Icon = resolveIcon(c.icon)
          return (
            <Link
              key={c.id}
              to={`/shop/${c.id}`}
              className="group flex flex-col items-center gap-2 text-center md:flex-row md:items-center md:gap-4 md:rounded-xl md:border md:border-border md:bg-cream-50 md:p-4 md:text-left md:transition-[border-color,box-shadow] md:hover:border-border-strong md:hover:shadow-sm"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest-50 transition-colors group-hover:bg-forest-100 md:h-12 md:w-12 md:rounded-lg">
                <Icon className="h-6 w-6 text-forest-700" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="min-w-0 md:flex-1">
                <span className="block text-caption font-medium text-charcoal-700 md:text-body-lg md:font-semibold md:text-charcoal-900">
                  <span className="md:hidden">{c.shortLabel}</span>
                  <span className="hidden md:inline">{c.label}</span>
                </span>
                <span className="mt-0.5 hidden text-body text-charcoal-500 md:line-clamp-1">{c.description}</span>
              </span>
              <ArrowUpRight
                className="hidden h-4 w-4 shrink-0 text-charcoal-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest-700 lg:block"
                aria-hidden="true"
              />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
