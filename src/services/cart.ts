import { mockRequest } from './_client'
import { getProductById } from '@/data/mock/products'
import { findPromoByCode, isPromoExpired } from '@/data/mock/promos'
import type { Cart, CartItem, CartPromo } from '@/types/cart'

export interface CartValidationIssue {
  itemId: string
  reason: string
}

export function validateCart(items: CartItem[]): Promise<{ valid: boolean; issues: CartValidationIssue[] }> {
  return mockRequest(() => {
    const issues: CartValidationIssue[] = []
    for (const item of items) {
      if (item.savedForLater) continue
      const product = getProductById(item.productId)
      if (!product) {
        issues.push({ itemId: item.id, reason: 'This product is no longer available.' })
        continue
      }
      if (product.availability === 'unavailable') {
        issues.push({ itemId: item.id, reason: `${product.name} is currently unavailable.` })
        continue
      }
      if (product.stock !== null && item.quantity > product.stock) {
        issues.push({ itemId: item.id, reason: `Only ${product.stock} of ${product.name} left in stock.` })
      }
    }
    return { valid: issues.length === 0, issues }
  })
}

export interface ApplyPromoResult {
  success: boolean
  promo?: CartPromo
  reason?: 'invalid' | 'expired' | 'minimum-not-met' | 'already-applied'
}

export function applyPromo(code: string, cart: Cart): Promise<ApplyPromoResult> {
  return mockRequest(() => {
    if (cart.promo) return { success: false, reason: 'already-applied' as const }

    const promo = findPromoByCode(code)
    if (!promo) return { success: false, reason: 'invalid' as const }
    if (isPromoExpired(promo)) return { success: false, reason: 'expired' as const }
    if (promo.minimumSpend && cart.subtotal < promo.minimumSpend) {
      return { success: false, reason: 'minimum-not-met' as const }
    }

    const appliedAmount =
      promo.discountType === 'percentage' ? Math.round((cart.subtotal * promo.discountValue) / 100) : promo.discountValue

    return {
      success: true,
      promo: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        appliedAmount,
      },
    }
  })
}

export function removePromo(cart: Cart): Promise<Cart> {
  return mockRequest(() => {
    const { promo: _removed, ...rest } = cart
    return { ...rest, discount: 0 }
  })
}
