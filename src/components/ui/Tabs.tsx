import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root

export function TabsList({ className, ...props }: RadixTabs.TabsListProps) {
  return (
    <RadixTabs.List
      className={cn('inline-flex items-center gap-1 rounded-full bg-cream-200 p-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: RadixTabs.TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'rounded-full px-4 py-2 text-body font-medium text-charcoal-600 transition-colors duration-150',
        'focus-visible:outline-none data-[state=active]:bg-forest-600 data-[state=active]:text-cream-50',
        'hover:text-charcoal-900 data-[state=active]:hover:text-cream-50',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: RadixTabs.TabsContentProps) {
  return <RadixTabs.Content className={cn('focus-visible:outline-none', className)} {...props} />
}
