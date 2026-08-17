import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DeliverySlot } from '@/types/delivery'

export type CheckoutStep = 'address' | 'fulfillment' | 'schedule' | 'contact' | 'payment' | 'summary'

interface CheckoutState {
  step: CheckoutStep
  selectedAddressId: string | null
  pickupGroupKeys: string[]
  selectedSlotByGroup: Record<string, DeliverySlot | null>
  contactName: string
  contactPhone: string
  paymentMethodId: string | null
  newPaymentType: string | null
  setStep: (step: CheckoutStep) => void
  setSelectedAddressId: (id: string | null) => void
  togglePickupGroup: (groupKey: string, isPickup: boolean) => void
  setSlotForGroup: (groupKey: string, slot: DeliverySlot | null) => void
  setContact: (name: string, phone: string) => void
  setPaymentMethodId: (id: string | null) => void
  setNewPaymentType: (type: string | null) => void
  reset: () => void
}

const initial = {
  step: 'address' as CheckoutStep,
  selectedAddressId: null as string | null,
  pickupGroupKeys: [] as string[],
  selectedSlotByGroup: {} as Record<string, DeliverySlot | null>,
  contactName: '',
  contactPhone: '',
  paymentMethodId: null as string | null,
  newPaymentType: null as string | null,
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      ...initial,
      setStep: (step) => set({ step }),
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      togglePickupGroup: (groupKey, isPickup) =>
        set((state) => ({
          pickupGroupKeys: isPickup
            ? Array.from(new Set([...state.pickupGroupKeys, groupKey]))
            : state.pickupGroupKeys.filter((k) => k !== groupKey),
        })),
      setSlotForGroup: (groupKey, slot) =>
        set((state) => ({ selectedSlotByGroup: { ...state.selectedSlotByGroup, [groupKey]: slot } })),
      setContact: (name, phone) => set({ contactName: name, contactPhone: phone }),
      setPaymentMethodId: (id) => set({ paymentMethodId: id }),
      setNewPaymentType: (type) => set({ newPaymentType: type }),
      reset: () => set(initial),
    }),
    { name: 'farm-app-checkout', storage: createJSONStorage(() => sessionStorage) },
  ),
)
