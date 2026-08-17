import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StateLayoutProps {
  icon: ReactNode
  title: string
  body?: string
  action?: ReactNode
  iconToneClass?: string
  className?: string
}

export function StateLayout({ icon, title, body, action, iconToneClass, className }: StateLayoutProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className={cn('mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-200', iconToneClass)}>
        {icon}
      </div>
      <h3 className="text-h3 text-charcoal-900">{title}</h3>
      {body && <p className="mt-1.5 max-w-xs text-body-lg text-charcoal-600">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
