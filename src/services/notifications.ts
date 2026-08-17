import { mockRequest } from './_client'
import { notificationsSeed } from '@/data/mock/notifications.seed'
import type { Notification, NotificationCategory } from '@/types/notification'

let notifications: Notification[] = [...notificationsSeed]
let preferences: Record<NotificationCategory, boolean> = {
  order: true,
  payment: true,
  delivery: true,
  inventory: true,
  promotions: true,
  seasonal: true,
}

export function getNotifications(category?: NotificationCategory): Promise<Notification[]> {
  return mockRequest(() => (category ? notifications.filter((n) => n.category === category) : [...notifications]))
}

export function markAsRead(id: string): Promise<void> {
  return mockRequest(() => {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  })
}

export function markAllAsRead(): Promise<void> {
  return mockRequest(() => {
    notifications = notifications.map((n) => ({ ...n, read: true }))
  })
}

export function getPreferences(): Promise<Record<NotificationCategory, boolean>> {
  return mockRequest(() => ({ ...preferences }))
}

export function updatePreferences(prefs: Record<NotificationCategory, boolean>): Promise<void> {
  return mockRequest(() => {
    preferences = { ...prefs }
  })
}

export function pushNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> {
  return mockRequest(
    () => {
      const created: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.round(Math.random() * 1000)}`,
        read: false,
        createdAt: new Date().toISOString(),
      }
      notifications = [created, ...notifications]
      return created
    },
    { minDelayMs: 50, maxDelayMs: 150 },
  )
}
