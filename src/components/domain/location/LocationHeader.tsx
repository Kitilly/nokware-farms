import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, MapPin, Plus } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { useLocationStore } from '@/store/location.store'
import { cn } from '@/lib/utils'

export function LocationHeader({ className }: { className?: string }) {
  const navigate = useNavigate()
  const savedAddresses = useLocationStore((s) => s.savedAddresses)
  const selectedAddressId = useLocationStore((s) => s.selectedAddressId)
  const selectAddress = useLocationStore((s) => s.selectAddress)
  const [open, setOpen] = useState(false)

  const selected = savedAddresses.find((a) => a.id === selectedAddressId) ?? savedAddresses[0]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn('flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left transition-colors hover:bg-cream-200 focus-visible:outline-none', className)}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-50">
          <MapPin className="h-4 w-4 text-forest-700" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-caption text-charcoal-500">Deliver to</span>
          <span className="block truncate text-body-lg font-medium text-charcoal-900">
            {selected ? `${selected.label} — ${selected.line1}` : 'Set your delivery address'}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-charcoal-500" aria-hidden="true" />
      </button>

      <Sheet open={open} onOpenChange={setOpen} title="Delivery address">
        <ul className="space-y-2">
          {savedAddresses.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  selectAddress(a.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full flex-col items-start gap-0.5 rounded-lg border px-3.5 py-3 text-left transition-colors',
                  a.id === selectedAddressId ? 'border-forest-600 bg-forest-50' : 'border-border hover:bg-cream-200',
                )}
              >
                <span className="text-body-lg font-medium text-charcoal-900">{a.label}</span>
                <span className="text-body text-charcoal-600">
                  {a.line1}, {a.city}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          fullWidth
          className="mt-3"
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setOpen(false)
            navigate('/account/addresses/new')
          }}
        >
          Add new address
        </Button>
      </Sheet>
    </>
  )
}
