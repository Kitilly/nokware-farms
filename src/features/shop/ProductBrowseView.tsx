import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, PackageSearch } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/domain/product/ProductCard'
import { ProductListItem } from '@/components/domain/product/ProductListItem'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/DropdownMenu'
import { FilterSheet, toProductFilters, type ShopFilterValues } from './FilterSheet'
import { categories, getCategory } from '@/config/categories.config'
import { getProducts } from '@/services/inventory'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { cn } from '@/lib/utils'
import type { Product, ProductCategory, SortOption } from '@/types/product'

const sortLabels: Record<SortOption, string> = {
  recommended: 'Recommended',
  popular: 'Popular',
  newest: 'Newest',
  'price-low-high': 'Price: Low to high',
  'price-high-low': 'Price: High to low',
}

const PAGE_SIZE = 12

interface ProductBrowseViewProps {
  initialCategory?: ProductCategory
  initialSubCategory?: string
}

export function ProductBrowseView({ initialCategory, initialSubCategory }: ProductBrowseViewProps) {
  const [searchParams] = useSearchParams()
  const isOnline = useOnlineStatus()
  const categoryDef = initialCategory ? getCategory(initialCategory) : undefined

  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>(initialCategory)
  const [activeSubCategory, setActiveSubCategory] = useState<string | undefined>(initialSubCategory)
  const [sort, setSort] = useState<SortOption>('recommended')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<ShopFilterValues>({})

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setActiveCategory(initialCategory)
    setActiveSubCategory(initialSubCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, initialSubCategory])

  const promoActive = searchParams.get('promo')

  const queryFilters = useMemo(
    () => ({
      category: activeCategory,
      subCategory: activeSubCategory,
      sort,
      pageSize: PAGE_SIZE,
      ...toProductFilters(filters),
    }),
    [activeCategory, activeSubCategory, sort, filters],
  )

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setHasError(false)
    getProducts({ ...queryFilters, page: 1 })
      .then((res) => {
        if (cancelled) return
        setProducts(res.items)
        setTotal(res.total)
        setPage(1)
        setIsLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true)
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryFilters)])

  function handleLoadMore() {
    const nextPage = page + 1
    getProducts({ ...queryFilters, page: nextPage }).then((res) => {
      setProducts((prev) => [...prev, ...res.items])
      setPage(nextPage)
    })
  }

  const activeFilterCount =
    (filters.availability?.length ?? 0) +
    (filters.liveOrProcessed ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.weightMin || filters.weightMax ? 1 : 0) +
    (filters.freshOnly ? 1 : 0)

  if (!isOnline) {
    return (
      <AppShell>
        <ErrorState variant="offline" title="You’re offline" body="Check your internet connection and try again." className="pt-20" />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 pt-4 md:px-8">
        {promoActive && (
          <p className="mb-4 rounded-md bg-forest-50 px-3.5 py-2.5 text-body text-forest-800">
            Promo code <span className="font-semibold">{promoActive}</span> will be applied at checkout.
          </p>
        )}

        {!categoryDef ? (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <Chip selected={!activeCategory} onClick={() => setActiveCategory(undefined)}>
              All
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} selected={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
                {c.shortLabel}
              </Chip>
            ))}
          </div>
        ) : (
          <>
            <h1 className="text-h1 text-charcoal-900">{categoryDef.label}</h1>
            <p className="mt-1 text-body-lg text-charcoal-600">{categoryDef.description}</p>
            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
              <Chip selected={!activeSubCategory} onClick={() => setActiveSubCategory(undefined)}>
                All {categoryDef.shortLabel}
              </Chip>
              {categoryDef.subCategories.map((s) => (
                <Chip key={s.id} selected={activeSubCategory === s.id} onClick={() => setActiveSubCategory(s.id)}>
                  {s.label}
                </Chip>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-b border-border pb-3">
          <p className="text-body text-charcoal-500">{isLoading ? 'Loading…' : `${total} product${total === 1 ? '' : 's'}`}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="relative flex h-9 items-center gap-1.5 rounded-full border border-border-strong px-3 text-body font-medium text-charcoal-700 hover:bg-cream-200"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-forest-600 px-1 text-[10px] font-semibold text-cream-50">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 items-center gap-1.5 rounded-full border border-border-strong px-3 text-body font-medium text-charcoal-700 hover:bg-cream-200 focus-visible:outline-none">
                Sort: {sortLabels[sort]}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  {(Object.keys(sortLabels) as SortOption[]).map((s) => (
                    <DropdownMenuRadioItem key={s} value={s}>
                      {sortLabels[s]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden items-center gap-0.5 rounded-full border border-border-strong p-0.5 md:flex">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
                className={cn('flex h-7 w-7 items-center justify-center rounded-full', view === 'grid' ? 'bg-forest-600 text-cream-50' : 'text-charcoal-500')}
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
                className={cn('flex h-7 w-7 items-center justify-center rounded-full', view === 'list' ? 'bg-forest-600 text-cream-50' : 'text-charcoal-500')}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="py-5">
          {hasError && (
            <ErrorState title="Couldn’t load products" body="Something went wrong. Please try again." action={<Button onClick={() => setFilters({ ...filters })}>Retry</Button>} />
          )}

          {!hasError && isLoading && <ProductGridSkeleton count={PAGE_SIZE} />}

          {!hasError && !isLoading && products.length === 0 && (
            <EmptyState
              icon={<PackageSearch className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
              title="No products match your filters"
              body="Try adjusting or clearing your filters."
              action={
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear filters
                </Button>
              }
            />
          )}

          {!hasError && !isLoading && products.length > 0 && (
            <>
              <div className={cn(view === 'grid' ? 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4' : 'flex flex-col gap-3')}>
                {products.map((p) => (view === 'list' ? <ProductListItem key={p.id} product={p} /> : <ProductCard key={p.id} product={p} />))}
              </div>

              {products.length < total && (
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={handleLoadMore}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        value={filters}
        onApply={setFilters}
        showLiveProcessedToggle={activeCategory === 'poultry' || !activeCategory}
      />
    </AppShell>
  )
}
