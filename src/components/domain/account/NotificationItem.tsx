import { Link } from 'react-router-dom'
import { Package, CreditCard, Truck, Boxes, Tag, Leaf } from 'lucide-react'
import { relativeTimeFromNow } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { Notification, NotificationCategory } from '@/types/notification'

const categoryIcons: Record<NotificationCategory, typeof Package> = {
  order: Package,
  payment: CreditCard,
  delivery: Truck,
  inventory: Boxes,
  promotions: Tag,
  seasonal: Leaf,
}

const promotionalCategories: NotificationCategory[] = ['promotions', 'seasonal']

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = categoryIcons[notification.category]
  const isPromotional = promotionalCategories.includes(notification.category)

  const content = (
    <div
      className={cn('flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-cream-200', !notification.read && 'bg-forest-50')}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', isPromotional ? 'bg-terracotta-50' : 'bg-cream-200')}>
        <Icon className={cn('h-4 w-4', isPromotional ? 'text-terracotta-600' : 'text-charcoal-600')} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body-lg font-medium text-charcoal-900">{notification.title}</p>
          {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-forest-600" aria-label="Unread" />}
        </div>
        <p className="text-body text-charcoal-600">{notification.body}</p>
        <p className="mt-1 text-caption text-charcoal-400">{relativeTimeFromNow(notification.createdAt)}</p>
      </div>
    </div>
  )

  if (notification.actionRoute) {
    return (
      <Link to={notification.actionRoute} onClick={() => !notification.read && onRead(notification.id)}>
        {content}
      </Link>
    )
  }

  return content
}
