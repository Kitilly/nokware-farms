import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/domain/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types/product'

interface ProductRailProps {
  title: string
  products: Product[]
  seeAllHref?: string
  isLoading?: boolean
}

export function ProductRail({ title, products, seeAllHref, isLoading }: ProductRailProps) {
  if (!isLoading && products.length === 0) return null

  return (
    <section className="py-2">
      <div className="mb-3 flex items-center justify-between px-5 md:px-8">
        <h2 className="text-h3 text-charcoal-900">{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="flex items-center gap-0.5 text-body font-medium text-forest-700 hover:underline">
            See all <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-5 pb-1 md:px-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-40 shrink-0 md:w-48">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((p) => (
              <div key={p.id} className="w-40 shrink-0 md:w-48">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  )
}
