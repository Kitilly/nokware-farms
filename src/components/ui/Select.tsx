import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Select = RadixSelect.Root

interface SelectTriggerProps {
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export function SelectTrigger({ placeholder, className, ...props }: SelectTriggerProps) {
  return (
    <RadixSelect.Trigger
      className={cn(
        'flex h-11 w-full items-center justify-between gap-2 rounded-md border border-border-strong bg-cream-50 px-3.5 text-body-lg text-charcoal-900',
        'transition-colors duration-150 focus-visible:outline-none focus-visible:border-forest-500 data-[placeholder]:text-charcoal-400',
        className,
      )}
      {...props}
    >
      <RadixSelect.Value placeholder={placeholder} />
      <RadixSelect.Icon>
        <ChevronDown className="h-4 w-4 text-charcoal-500" aria-hidden="true" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  )
}

export function SelectContent({ children, className, ...props }: RadixSelect.SelectContentProps) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        position="popper"
        sideOffset={6}
        className={cn('z-50 max-h-72 min-w-[--radix-select-trigger-width] rounded-lg border border-border bg-cream-50 shadow-md', className)}
        {...props}
      >
        <RadixSelect.Viewport className="p-1.5">{children}</RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
}

export function SelectItem({ children, className, ...props }: RadixSelect.SelectItemProps) {
  return (
    <RadixSelect.Item
      className={cn(
        'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-body-lg text-charcoal-800',
        'transition-colors focus-visible:outline-none data-[highlighted]:bg-cream-200',
        className,
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator>
        <Check className="h-4 w-4 text-forest-600" aria-hidden="true" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
