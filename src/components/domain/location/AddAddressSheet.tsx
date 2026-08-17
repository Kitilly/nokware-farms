import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { Input } from '@/components/ui/Input'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { useDebounce } from '@/hooks/useDebounce'
import { searchAddress } from '@/services/location'
import { useLocationStore } from '@/store/location.store'
import { addressLabels } from '@/config/categories.config'
import type { AddressSuggestion } from '@/data/mock/addresses.seed'
import type { AddressLabel, Address } from '@/types/address'

interface AddAddressSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded?: (address: Address) => void
}

export function AddAddressSheet({ open, onOpenChange, onAdded }: AddAddressSheetProps) {
  const addAddress = useLocationStore((s) => s.addAddress)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<AddressSuggestion[]>([])
  const [selected, setSelected] = useState<AddressSuggestion | null>(null)
  const [label, setLabel] = useState<AddressLabel>('Home')
  const [landmark, setLandmark] = useState('')

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setSelected(null)
      setLandmark('')
    }
  }, [open])

  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setResults([])
      return
    }
    searchAddress(debouncedQuery).then(setResults)
  }, [debouncedQuery])

  function handleSave() {
    if (!selected) return
    const address = addAddress({
      label,
      line1: selected.line1,
      city: selected.city,
      region: selected.region,
      landmark: landmark.trim() || undefined,
      coordinates: selected.coordinates,
      deliveryZoneId: selected.deliveryZoneId,
      isDefault: false,
    })
    onAdded?.(address)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add new address"
      footer={
        selected ? (
          <Button fullWidth onClick={handleSave}>
            Save address
          </Button>
        ) : undefined
      }
    >
      {!selected ? (
        <div>
          <Input placeholder="Search for your address or landmark" value={query} onChange={(e) => setQuery(e.target.value)} leadingIcon={<Search className="h-4 w-4" />} />
          {results.length > 0 && (
            <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r)}
                    className="flex w-full flex-col items-start gap-0.5 px-3.5 py-3 text-left hover:bg-cream-200"
                  >
                    <span className="text-body-lg font-medium text-charcoal-900">{r.label}</span>
                    <span className="text-body text-charcoal-500">{r.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md bg-cream-200 px-3.5 py-3">
            <p className="text-body-lg font-medium text-charcoal-900">{selected.description}</p>
            <p className="text-body text-charcoal-600">
              {selected.city}, {selected.region}
            </p>
          </div>
          <Input label="Landmark (optional)" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. near the blue gate" />
          <div>
            <p className="mb-2 text-body font-medium text-charcoal-800">Save this address as</p>
            <div className="flex flex-wrap gap-2">
              {addressLabels.map((l) => (
                <Chip key={l} selected={label === l} onClick={() => setLabel(l)}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}
    </Sheet>
  )
}
