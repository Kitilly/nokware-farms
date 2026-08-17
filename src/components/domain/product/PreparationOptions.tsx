import { Checkbox } from '@/components/ui/Checkbox'
import type { PreparationOption } from '@/types/product'

interface PreparationOptionsProps {
  options: PreparationOption[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function PreparationOptions({ options, selectedIds, onToggle }: PreparationOptionsProps) {
  if (options.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-body font-medium text-charcoal-800">Preparation</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.id} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border px-3 py-2.5 hover:bg-cream-200">
            <Checkbox checked={selectedIds.includes(opt.id)} onCheckedChange={() => onToggle(opt.id)} label={opt.label} />
            <span className="text-body-lg text-charcoal-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
