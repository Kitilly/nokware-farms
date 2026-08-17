import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  hideTitle?: boolean
}

export function Dialog({ open, onOpenChange, title, description, children, className, hideTitle }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-charcoal-900/40" />
        <RadixDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-xl border border-border bg-cream-50 p-5 shadow-lg focus-visible:outline-none',
            className,
          )}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <RadixDialog.Title className={cn('text-h3 text-charcoal-900', hideTitle && 'sr-only')}>{title}</RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="mt-1 text-body text-charcoal-600">{description}</RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              aria-label="Close dialog"
              className="shrink-0 rounded-full p-1.5 text-charcoal-500 transition-colors hover:bg-cream-200 focus-visible:outline-none"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
