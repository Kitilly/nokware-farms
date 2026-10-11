import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/domain/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

/** In grid mode show exactly one full row: 4 / 5 / 6 columns at md / lg / xl. */
function gridVisibility(index: number): string {
  if (index < 4) return ''
  if (index === 4) return 'md:hidden lg:block'
  if (index === 5) return 'md:hidden xl:block'
  return 'md:hidden'
}

interface ProductRailProps {
  title: string
  products: Product[]
  seeAllHref?: string
  isLoading?: boolean
}

export function ProductRail({ title, products, seeAllHref, isLoading }: ProductRailProps) {
  if (!isLoading && products.length === 0) return null

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-5 md:px-8">
        <h2 className="text-h2 text-charcoal-900">{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="flex items-center gap-0.5 text-body font-medium text-forest-700 hover:underline">
            See all <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
      {/* Swipeable rail on mobile; a tidy grid on larger screens where horizontal scroll hides content. */}
      <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 pb-1 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible md:px-8 lg:grid-cols-5 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn('w-40 shrink-0 snap-start md:w-auto', gridVisibility(i))}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((p, i) => (
              <div key={p.id} className={cn('w-40 shrink-0 snap-start md:w-auto', gridVisibility(i))}>
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  )
}
