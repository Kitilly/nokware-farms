import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface StatusBadgeProps {
  tone: StatusTone
  label: string
  icon?: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  error: 'bg-error-bg text-error',
  info: 'bg-info-bg text-info',
  neutral: 'bg-cream-200 text-charcoal-700',
}

// Icon is required visually (not just passed) whenever provided, so status
// never relies on color alone to communicate meaning.
export function StatusBadge({ tone, label, icon, size = 'md', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-caption' : 'px-2.5 py-1 text-body',
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  )
}
