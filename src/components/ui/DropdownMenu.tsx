import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DropdownMenu = RadixDropdown.Root
export const DropdownMenuTrigger = RadixDropdown.Trigger

export function DropdownMenuContent({ className, ...props }: RadixDropdown.DropdownMenuContentProps) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        sideOffset={6}
        align="end"
        className={cn(
          'z-50 min-w-[200px] rounded-lg border border-border bg-cream-50 p-1.5 shadow-md focus-visible:outline-none',
          className,
        )}
        {...props}
      />
    </RadixDropdown.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: RadixDropdown.DropdownMenuItemProps) {
  return (
    <RadixDropdown.Item
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-body-lg text-charcoal-800',
        'transition-colors focus-visible:outline-none data-[highlighted]:bg-cream-200',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuRadioItem({ className, children, ...props }: RadixDropdown.DropdownMenuRadioItemProps) {
  return (
    <RadixDropdown.RadioItem
      className={cn(
        'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-body-lg text-charcoal-800',
        'transition-colors focus-visible:outline-none data-[highlighted]:bg-cream-200',
        className,
      )}
      {...props}
    >
      {children}
      <RadixDropdown.ItemIndicator>
        <Check className="h-4 w-4 text-forest-600" aria-hidden="true" />
      </RadixDropdown.ItemIndicator>
    </RadixDropdown.RadioItem>
  )
}

export const DropdownMenuRadioGroup = RadixDropdown.RadioGroup
export const DropdownMenuSeparator = ({ className, ...props }: RadixDropdown.DropdownMenuSeparatorProps) => (
  <RadixDropdown.Separator className={cn('my-1.5 h-px bg-border', className)} {...props} />
)
