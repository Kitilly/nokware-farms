import { formatPriceParts, formatMoney } from '@/lib/currency'
import { cn } from '@/lib/utils'
import type { PriceUnit } from '@/types/product'

interface PriceDisplayProps {
  amount: number
  unit: PriceUnit
  size?: 'sm' | 'md' | 'lg'
  isPending?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'text-body font-semibold',
  md: 'text-body-lg font-semibold',
  lg: 'text-h2 font-semibold',
}

export function PriceDisplay({ amount, unit, size = 'md', isPending, className }: PriceDisplayProps) {
  const parts = formatPriceParts(amount, unit)
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-1.5', className)}>
      <span className={cn(sizeClasses[size], 'whitespace-nowrap text-charcoal-900 tabular-nums')}>
        {parts.prefix && <span className="font-normal text-charcoal-500">{parts.prefix}</span>}
        {parts.amount}
        <span className="text-[0.8em] font-normal text-charcoal-500">{parts.suffix}</span>
      </span>
      {isPending && <span className="text-caption text-charcoal-500">(estimated)</span>}
    </span>
  )
}

interface ItemTotalDisplayProps {
  amount: number
  isPending?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ItemTotalDisplay({ amount, isPending, size = 'md', className }: ItemTotalDisplayProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className={cn(sizeClasses[size], 'text-charcoal-900')}>{formatMoney(amount)}</span>
      {isPending && <span className="text-caption text-charcoal-500">(estimated)</span>}
    </span>
  )
}
