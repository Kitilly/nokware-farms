import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { SupportFooter } from '@/components/layout/SupportFooter'
import { LocationHeader } from '@/components/domain/location/LocationHeader'
import { SearchBar } from '@/components/domain/search/SearchBar'
import { PromoBanner } from './sections/PromoBanner'
import { CategoryShortcuts } from './sections/CategoryShortcuts'
import { ProductRail } from './sections/ProductRail'
import { TrustIndicators } from './sections/TrustIndicators'
import { FarmStory } from './sections/FarmStory'
import { getProducts } from '@/services/inventory'
import { useNotificationsStore } from '@/store/notifications.store'
import { useProfileStore } from '@/store/profile.store'
import type { Product } from '@/types/product'

interface RailState {
  products: Product[]
  isLoading: boolean
}

function useRail(filters: Parameters<typeof getProducts>[0]): RailState {
  const [state, setState] = useState<RailState>({ products: [], isLoading: true })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, isLoading: true }))
    getProducts(filters).then((res) => {
      if (!cancelled) setState({ products: res.items, isLoading: false })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  return state
}

export function HomePage() {
  const firstName = useProfileStore((s) => s.firstName)
  const unread = useNotificationsStore((s) => s.unreadCount())

  const popularLivestock = useRail({ category: 'live-livestock', sort: 'popular', pageSize: 10 })
  const freshMeat = useRail({ category: 'fresh-meat', sort: 'popular', pageSize: 10 })
  const poultry = useRail({ category: 'poultry', sort: 'popular', pageSize: 10 })
  const farmFavorites = useRail({ featured: true, sort: 'recommended', pageSize: 10 })
  const freshThisWeek = useRail({ seasonal: true, sort: 'newest', pageSize: 10 })

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2 px-5 pt-4 md:hidden">
          <LocationHeader className="flex-1" />
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:bg-cream-200"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-terracotta-500" />}
          </Link>
        </div>

        <div className="px-5 pt-3 md:hidden">
          <SearchBar />
        </div>

        {firstName && (
          <p className="px-5 pt-4 text-body-lg text-charcoal-600 md:px-8">
            Welcome back, <span className="font-medium text-charcoal-900">{firstName}</span>
          </p>
        )}

        <div className="mt-2 space-y-1 pb-6">
          <PromoBanner />
          <CategoryShortcuts />
          <ProductRail title="Popular livestock" products={popularLivestock.products} isLoading={popularLivestock.isLoading} seeAllHref="/shop/live-livestock" />
          <ProductRail title="Fresh meat" products={freshMeat.products} isLoading={freshMeat.isLoading} seeAllHref="/shop/fresh-meat" />
          <ProductRail title="Poultry & birds" products={poultry.products} isLoading={poultry.isLoading} seeAllHref="/shop/poultry" />
          <ProductRail title="Farm favorites" products={farmFavorites.products} isLoading={farmFavorites.isLoading} seeAllHref="/shop" />
          <ProductRail title="Fresh this week" products={freshThisWeek.products} isLoading={freshThisWeek.isLoading} seeAllHref="/shop" />
        </div>

        <TrustIndicators />
        <FarmStory />
        <SupportFooter />
      </div>
    </AppShell>
  )
}
