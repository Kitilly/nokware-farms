import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ordersSeed } from '@/data/mock/orders.seed'
import type { Order, OrderLifecycleStatus } from '@/types/order'

interface OrdersState {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrder: (id: string, patch: Partial<Order>) => void
  getOrderById: (id: string) => Order | null
  getOrdersByStatus: (status?: OrderLifecycleStatus) => Order[]
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: ordersSeed,

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      updateOrder: (id, patch) =>
        set((state) => ({ orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),

      getOrderById: (id) => get().orders.find((o) => o.id === id) ?? null,

      getOrdersByStatus: (status) => {
        const { orders } = get()
        return status ? orders.filter((o) => o.status === status) : orders
      },
    }),
    { name: 'farm-app-orders' },
  ),
)
