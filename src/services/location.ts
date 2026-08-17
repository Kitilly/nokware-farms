import { mockRequest } from './_client'
import { generateId } from '@/lib/id'
import { deliveryZones } from '@/data/mock/delivery-zones'
import { addressSuggestions, mockCurrentLocationSuggestion, type AddressSuggestion } from '@/data/mock/addresses.seed'
import type { Address } from '@/types/address'

let savedAddresses: Address[] = []

export interface CurrentLocationResult {
  success: boolean
  suggestion?: AddressSuggestion
  reason?: 'permission-denied' | 'unavailable'
}

/**
 * Simulates the browser geolocation permission prompt. ~20% of demo calls
 * simulate a denied permission so that state stays easy to show live.
 */
export function getCurrentLocation(simulateDenied = false): Promise<CurrentLocationResult> {
  return mockRequest(() => {
    if (simulateDenied) {
      return { success: false, reason: 'permission-denied' as const }
    }
    return { success: true, suggestion: mockCurrentLocationSuggestion }
  })
}

export function searchAddress(query: string): Promise<AddressSuggestion[]> {
  return mockRequest(() => {
    const normalized = query.trim().toLowerCase()
    if (normalized.length === 0) return []
    return addressSuggestions.filter(
      (s) =>
        s.label.toLowerCase().includes(normalized) ||
        s.description.toLowerCase().includes(normalized) ||
        s.city.toLowerCase().includes(normalized),
    )
  })
}

export interface ValidateAddressResult {
  valid: boolean
  deliveryZoneId?: string
  reason?: string
}

export function validateAddress(address: Partial<Address>): Promise<ValidateAddressResult> {
  return mockRequest(() => {
    if (!address.line1 || !address.city || !address.region) {
      return { valid: false, reason: 'Please fill in all required address fields.' }
    }
    return { valid: true, deliveryZoneId: address.deliveryZoneId }
  })
}

export interface DeliveryEligibilityResult {
  eligible: boolean
  etaMinutes?: number
  extraFee?: number
  reason?: string
}

export function checkDeliveryEligibility(deliveryZoneId: string | undefined): Promise<DeliveryEligibilityResult> {
  return mockRequest(() => {
    const zone = deliveryZones.find((z) => z.id === deliveryZoneId)
    if (!zone) {
      return { eligible: false, reason: 'We couldn’t confirm delivery for this address yet.' }
    }
    if (!zone.eligible) {
      return { eligible: false, reason: zone.note ?? 'We don’t deliver to this area yet.' }
    }
    return { eligible: true, etaMinutes: zone.etaMinutes, extraFee: zone.extraFee }
  })
}

export function getSavedAddresses(): Promise<Address[]> {
  return mockRequest(() => [...savedAddresses])
}

export function saveAddress(address: Omit<Address, 'id' | 'createdAt'>): Promise<Address> {
  return mockRequest(() => {
    const newAddress: Address = {
      ...address,
      id: generateId('addr'),
      createdAt: new Date().toISOString(),
    }
    if (newAddress.isDefault || savedAddresses.length === 0) {
      savedAddresses = savedAddresses.map((a) => ({ ...a, isDefault: false }))
      newAddress.isDefault = true
    }
    savedAddresses = [...savedAddresses, newAddress]
    return newAddress
  })
}

export function updateAddress(id: string, patch: Partial<Address>): Promise<Address> {
  return mockRequest(() => {
    savedAddresses = savedAddresses.map((a) => (a.id === id ? { ...a, ...patch } : a))
    const updated = savedAddresses.find((a) => a.id === id)
    if (!updated) throw new Error('Address not found')
    return updated
  })
}

export function deleteAddress(id: string): Promise<{ success: boolean }> {
  return mockRequest(() => {
    savedAddresses = savedAddresses.filter((a) => a.id !== id)
    return { success: true }
  })
}

export function setDefaultAddress(id: string): Promise<{ success: boolean }> {
  return mockRequest(() => {
    savedAddresses = savedAddresses.map((a) => ({ ...a, isDefault: a.id === id }))
    return { success: true }
  })
}
