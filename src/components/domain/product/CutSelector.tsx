import { Chip } from '@/components/ui/Chip'
import type { CutOption } from '@/types/product'

interface CutSelectorProps {
  cuts: CutOption[]
  selectedId?: string
  onSelect: (cut: CutOption) => void
}

export function CutSelector({ cuts, selectedId, onSelect }: CutSelectorProps) {
  if (cuts.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-body font-medium text-charcoal-800">Cut</p>
      <div className="flex flex-wrap gap-2">
        {cuts.map((cut) => (
          <Chip key={cut.id} selected={selectedId === cut.id} onClick={() => onSelect(cut)}>
            {cut.name}
            {cut.priceModifier ? ` (+GHS ${cut.priceModifier})` : ''}
          </Chip>
        ))}
      </div>
    </div>
  )
}
