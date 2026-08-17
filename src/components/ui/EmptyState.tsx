import type { ReactNode } from 'react'
import { PackageOpen } from 'lucide-react'
import { StateLayout } from './StateLayout'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  body?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <StateLayout
      icon={icon ?? <PackageOpen className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
      title={title}
      body={body}
      action={action}
      className={className}
    />
  )
}
