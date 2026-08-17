import { useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Checkbox } from '@/components/ui/Checkbox'
import type { AvailabilityStatus, ProductFilters } from '@/types/product'

export interface ShopFilterValues {
  liveOrProcessed?: 'live' | 'processed'
  priceMin?: number
  priceMax?: number
  weightMin?: number
  weightMax?: number
  availability?: AvailabilityStatus[]
  freshOnly?: boolean
}

const availabilityOptions: { value: AvailabilityStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'pre-order', label: 'Pre-order' },
  { value: 'seasonal', label: 'Seasonal' },
]

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: ShopFilterValues
  onApply: (value: ShopFilterValues) => void
  showLiveProcessedToggle?: boolean
}

export function FilterSheet({ open, onOpenChange, value, onApply, showLiveProcessedToggle }: FilterSheetProps) {
  const [draft, setDraft] = useState<ShopFilterValues>(value)

  function toggleAvailability(status: AvailabilityStatus) {
    const current = draft.availability ?? []
    setDraft({
      ...draft,
      availability: current.includes(status) ? current.filter((s) => s !== status) : [...current, status],
    })
  }

  function handleReset() {
    setDraft({})
    onApply({})
    onOpenChange(false)
  }

  function handleApply() {
    onApply(draft)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(value)
        onOpenChange(next)
      }}
      title="Filters"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={handleReset}>
            Reset
          </Button>
          <Button fullWidth onClick={handleApply}>
            Show results
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {showLiveProcessedToggle && (
          <div>
            <p className="mb-2 text-body font-medium text-charcoal-800">Type</p>
            <div className="flex gap-2">
              <Chip selected={!draft.liveOrProcessed} onClick={() => setDraft({ ...draft, liveOrProcessed: undefined })}>
                All
              </Chip>
              <Chip selected={draft.liveOrProcessed === 'live'} onClick={() => setDraft({ ...draft, liveOrProcessed: 'live' })}>
                Live animal
              </Chip>
              <Chip selected={draft.liveOrProcessed === 'processed'} onClick={() => setDraft({ ...draft, liveOrProcessed: 'processed' })}>
                Processed
              </Chip>
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-body font-medium text-charcoal-800">Availability</p>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((opt) => (
              <Chip key={opt.value} selected={(draft.availability ?? []).includes(opt.value)} onClick={() => toggleAvailability(opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-body font-medium text-charcoal-800">Price range (GHS)</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              value={draft.priceMin ?? ''}
              onChange={(e) => setDraft({ ...draft, priceMin: e.target.value ? Number(e.target.value) : undefined })}
              className="h-11 w-full rounded-md border border-border-strong bg-cream-50 px-3.5 text-body-lg text-charcoal-900 focus-visible:outline-none focus-visible:border-forest-500"
            />
            <span className="text-charcoal-400">–</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Max"
              value={draft.priceMax ?? ''}
              onChange={(e) => setDraft({ ...draft, priceMax: e.target.value ? Number(e.target.value) : undefined })}
              className="h-11 w-full rounded-md border border-border-strong bg-cream-50 px-3.5 text-body-lg text-charcoal-900 focus-visible:outline-none focus-visible:border-forest-500"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-body font-medium text-charcoal-800">Weight range (kg)</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              value={draft.weightMin ?? ''}
              onChange={(e) => setDraft({ ...draft, weightMin: e.target.value ? Number(e.target.value) : undefined })}
              className="h-11 w-full rounded-md border border-border-strong bg-cream-50 px-3.5 text-body-lg text-charcoal-900 focus-visible:outline-none focus-visible:border-forest-500"
            />
            <span className="text-charcoal-400">–</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Max"
              value={draft.weightMax ?? ''}
              onChange={(e) => setDraft({ ...draft, weightMax: e.target.value ? Number(e.target.value) : undefined })}
              className="h-11 w-full rounded-md border border-border-strong bg-cream-50 px-3.5 text-body-lg text-charcoal-900 focus-visible:outline-none focus-visible:border-forest-500"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox checked={Boolean(draft.freshOnly)} onCheckedChange={(checked) => setDraft({ ...draft, freshOnly: checked })} label="Freshly processed only" />
          <span className="text-body-lg text-charcoal-800">Freshly processed only</span>
        </label>
      </div>
    </Sheet>
  )
}

export function toProductFilters(shop: ShopFilterValues): Partial<ProductFilters> {
  return {
    liveOrProcessed: shop.liveOrProcessed,
    priceMin: shop.priceMin,
    priceMax: shop.priceMax,
    weightMin: shop.weightMin,
    weightMax: shop.weightMax,
    availability: shop.availability,
    freshOnly: shop.freshOnly,
  }
}
