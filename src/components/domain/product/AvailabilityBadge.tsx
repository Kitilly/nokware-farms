import { CheckCircle2, AlertTriangle, XCircle, Clock, Lock, Sparkles } from 'lucide-react'
import { StatusBadge, type StatusTone } from '@/components/ui/StatusBadge'
import type { AvailabilityStatus } from '@/types/product'

const config: Record<AvailabilityStatus, { label: string; tone: StatusTone; icon: typeof CheckCircle2 }> = {
  available: { label: 'Available', tone: 'success', icon: CheckCircle2 },
  'low-stock': { label: 'Low stock', tone: 'warning', icon: AlertTriangle },
  unavailable: { label: 'Unavailable', tone: 'neutral', icon: XCircle },
  'pre-order': { label: 'Pre-order', tone: 'info', icon: Clock },
  reserved: { label: 'Reserved', tone: 'neutral', icon: Lock },
  seasonal: { label: 'Seasonal', tone: 'info', icon: Sparkles },
}

interface AvailabilityBadgeProps {
  status: AvailabilityStatus
  size?: 'sm' | 'md'
  className?: string
}

export function AvailabilityBadge({ status, size = 'sm', className }: AvailabilityBadgeProps) {
  const { label, tone, icon: Icon } = config[status]
  return <StatusBadge tone={tone} label={label} size={size} icon={<Icon className="h-3 w-3" aria-hidden="true" />} className={className} />
}
