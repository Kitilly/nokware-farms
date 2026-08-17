import type { Notification } from '@/types/notification'

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

export const notificationsSeed: Notification[] = [
  {
    id: 'notif-seasonal-1',
    category: 'seasonal',
    title: 'Festive season turkeys are here',
    body: 'Large free-range turkeys are now in stock — order early to guarantee your size.',
    read: false,
    createdAt: hoursAgo(2),
    actionRoute: '/shop/poultry/turkeys',
  },
  {
    id: 'notif-promo-1',
    category: 'promotions',
    title: '10% off your first order',
    body: 'Use code WELCOME10 at checkout on orders over GHS 50.',
    read: false,
    createdAt: hoursAgo(6),
  },
  {
    id: 'notif-inventory-1',
    category: 'inventory',
    title: 'Back in stock: Beef Ribs',
    body: 'Beef Ribs are back in stock after selling out last week.',
    read: true,
    createdAt: hoursAgo(30),
    actionRoute: '/product/meat/beef-ribs',
  },
  {
    id: 'notif-farm-1',
    category: 'seasonal',
    title: 'A note from the farm',
    body: 'This week’s free-range chickens were raised on our new pasture rotation — read about it on our farm story.',
    read: true,
    createdAt: hoursAgo(72),
  },
]
