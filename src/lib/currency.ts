import { appConfig } from '@/config/app.config'
import type { PriceUnit } from '@/types/product'

const formatter = new Intl.NumberFormat(appConfig.currency.locale, {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatMoney(amount: number): string {
  return `${appConfig.currency.symbol} ${formatter.format(amount)}`
}

const priceUnitSuffix: Record<PriceUnit, string> = {
  'per-kg': '/kg',
  'from-per-kg': '/kg',
  'per-pack': ' per pack',
  'per-piece': ' per piece',
  'per-animal': ' per animal',
  'per-pair': ' per pair',
}

/**
 * Renders a price with an explicit, unambiguous unit — e.g. "GHS 32/kg",
 * "GHS 95 per pack", "GHS 1,450 per animal", "From GHS 30/kg".
 */
export function formatPriceWithUnit(amount: number, unit: PriceUnit): string {
  const prefix = unit === 'from-per-kg' ? 'From ' : ''
  return `${prefix}${formatMoney(amount)}${priceUnitSuffix[unit]}`
}
