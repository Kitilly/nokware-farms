import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-cream-300', className)} aria-hidden="true" {...props} />
}

export function ProductCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <Skeleton className="mt-2.5 h-4 w-4/5" />
      <Skeleton className="mt-1.5 h-3.5 w-1/2" />
      <Skeleton className="mt-2 h-4 w-2/5" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
