import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

export const RadioGroup = RadixRadioGroup.Root

interface RadioItemProps {
  value: string
  id: string
  disabled?: boolean
  className?: string
}

export function RadioItem({ value, id, disabled, className }: RadioItemProps) {
  return (
    <RadixRadioGroup.Item
      value={value}
      id={id}
      disabled={disabled}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-border-strong',
        'transition-colors duration-150 focus-visible:outline-none data-[state=checked]:border-forest-600',
        disabled && 'opacity-50',
        className,
      )}
    >
      <RadixRadioGroup.Indicator className="h-2.5 w-2.5 rounded-full bg-forest-600" />
    </RadixRadioGroup.Item>
  )
}
