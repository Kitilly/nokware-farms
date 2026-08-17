import { isLiveAnimal, isMeatProduct } from '@/types/product'
import type { Product } from '@/types/product'
import type { CartItemSelection } from '@/types/cart'

/**
 * Single source of truth for turning a product + selection into a unit
 * price. Live animals and fixed-pack meat products charge the listed price
 * per unit; per-kg / estimated / final-weighed meat products charge
 * price-per-kg × selected weight. Used identically on the product page, in
 * the cart, and at checkout so a displayed estimate never drifts from the
 * amount actually charged.
 */
export function computeUnitPrice(product: Product, selection: CartItemSelection): number {
  if (isLiveAnimal(product)) return product.price

  if (isMeatProduct(product)) {
    if (product.pricingModel === 'fixed') return product.price

    const weightKg = resolveWeightKg(product, selection)
    const cutModifier = selection.cutId
      ? (product.cuts.find((c) => c.id === selection.cutId)?.priceModifier ?? 0)
      : 0

    return Math.round((product.price * weightKg + cutModifier) * 100) / 100
  }

  return product
}

export function resolveWeightKg(product: Product, selection: CartItemSelection): number {
  if (!isMeatProduct(product)) return 1
  if (selection.customWeightKg !== undefined) return selection.customWeightKg
  if (selection.weightOptionId) {
    const match = product.weightOptions.find((w) => w.id === selection.weightOptionId)
    if (match) return match.kg
  }
  const defaultOption = product.weightOptions.find((w) => w.isDefault) ?? product.weightOptions[0]
  return defaultOption?.kg ?? 1
}

export function computeItemTotal(product: Product, selection: CartItemSelection, quantity: number): number {
  return Math.round(computeUnitPrice(product, selection) * quantity * 100) / 100
}

export function isPricePending(product: Product): boolean {
  return isMeatProduct(product) && (product.pricingModel === 'estimated' || product.pricingModel === 'final-weighed')
}
