import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { notificationsSeed } from '@/data/mock/notifications.seed'
import type { Notification, NotificationCategory } from '@/types/notification'

interface NotificationsState {
  notifications: Notification[]
  preferences: Record<NotificationCategory, boolean>
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  setPreference: (category: NotificationCategory, enabled: boolean) => void
  unreadCount: () => number
}

const defaultPreferences: Record<NotificationCategory, boolean> = {
  order: true,
  payment: true,
  delivery: true,
  inventory: true,
  promotions: true,
  seasonal: true,
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: notificationsSeed,
      preferences: defaultPreferences,

      addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),

      markAsRead: (id) =>
        set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

      markAllAsRead: () => set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

      setPreference: (category, enabled) =>
        set((state) => ({ preferences: { ...state.preferences, [category]: enabled } })),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'farm-app-notifications' },
  ),
)
