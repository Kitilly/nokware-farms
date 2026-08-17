import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SettingsRowProps {
  icon?: ReactNode
  label: string
  description?: string
  to?: string
  onClick?: () => void
  trailing?: ReactNode
  destructive?: boolean
}

export function SettingsRow({ icon, label, description, to, onClick, trailing, destructive }: SettingsRowProps) {
  const content = (
    <>
      {icon && <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-200', destructive && 'bg-error-bg')}>{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className={cn('text-body-lg font-medium', destructive ? 'text-error' : 'text-charcoal-900')}>{label}</p>
        {description && <p className="text-body text-charcoal-500">{description}</p>}
      </div>
      {trailing ?? (to || onClick ? <ChevronRight className="h-4 w-4 shrink-0 text-charcoal-400" aria-hidden="true" /> : null)}
    </>
  )

  const className = 'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-cream-200 focus-visible:outline-none'

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
