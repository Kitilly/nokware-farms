import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ProductCard } from '@/components/domain/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useFavoritesStore } from '@/store/favorites.store'
import { getProductById } from '@/services/inventory'
import type { Product } from '@/types/product'

export function FavoritesPage() {
  const navigate = useNavigate()
  const favoriteIds = useFavoritesStore((s) => s.favoriteProductIds)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    Promise.all(favoriteIds.map((id) => getProductById(id))).then((results) => {
      setProducts(results.filter((p): p is Product => p !== null))
      setIsLoading(false)
    })
  }, [favoriteIds])

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 pt-4 md:px-8">
        <h1 className="text-h1 text-charcoal-900">Favorites</h1>

        <div className="mt-5">
          {isLoading && <ProductGridSkeleton count={6} />}

          {!isLoading && products.length === 0 && (
            <EmptyState
              icon={<Heart className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
              title="No favorites yet"
              body="Tap the heart on any product to save it here for later."
              action={<Button onClick={() => navigate('/shop')}>Browse products</Button>}
              className="pt-10"
            />
          )}

          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
