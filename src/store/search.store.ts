import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT_SEARCHES = 8

interface SearchState {
  recentSearches: string[]
  addRecentSearch: (term: string) => void
  clearRecentSearches: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (term) =>
        set((state) => {
          const trimmed = term.trim()
          if (trimmed.length === 0) return state
          const deduped = [trimmed, ...state.recentSearches.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())]
          return { recentSearches: deduped.slice(0, MAX_RECENT_SEARCHES) }
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'farm-app-search-recent' },
  ),
)
