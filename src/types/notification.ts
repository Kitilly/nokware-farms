export type NotificationCategory =
  | 'order'
  | 'payment'
  | 'delivery'
  | 'inventory'
  | 'promotions'
  | 'seasonal'

export interface Notification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  read: boolean
  createdAt: string
  actionRoute?: string
  relatedOrderId?: string
}

export const transactionalCategories: NotificationCategory[] = ['order', 'payment', 'delivery', 'inventory']
export const promotionalCategories: NotificationCategory[] = ['promotions', 'seasonal']
