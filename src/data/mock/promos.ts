import type { Promo } from '@/types/promo'

export const promos: Promo[] = [
  {
    code: 'WELCOME10',
    description: '10% off your first order',
    discountType: 'percentage',
    discountValue: 10,
    minimumSpend: 50,
    usageLimitPerUser: 1,
  },
  {
    code: 'FARM50',
    description: 'GHS 50 off orders above GHS 500',
    discountType: 'flat',
    discountValue: 50,
    minimumSpend: 500,
  },
  {
    code: 'EXPIRED2025',
    description: 'Expired promotional code',
    discountType: 'percentage',
    discountValue: 15,
    expiresAt: '2025-12-31T23:59:59Z',
  },
]

export function findPromoByCode(code: string): Promo | undefined {
  return promos.find((p) => p.code.toLowerCase() === code.trim().toLowerCase())
}

export function isPromoExpired(promo: Promo): boolean {
  if (!promo.expiresAt) return false
  return new Date(promo.expiresAt).getTime() < Date.now()
}
