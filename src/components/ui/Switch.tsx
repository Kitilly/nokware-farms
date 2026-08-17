import * as RadixSwitch from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export function Switch({ checked, onCheckedChange, label, disabled, id }: SwitchProps) {
  return (
    <RadixSwitch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150',
        'focus-visible:outline-none data-[state=checked]:bg-forest-600 data-[state=unchecked]:bg-charcoal-200',
        disabled && 'opacity-50',
      )}
    >
      <RadixSwitch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-cream-50 shadow-sm transition-transform duration-150 will-change-transform data-[state=checked]:translate-x-[22px]" />
    </RadixSwitch.Root>
  )
}
