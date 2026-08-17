import { useState } from 'react'
import { Chip } from '@/components/ui/Chip'
import type { WeightOption } from '@/types/product'

interface WeightSelectorProps {
  weightOptions: WeightOption[]
  allowsCustomWeight: boolean
  customWeightRangeKg?: { min: number; max: number; stepKg: number }
  selectedOptionId?: string
  customWeightKg?: number
  onSelectPreset: (option: WeightOption) => void
  onSelectCustom: (kg: number) => void
}

export function WeightSelector({
  weightOptions,
  allowsCustomWeight,
  customWeightRangeKg,
  selectedOptionId,
  customWeightKg,
  onSelectPreset,
  onSelectCustom,
}: WeightSelectorProps) {
  const [showCustom, setShowCustom] = useState(Boolean(customWeightKg))

  if (weightOptions.length === 0 && !allowsCustomWeight) return null

  return (
    <div>
      <p className="mb-2 text-body font-medium text-charcoal-800">Weight</p>
      <div className="flex flex-wrap gap-2">
        {weightOptions.map((opt) => (
          <Chip
            key={opt.id}
            selected={!showCustom && selectedOptionId === opt.id}
            onClick={() => {
              setShowCustom(false)
              onSelectPreset(opt)
            }}
          >
            {opt.label}
          </Chip>
        ))}
        {allowsCustomWeight && (
          <Chip selected={showCustom} onClick={() => setShowCustom(true)}>
            Custom
          </Chip>
        )}
      </div>

      {showCustom && customWeightRangeKg && (
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min={customWeightRangeKg.min}
            max={customWeightRangeKg.max}
            step={customWeightRangeKg.stepKg}
            value={customWeightKg ?? customWeightRangeKg.min}
            onChange={(e) => onSelectCustom(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-cream-300 accent-forest-600"
          />
          <span className="w-16 shrink-0 text-body-lg font-medium text-charcoal-900">
            {(customWeightKg ?? customWeightRangeKg.min).toFixed(2)}kg
          </span>
        </div>
      )}
    </div>
  )
}
