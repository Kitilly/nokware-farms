import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import { computeItemTotal, computeUnitPrice, isPricePending } from '@/lib/pricing'
import { computeCartTotals, type CartTotals } from '@/lib/cart-math'
import * as cartService from '@/services/cart'
import type { Product } from '@/types/product'
import type { Cart, CartItem, CartItemSelection, CartPromo } from '@/types/cart'

function selectionKey(selection: CartItemSelection): string {
  return JSON.stringify({
    cutId: selection.cutId ?? null,
    weightOptionId: selection.weightOptionId ?? null,
    customWeightKg: selection.customWeightKg ?? null,
    preparationIds: [...(selection.preparationIds ?? [])].sort(),
  })
}

interface CartState {
  items: CartItem[]
  promo?: CartPromo
  promoError: string | null
  isApplyingPromo: boolean
  addItem: (product: Product, selection: CartItemSelection, quantity: number) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateSelection: (itemId: string, product: Product, selection: CartItemSelection) => void
  removeItem: (itemId: string) => void
  saveForLater: (itemId: string) => void
  moveToCart: (itemId: string) => void
  clearCart: () => void
  applyPromoCode: (code: string) => Promise<void>
  removePromoCode: () => void
  getTotals: (extraDeliveryFee?: number) => CartTotals
  getCart: (extraDeliveryFee?: number) => Cart
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: undefined,
      promoError: null,
      isApplyingPromo: false,

      addItem: (product, selection, quantity) => {
        const key = selectionKey(selection)
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === product.id && !i.savedForLater && selectionKey(i.selection) === key,
          )

          if (existingIndex >= 0) {
            const existing = state.items[existingIndex]
            const newQuantity = existing.quantity + quantity
            const updated: CartItem = {
              ...existing,
              quantity: newQuantity,
              itemTotal: computeItemTotal(product, selection, newQuantity),
            }
            const items = [...state.items]
            items[existingIndex] = updated
            return { items }
          }

          const newItem: CartItem = {
            id: generateId('cart'),
            productId: product.id,
            productSlug: product.slug,
            productType: product.type,
            name: product.name,
            image: product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url ?? '',
            selection,
            quantity,
            unitPrice: computeUnitPrice(product, selection),
            itemTotal: computeItemTotal(product, selection, quantity),
            priceUnit: product.priceUnit,
            fulfillmentTypes: product.fulfillmentTypes,
            isLiveAnimal: product.type === 'live-animal',
            processingTimeHours: product.processingTimeHours,
            isPricePending: isPricePending(product),
            savedForLater: false,
            addedAt: new Date().toISOString(),
          }
          return { items: [...state.items, newItem] }
        })
      },

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item
            const unitPrice = item.unitPrice
            return { ...item, quantity, itemTotal: Math.round(unitPrice * quantity * 100) / 100 }
          }),
        })),

      updateSelection: (itemId, product, selection) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  selection,
                  unitPrice: computeUnitPrice(product, selection),
                  itemTotal: computeItemTotal(product, selection, item.quantity),
                }
              : item,
          ),
        })),

      removeItem: (itemId) => set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

      saveForLater: (itemId) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, savedForLater: true } : i)),
        })),

      moveToCart: (itemId) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, savedForLater: false } : i)),
        })),

      clearCart: () => set({ items: [], promo: undefined, promoError: null }),

      applyPromoCode: async (code) => {
        set({ isApplyingPromo: true, promoError: null })
        const { items } = get()
        const totals = computeCartTotals(items)
        const cart: Cart = { items, ...totals }
        const result = await cartService.applyPromo(code, cart)
        if (result.success && result.promo) {
          set({ promo: result.promo, isApplyingPromo: false, promoError: null })
        } else {
          const messages: Record<string, string> = {
            invalid: 'This promo code doesn’t exist or is no longer valid.',
            expired: 'This promo code has expired.',
            'minimum-not-met': 'Your order doesn’t yet meet the minimum spend for this code.',
            'already-applied': 'A promo code is already applied.',
          }
          set({ isApplyingPromo: false, promoError: messages[result.reason ?? 'invalid'] })
        }
      },

      removePromoCode: () => set({ promo: undefined, promoError: null }),

      // getTotals/getCart return a freshly-computed object every call — safe
      // for imperative reads (e.g. `useCartStore.getState().getTotals()`
      // inside an event handler), but NEVER pass them as a React selector
      // (`useCartStore(s => s.getTotals())`): a new object reference on
      // every render defeats useSyncExternalStore's snapshot comparison and
      // causes an infinite render loop. In components, select `items`/
      // `promo` directly and call `computeCartTotals(items, promo)` instead.
      getTotals: (extraDeliveryFee = 0) => computeCartTotals(get().items, get().promo, extraDeliveryFee),

      getCart: (extraDeliveryFee = 0) => {
        const { items, promo } = get()
        return { items, promo, ...computeCartTotals(items, promo, extraDeliveryFee) }
      },
    }),
    { name: 'farm-app-cart' },
  ),
)
