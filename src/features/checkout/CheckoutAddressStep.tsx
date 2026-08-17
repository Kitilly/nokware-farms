import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { AddressCard } from '@/components/domain/checkout/AddressCard'
import { AddAddressSheet } from '@/components/domain/location/AddAddressSheet'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useLocationStore } from '@/store/location.store'
import { useCheckoutStore } from '@/store/checkout.store'
import { MapPinOff } from 'lucide-react'

export function CheckoutAddressStep() {
  const navigate = useNavigate()
  const savedAddresses = useLocationStore((s) => s.savedAddresses)
  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId)
  const setSelectedAddressId = useCheckoutStore((s) => s.setSelectedAddressId)
  const [addOpen, setAddOpen] = useState(false)

  const activeId = selectedAddressId ?? savedAddresses.find((a) => a.isDefault)?.id ?? savedAddresses[0]?.id

  function handleContinue() {
    if (!activeId) return
    setSelectedAddressId(activeId)
    navigate('/checkout/fulfillment')
  }

  return (
    <div>
      <h1 className="text-h2 text-charcoal-900">Delivery address</h1>
      <p className="mt-1 text-body-lg text-charcoal-600">Choose where you’d like your order delivered.</p>

      {savedAddresses.length === 0 ? (
        <EmptyState
          icon={<MapPinOff className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
          title="No saved addresses"
          body="Add an address to continue with checkout."
          action={<Button onClick={() => setAddOpen(true)}>Add address</Button>}
          className="mt-6"
        />
      ) : (
        <div className="mt-5 space-y-2.5">
          {savedAddresses.map((a) => (
            <AddressCard key={a.id} address={a} selected={a.id === activeId} onSelect={() => setSelectedAddressId(a.id)} />
          ))}
          <Button variant="outline" fullWidth leadingIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
            Add new address
          </Button>
        </div>
      )}

      <Button fullWidth size="lg" className="mt-8" disabled={!activeId} onClick={handleContinue}>
        Continue
      </Button>

      <AddAddressSheet open={addOpen} onOpenChange={setAddOpen} onAdded={(addr) => setSelectedAddressId(addr.id)} />
    </div>
  )
}
