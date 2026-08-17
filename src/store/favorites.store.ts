import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteProductIds: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteProductIds: [],
      toggleFavorite: (productId) =>
        set((state) => ({
          favoriteProductIds: state.favoriteProductIds.includes(productId)
            ? state.favoriteProductIds.filter((id) => id !== productId)
            : [...state.favoriteProductIds, productId],
        })),
      isFavorite: (productId) => get().favoriteProductIds.includes(productId),
      clearFavorites: () => set({ favoriteProductIds: [] }),
    }),
    { name: 'farm-app-favorites' },
  ),
)
