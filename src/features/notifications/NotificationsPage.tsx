import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings2 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { NotificationItem } from '@/components/domain/account/NotificationItem'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { useNotificationsStore } from '@/store/notifications.store'
import type { NotificationCategory } from '@/types/notification'

const filters: { value: NotificationCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'order', label: 'Orders' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'payment', label: 'Payment' },
  { value: 'promotions', label: 'Promotions' },
  { value: 'seasonal', label: 'Farm updates' },
]

export function NotificationsPage() {
  const navigate = useNavigate()
  const notifications = useNotificationsStore((s) => s.notifications)
  const markAsRead = useNotificationsStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead)
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all')

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.category === filter)
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pt-4 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-h1 text-charcoal-900">Notifications</h1>
          <button type="button" onClick={() => navigate('/account/settings/notifications')} aria-label="Notification settings" className="text-charcoal-500 hover:text-charcoal-800">
            <Settings2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {filters.map((f) => (
              <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </Chip>
            ))}
          </div>
        </div>

        {hasUnread && (
          <button type="button" onClick={markAllAsRead} className="mt-2 text-caption font-medium text-forest-700 hover:underline">
            Mark all as read
          </button>
        )}

        <div className="mt-3">
          {filtered.length === 0 ? (
            <EmptyState icon={<Bell className="h-7 w-7 text-charcoal-500" aria-hidden="true" />} title="No notifications" body="You’re all caught up." className="pt-10" />
          ) : (
            <div className="space-y-1">
              {filtered.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
