import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Input } from '@/components/ui/Input'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { useDebounce } from '@/hooks/useDebounce'
import { searchAddress } from '@/services/location'
import { useLocationStore } from '@/store/location.store'
import { addressLabels } from '@/config/categories.config'
import type { AddressSuggestion } from '@/data/mock/addresses.seed'
import type { AddressLabel } from '@/types/address'

export function AddressFormPage() {
  const navigate = useNavigate()
  const { addressId } = useParams<{ addressId: string }>()
  const savedAddresses = useLocationStore((s) => s.savedAddresses)
  const addAddress = useLocationStore((s) => s.addAddress)
  const updateAddress = useLocationStore((s) => s.updateAddress)

  const editingAddress = addressId ? savedAddresses.find((a) => a.id === addressId) : undefined
  const isEditMode = Boolean(editingAddress)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<AddressSuggestion[]>([])
  const [selected, setSelected] = useState<AddressSuggestion | null>(null)
  const [label, setLabel] = useState<AddressLabel>(editingAddress?.label ?? 'Home')
  const [landmark, setLandmark] = useState(editingAddress?.landmark ?? '')

  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setResults([])
      return
    }
    searchAddress(debouncedQuery).then(setResults)
  }, [debouncedQuery])

  function handleSave() {
    if (isEditMode && editingAddress) {
      updateAddress(editingAddress.id, { label, landmark: landmark.trim() || undefined })
      toast.success('Address updated')
      navigate('/account/addresses')
      return
    }
    if (!selected) return
    addAddress({
      label,
      line1: selected.line1,
      city: selected.city,
      region: selected.region,
      landmark: landmark.trim() || undefined,
      coordinates: selected.coordinates,
      deliveryZoneId: selected.deliveryZoneId,
      isDefault: false,
    })
    toast.success('Address added')
    navigate('/account/addresses')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/addresses')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Addresses
        </button>
        <h1 className="text-h1 text-charcoal-900">{isEditMode ? 'Edit address' : 'Add address'}</h1>

        {!isEditMode && !selected && (
          <div className="mt-5">
            <Input placeholder="Search for your address or landmark" value={query} onChange={(e) => setQuery(e.target.value)} leadingIcon={<Search className="h-4 w-4" />} autoFocus />
            {results.length > 0 && (
              <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border">
                {results.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => setSelected(r)} className="flex w-full flex-col items-start gap-0.5 px-3.5 py-3 text-left hover:bg-cream-200">
                      <span className="text-body-lg font-medium text-charcoal-900">{r.label}</span>
                      <span className="text-body text-charcoal-500">{r.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(isEditMode || selected) && (
          <div className="mt-5 space-y-4">
            <div className="rounded-md bg-cream-200 px-3.5 py-3">
              <p className="text-body-lg font-medium text-charcoal-900">{editingAddress ? editingAddress.line1 : selected!.description}</p>
              <p className="text-body text-charcoal-600">{editingAddress ? `${editingAddress.city}, ${editingAddress.region}` : `${selected!.city}, ${selected!.region}`}</p>
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
            <Button fullWidth size="lg" onClick={handleSave}>
              Save address
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
