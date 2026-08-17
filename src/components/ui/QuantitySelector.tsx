import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', className }: QuantitySelectorProps) {
  const canDecrease = value > min
  const canIncrease = value < max

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border-strong bg-cream-50',
        size === 'sm' ? 'h-8' : 'h-10',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          'flex h-full items-center justify-center rounded-l-full text-charcoal-700 transition-colors',
          'focus-visible:outline-none hover:bg-cream-200 disabled:text-charcoal-300 disabled:hover:bg-transparent',
          size === 'sm' ? 'w-8' : 'w-10',
        )}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        className={cn('flex min-w-[2rem] items-center justify-center text-center font-semibold text-charcoal-900', size === 'sm' ? 'text-body' : 'text-body-lg')}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={!canIncrease}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          'flex h-full items-center justify-center rounded-r-full text-charcoal-700 transition-colors',
          'focus-visible:outline-none hover:bg-cream-200 disabled:text-charcoal-300 disabled:hover:bg-transparent',
          size === 'sm' ? 'w-8' : 'w-10',
        )}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
