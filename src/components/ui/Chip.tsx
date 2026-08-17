import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  icon?: ReactNode
}

export function Chip({ selected, icon, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-body font-medium',
        'transition-colors duration-150 focus-visible:outline-none',
        selected
          ? 'border-forest-600 bg-forest-600 text-cream-50'
          : 'border-border-strong bg-cream-50 text-charcoal-700 hover:bg-cream-200',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
