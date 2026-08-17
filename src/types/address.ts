export type AddressLabel = 'Home' | 'Work' | 'Dorm' | 'Office' | 'Other'

export interface Address {
  id: string
  label: AddressLabel
  customLabel?: string
  recipientName?: string
  phone?: string
  line1: string
  line2?: string
  city: string
  region: string
  landmark?: string
  gpsDigitalAddress?: string
  coordinates?: { lat: number; lng: number }
  isDefault: boolean
  deliveryZoneId?: string
  createdAt: string
}

export interface DeliveryZone {
  id: string
  name: string
  region: string
  eligible: boolean
  etaMinutes: number
  extraFee?: number
  note?: string
}
