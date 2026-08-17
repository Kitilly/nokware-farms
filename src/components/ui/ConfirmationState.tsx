import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { StateLayout } from './StateLayout'

interface ConfirmationStateProps {
  title: string
  body?: string
  action?: ReactNode
  className?: string
}

export function ConfirmationState({ title, body, action, className }: ConfirmationStateProps) {
  return (
    <StateLayout
      icon={<CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />}
      iconToneClass="bg-success-bg"
      title={title}
      body={body}
      action={action}
      className={className}
    />
  )
}
