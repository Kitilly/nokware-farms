import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  side?: 'bottom' | 'right'
  hideTitle?: boolean
}

/**
 * Renders as a bottom sheet on mobile widths and a right-side panel from the
 * `md` breakpoint up (via the `side="right"` variant), sharing one
 * implementation so filters/pickers behave consistently across breakpoints.
 */
export function Sheet({ open, onOpenChange, title, description, children, footer, side = 'bottom', hideTitle }: SheetProps) {
  const positionClasses =
    side === 'bottom'
      ? 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:h-full md:w-[420px] md:rounded-t-none md:rounded-l-xl'
      : 'inset-y-0 right-0 h-full w-full max-w-[420px] rounded-l-xl'

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-charcoal-900/40" />
        <RadixDialog.Content
          className={cn(
            'fixed z-50 flex flex-col border border-border bg-cream-50 shadow-lg focus-visible:outline-none',
            positionClasses,
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border p-4">
            <div>
              <RadixDialog.Title className={cn('text-h3 text-charcoal-900', hideTitle && 'sr-only')}>{title}</RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="mt-1 text-body text-charcoal-600">{description}</RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              aria-label="Close"
              className="shrink-0 rounded-full p-1.5 text-charcoal-500 transition-colors hover:bg-cream-200 focus-visible:outline-none"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
          {footer && <div className="border-t border-border p-4">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
