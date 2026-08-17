import type { Cart, CartItem, CartPromo } from '@/types/cart'

export const BASE_DELIVERY_FEE = 15

export interface CartTotals {
  subtotal: number
  deliveryFee: number
  serviceCharge: number
  tax: number
  discount: number
  total: number
}

/**
 * The single place cart totals are computed — reused by the cart page,
 * checkout summary, and order creation so a displayed total never drifts
 * from the amount actually charged.
 */
export function computeCartTotals(items: CartItem[], promo?: CartPromo, extraDeliveryFee = 0): CartTotals {
  const activeItems = items.filter((i) => !i.savedForLater)
  const subtotal = activeItems.reduce((sum, i) => sum + i.itemTotal, 0)
  const hasDeliveryItems = activeItems.some((i) => i.fulfillmentTypes.includes('delivery'))
  const deliveryFee = activeItems.length === 0 ? 0 : hasDeliveryItems ? BASE_DELIVERY_FEE + extraDeliveryFee : 0
  const serviceCharge = 0
  const tax = 0
  const discount = promo ? Math.min(promo.appliedAmount, subtotal) : 0
  const total = Math.max(0, subtotal + deliveryFee + serviceCharge + tax - discount)

  return { subtotal, deliveryFee, serviceCharge, tax, discount, total }
}

export function buildCart(items: CartItem[], promo?: CartPromo, extraDeliveryFee = 0): Cart {
  return { items, promo, ...computeCartTotals(items, promo, extraDeliveryFee) }
}

export function activeCartItems(items: CartItem[]): CartItem[] {
  return items.filter((i) => !i.savedForLater)
}

export function cartItemCount(items: CartItem[]): number {
  return activeCartItems(items).reduce((sum, i) => sum + i.quantity, 0)
}
