import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ProgressSteps } from '@/components/ui/ProgressSteps'

const steps: { path: string; label: string }[] = [
  { path: 'address', label: 'Address' },
  { path: 'fulfillment', label: 'Fulfillment' },
  { path: 'schedule', label: 'Schedule' },
  { path: 'contact', label: 'Contact' },
  { path: 'payment', label: 'Payment' },
  { path: 'summary', label: 'Summary' },
]

export function CheckoutLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentIndex = Math.max(0, steps.findIndex((s) => location.pathname.endsWith(s.path)))

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pb-28 pt-4 md:px-8 md:pb-16">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (currentIndex === 0 ? navigate('/cart') : navigate(`/checkout/${steps[currentIndex - 1].path}`))}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal-700 hover:bg-cream-200"
          >
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
          <ProgressSteps steps={steps.map((s) => s.label)} currentIndex={currentIndex} className="flex-1" />
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </AppShell>
  )
}
