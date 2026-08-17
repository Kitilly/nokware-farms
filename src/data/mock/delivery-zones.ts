import type { DeliveryZone } from '@/types/address'

export const deliveryZones: DeliveryZone[] = [
  { id: 'zone-accra-central', name: 'Accra Central', region: 'Greater Accra', eligible: true, etaMinutes: 60 },
  { id: 'zone-east-legon', name: 'East Legon', region: 'Greater Accra', eligible: true, etaMinutes: 50 },
  { id: 'zone-tema', name: 'Tema', region: 'Greater Accra', eligible: true, etaMinutes: 75 },
  { id: 'zone-madina', name: 'Madina', region: 'Greater Accra', eligible: true, etaMinutes: 45 },
  { id: 'zone-nsawam', name: 'Nsawam', region: 'Eastern', eligible: true, etaMinutes: 30 },
  { id: 'zone-kasoa', name: 'Kasoa', region: 'Central', eligible: true, etaMinutes: 80, extraFee: 15 },
  {
    id: 'zone-kumasi',
    name: 'Kumasi',
    region: 'Ashanti',
    eligible: false,
    etaMinutes: 0,
    note: 'We don’t deliver to this region yet — pickup at our Nsawam farm store is available.',
  },
]

export function findDeliveryZoneByName(query: string): DeliveryZone | undefined {
  const normalized = query.toLowerCase()
  return deliveryZones.find((z) => normalized.includes(z.name.toLowerCase()))
}
