import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LocateFixed, Search, MapPinOff } from 'lucide-react'
import { OnboardingLayout } from './OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Chip } from '@/components/ui/Chip'
import { MapSelectorMock } from '@/components/domain/location/MapSelectorMock'
import { copy } from '@/config/copy'
import { addressLabels } from '@/config/categories.config'
import { useDebounce } from '@/hooks/useDebounce'
import { getCurrentLocation, searchAddress, checkDeliveryEligibility } from '@/services/location'
import type { AddressSuggestion } from '@/data/mock/addresses.seed'
import { useLocationStore } from '@/store/location.store'
import { useOnboardingStore } from '@/store/onboarding.store'
import type { AddressLabel } from '@/types/address'

export function LocationScreen() {
  const navigate = useNavigate()
  const addAddress = useLocationStore((s) => s.addAddress)
  const selectAddress = useLocationStore((s) => s.selectAddress)
  const setStep = useOnboardingStore((s) => s.setStep)
  const markCompleted = useOnboardingStore((s) => s.markCompleted)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<AddressSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const [selected, setSelected] = useState<AddressSuggestion | null>(null)
  const [landmark, setLandmark] = useState('')
  const [label, setLabel] = useState<AddressLabel>('Home')
  const [eligibility, setEligibility] = useState<{ eligible: boolean; etaMinutes?: number; reason?: string } | null>(null)

  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setResults([])
      return
    }
    setIsSearching(true)
    searchAddress(debouncedQuery).then((res) => {
      setResults(res)
      setIsSearching(false)
    })
  }, [debouncedQuery])

  useEffect(() => {
    if (!selected) return
    checkDeliveryEligibility(selected.deliveryZoneId).then(setEligibility)
  }, [selected])

  async function handleUseCurrentLocation() {
    setIsLocating(true)
    setPermissionDenied(false)
    const result = await getCurrentLocation()
    setIsLocating(false)
    if (!result.success || !result.suggestion) {
      setPermissionDenied(true)
      return
    }
    setSelected(result.suggestion)
  }

  function handleConfirm() {
    if (!selected) return
    const address = addAddress({
      label,
      line1: selected.line1,
      city: selected.city,
      region: selected.region,
      landmark: landmark.trim() || undefined,
      coordinates: selected.coordinates,
      deliveryZoneId: selected.deliveryZoneId,
      isDefault: true,
    })
    selectAddress(address.id)
    markCompleted()
    setStep('complete')
    navigate('/onboarding/complete')
  }

  if (selected) {
    return (
      <OnboardingLayout onBack={() => setSelected(null)} step={{ current: 3, total: 3 }}>
        <div className="flex flex-1 flex-col">
          <h1 className="text-h1 text-charcoal-900">{copy.onboarding.location.confirmTitle}</h1>

          <MapSelectorMock label={selected.label} className="mt-5" />

          <div className="mt-4 space-y-1">
            <p className="text-body-lg font-medium text-charcoal-900">{selected.description}</p>
            <p className="text-body text-charcoal-600">
              {selected.city}, {selected.region}
            </p>
          </div>

          {eligibility && !eligibility.eligible && (
            <p className="mt-3 rounded-md bg-warning-bg px-3 py-2 text-body text-warning">
              {eligibility.reason ?? copy.states.deliveryUnavailable.body}
            </p>
          )}
          {eligibility?.eligible && (
            <p className="mt-3 rounded-md bg-success-bg px-3 py-2 text-body text-success">
              Delivery available — estimated {eligibility.etaMinutes} min from our farm.
            </p>
          )}

          <div className="mt-5">
            <Input label="Landmark (optional)" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. near the blue gate" />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-body font-medium text-charcoal-800">{copy.onboarding.location.labelPrompt}</p>
            <div className="flex flex-wrap gap-2">
              {addressLabels.map((l) => (
                <Chip key={l} selected={label === l} onClick={() => setLabel(l)}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>

          <Button fullWidth className="mt-8" onClick={handleConfirm}>
            Confirm address
          </Button>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout onBack={() => navigate('/onboarding/profile')} step={{ current: 3, total: 3 }}>
      <div className="flex flex-1 flex-col">
        <h1 className="text-h1 text-charcoal-900">{copy.onboarding.location.title}</h1>
        <p className="mt-2 text-body-lg text-charcoal-600">{copy.onboarding.location.subtitle}</p>

        <Button variant="outline" fullWidth className="mt-6" leadingIcon={<LocateFixed className="h-4 w-4" />} isLoading={isLocating} onClick={handleUseCurrentLocation}>
          {copy.onboarding.location.useCurrentLocation}
        </Button>

        {permissionDenied && (
          <p className="mt-3 flex items-start gap-2 rounded-md bg-warning-bg px-3 py-2 text-body text-warning">
            <MapPinOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {copy.onboarding.location.permissionDenied}
          </p>
        )}

        <div className="mt-6">
          <Input
            label={copy.onboarding.location.manualEntry}
            hideLabel
            placeholder={copy.onboarding.location.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="mt-2 flex-1">
          {isSearching && <p className="px-1 py-3 text-body text-charcoal-500">Searching…</p>}
          {!isSearching && results.length > 0 && (
            <ul className="mt-1 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r)}
                    className="flex w-full flex-col items-start gap-0.5 px-3.5 py-3 text-left transition-colors hover:bg-cream-200 focus-visible:outline-none"
                  >
                    <span className="text-body-lg font-medium text-charcoal-900">{r.label}</span>
                    <span className="text-body text-charcoal-500">{r.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!isSearching && query.trim().length > 0 && results.length === 0 && (
            <p className="px-1 py-3 text-body text-charcoal-500">No matching addresses. Try a different area or landmark.</p>
          )}
        </div>
      </div>
    </OnboardingLayout>
  )
}
