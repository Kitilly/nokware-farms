import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPinOff, Plus } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { AddressListItem } from '@/components/domain/account/AddressListItem'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useLocationStore } from '@/store/location.store'

export function AddressesPage() {
  const navigate = useNavigate()
  const savedAddresses = useLocationStore((s) => s.savedAddresses)
  const setDefaultAddress = useLocationStore((s) => s.setDefaultAddress)
  const removeAddress = useLocationStore((s) => s.removeAddress)

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Addresses</h1>

        {savedAddresses.length === 0 ? (
          <EmptyState
            icon={<MapPinOff className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
            title="No saved addresses"
            body="Add an address for faster checkout."
            action={<Button onClick={() => navigate('/account/addresses/new')}>Add address</Button>}
            className="pt-10"
          />
        ) : (
          <div className="mt-5 space-y-3">
            {savedAddresses.map((a) => (
              <AddressListItem key={a.id} address={a} onSetDefault={() => setDefaultAddress(a.id)} onDelete={() => removeAddress(a.id)} />
            ))}
            <Button variant="outline" fullWidth leadingIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/account/addresses/new')}>
              Add new address
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
