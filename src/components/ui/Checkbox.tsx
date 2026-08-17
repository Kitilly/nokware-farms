import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  id?: string
  disabled?: boolean
  className?: string
}

export function Checkbox({ checked, onCheckedChange, label, id, disabled, className }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      id={id}
      checked={checked}
      onCheckedChange={(state) => onCheckedChange(state === true)}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-border-strong bg-cream-50',
        'transition-colors duration-150 focus-visible:outline-none data-[state=checked]:border-forest-600 data-[state=checked]:bg-forest-600',
        disabled && 'opacity-50',
        className,
      )}
    >
      <RadixCheckbox.Indicator>
        <Check className="h-3.5 w-3.5 text-cream-50" strokeWidth={3} aria-hidden="true" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
}
