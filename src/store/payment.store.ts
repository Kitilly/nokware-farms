import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import type { PaymentMethod, PaymentState } from '@/types/payment'

interface PaymentStoreState {
  savedMethods: PaymentMethod[]
  activePaymentId: string | null
  activePaymentState: PaymentState | null
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => PaymentMethod
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  setActivePayment: (paymentId: string | null, state: PaymentState | null) => void
}

export const usePaymentStore = create<PaymentStoreState>()(
  persist(
    (set) => ({
      savedMethods: [],
      activePaymentId: null,
      activePaymentState: null,

      addPaymentMethod: (method) => {
        const newMethod: PaymentMethod = { ...method, id: generateId('pm'), createdAt: new Date().toISOString() }
        set((state) => {
          const shouldBeDefault = newMethod.isDefault || state.savedMethods.length === 0
          const methods = shouldBeDefault ? state.savedMethods.map((m) => ({ ...m, isDefault: false })) : state.savedMethods
          return { savedMethods: [...methods, { ...newMethod, isDefault: shouldBeDefault }] }
        })
        return newMethod
      },

      removePaymentMethod: (id) => set((state) => ({ savedMethods: state.savedMethods.filter((m) => m.id !== id) })),

      setDefaultPaymentMethod: (id) =>
        set((state) => ({ savedMethods: state.savedMethods.map((m) => ({ ...m, isDefault: m.id === id })) })),

      setActivePayment: (paymentId, state) => set({ activePaymentId: paymentId, activePaymentState: state }),
    }),
    {
      name: 'farm-app-payment-methods',
      partialize: (state) => ({ savedMethods: state.savedMethods }),
    },
  ),
)
