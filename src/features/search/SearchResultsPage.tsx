import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, X, Info } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { RecentSearches } from '@/components/domain/search/RecentSearches'
import { SearchSuggestions } from '@/components/domain/search/SearchSuggestions'
import { ProductCard } from '@/components/domain/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchStore } from '@/store/search.store'
import { useAnalytics } from '@/hooks/useAnalytics'
import { search, getSuggestedSearches, getPopularSearches } from '@/services/search'
import { useLocationStore } from '@/store/location.store'
import { deliveryZones } from '@/data/mock/delivery-zones'
import type { SearchResult } from '@/types/search'

export function SearchResultsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const { track } = useAnalytics()

  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 350)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [suggested, setSuggested] = useState<string[]>([])
  const [popular, setPopular] = useState<string[]>([])

  const recentSearches = useSearchStore((s) => s.recentSearches)
  const addRecentSearch = useSearchStore((s) => s.addRecentSearch)
  const clearRecentSearches = useSearchStore((s) => s.clearRecentSearches)
  const getSelectedAddress = useLocationStore((s) => s.getSelectedAddress)

  useEffect(() => {
    getSuggestedSearches().then(setSuggested)
    getPopularSearches().then(setPopular)
  }, [])

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true })

    if (debouncedQuery.trim().length === 0) {
      setResult(null)
      return
    }

    let cancelled = false
    setIsSearching(true)
    const selectedZone = deliveryZones.find((z) => z.id === getSelectedAddress()?.deliveryZoneId)
    const zoneAllowsDelivery = selectedZone?.eligible ?? true
    search(debouncedQuery, {
      deliveryEligibleOnly: true,
      isDeliveryEligible: (product) => zoneAllowsDelivery || product.fulfillmentTypes.includes('pickup'),
    }).then((res) => {
      if (cancelled) return
      setResult(res)
      setIsSearching(false)
      addRecentSearch(debouncedQuery)
      track('search_used', { query: debouncedQuery, resultCount: res.results.length })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  function handleSelectTerm(term: string) {
    setQuery(term)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 pt-4 md:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal-700 hover:bg-cream-200">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search livestock, meat, poultry…"
              className="h-11 w-full rounded-full border border-border-strong bg-cream-50 pl-10 pr-9 text-body-lg text-charcoal-900 placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:border-forest-500"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="relative max-w-lg">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search livestock, meat, poultry…"
              className="h-11 w-full rounded-full border border-border-strong bg-cream-50 pl-10 pr-9 text-body-lg text-charcoal-900 placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:border-forest-500"
            />
          </div>
        </div>

        <div className="mt-6">
          {query.trim().length === 0 && (
            <div className="space-y-7">
              <RecentSearches terms={recentSearches} onSelect={handleSelectTerm} onClear={clearRecentSearches} />
              <SearchSuggestions title="Suggested searches" terms={suggested} onSelect={handleSelectTerm} />
              <SearchSuggestions title="Popular searches" terms={popular} onSelect={handleSelectTerm} />
            </div>
          )}

          {query.trim().length > 0 && isSearching && <ProductGridSkeleton count={8} />}

          {query.trim().length > 0 && !isSearching && result && (
            <>
              {result.interpreted.guidanceNote && (
                <p className="mb-4 flex items-start gap-2 rounded-md bg-forest-50 px-3.5 py-3 text-body text-forest-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {result.interpreted.guidanceNote}
                </p>
              )}

              {result.results.length > 0 ? (
                <>
                  <p className="mb-3 text-body text-charcoal-500">{result.results.length} results</p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {result.results.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<Search className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
                  title="No results found"
                  body="Try a different search term, or explore one of these instead."
                  action={
                    result.suggestions.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        {result.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleSelectTerm(s)}
                            className="rounded-full border border-border-strong bg-cream-50 px-3.5 py-2 text-body text-charcoal-700 hover:bg-cream-200"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : undefined
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  )
}
