import type { ReactNode } from 'react'
import { AlertTriangle, WifiOff } from 'lucide-react'
import { StateLayout } from './StateLayout'

interface ErrorStateProps {
  title: string
  body?: string
  action?: ReactNode
  variant?: 'error' | 'offline'
  className?: string
}

export function ErrorState({ title, body, action, variant = 'error', className }: ErrorStateProps) {
  const Icon = variant === 'offline' ? WifiOff : AlertTriangle

  return (
    <StateLayout
      icon={<Icon className="h-7 w-7 text-error" aria-hidden="true" />}
      iconToneClass="bg-error-bg"
      title={title}
      body={body}
      action={action}
      className={className}
    />
  )
}
