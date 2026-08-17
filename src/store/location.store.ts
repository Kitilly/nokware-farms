import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/id'
import type { Address } from '@/types/address'

interface LocationState {
  savedAddresses: Address[]
  selectedAddressId: string | null
  addAddress: (address: Omit<Address, 'id' | 'createdAt'>) => Address
  updateAddress: (id: string, patch: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  selectAddress: (id: string) => void
  getSelectedAddress: () => Address | null
  getDefaultAddress: () => Address | null
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      savedAddresses: [],
      selectedAddressId: null,

      addAddress: (address) => {
        const newAddress: Address = { ...address, id: generateId('addr'), createdAt: new Date().toISOString() }
        set((state) => {
          const shouldBeDefault = newAddress.isDefault || state.savedAddresses.length === 0
          const addresses = shouldBeDefault
            ? state.savedAddresses.map((a) => ({ ...a, isDefault: false }))
            : state.savedAddresses
          return {
            savedAddresses: [...addresses, { ...newAddress, isDefault: shouldBeDefault }],
            selectedAddressId: state.selectedAddressId ?? newAddress.id,
          }
        })
        return newAddress
      },

      updateAddress: (id, patch) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      removeAddress: (id) =>
        set((state) => {
          const remaining = state.savedAddresses.filter((a) => a.id !== id)
          const selectedAddressId = state.selectedAddressId === id ? (remaining[0]?.id ?? null) : state.selectedAddressId
          return { savedAddresses: remaining, selectedAddressId }
        }),

      setDefaultAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      selectAddress: (id) => set({ selectedAddressId: id }),

      getSelectedAddress: () => {
        const { savedAddresses, selectedAddressId } = get()
        return savedAddresses.find((a) => a.id === selectedAddressId) ?? null
      },

      getDefaultAddress: () => {
        const { savedAddresses } = get()
        return savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null
      },
    }),
    { name: 'farm-app-location' },
  ),
)
