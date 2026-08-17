export interface AddressSuggestion {
  id: string
  label: string
  description: string
  line1: string
  city: string
  region: string
  deliveryZoneId?: string
  coordinates: { lat: number; lng: number }
}

// A small mock gazetteer standing in for a real geocoding/places API —
// `services/location.ts` filters this list to simulate address search.
export const addressSuggestions: AddressSuggestion[] = [
  {
    id: 'addr-east-legon-1',
    label: 'East Legon, Accra',
    description: 'American House Rd, East Legon',
    line1: 'American House Rd',
    city: 'Accra',
    region: 'Greater Accra',
    deliveryZoneId: 'zone-east-legon',
    coordinates: { lat: 5.6494, lng: -0.1531 },
  },
  {
    id: 'addr-accra-central-1',
    label: 'Accra Central, Accra',
    description: 'Kwame Nkrumah Ave, Accra Central',
    line1: 'Kwame Nkrumah Ave',
    city: 'Accra',
    region: 'Greater Accra',
    deliveryZoneId: 'zone-accra-central',
    coordinates: { lat: 5.5502, lng: -0.2064 },
  },
  {
    id: 'addr-osu-1',
    label: 'Osu, Accra',
    description: 'Oxford St, Osu',
    line1: 'Oxford St',
    city: 'Accra',
    region: 'Greater Accra',
    deliveryZoneId: 'zone-accra-central',
    coordinates: { lat: 5.5558, lng: -0.1826 },
  },
  {
    id: 'addr-tema-1',
    label: 'Tema Community 4',
    description: 'Community 4, Tema',
    line1: 'Community 4',
    city: 'Tema',
    region: 'Greater Accra',
    deliveryZoneId: 'zone-tema',
    coordinates: { lat: 5.6698, lng: -0.0166 },
  },
  {
    id: 'addr-madina-1',
    label: 'Madina, Accra',
    description: 'Madina Market Rd',
    line1: 'Madina Market Rd',
    city: 'Accra',
    region: 'Greater Accra',
    deliveryZoneId: 'zone-madina',
    coordinates: { lat: 5.6837, lng: -0.1669 },
  },
  {
    id: 'addr-nsawam-1',
    label: 'Nsawam, Eastern Region',
    description: 'Main Street, Nsawam',
    line1: 'Main Street',
    city: 'Nsawam',
    region: 'Eastern',
    deliveryZoneId: 'zone-nsawam',
    coordinates: { lat: 5.8078, lng: -0.3505 },
  },
  {
    id: 'addr-kasoa-1',
    label: 'Kasoa, Central Region',
    description: 'Kasoa Main Rd',
    line1: 'Kasoa Main Rd',
    city: 'Kasoa',
    region: 'Central',
    deliveryZoneId: 'zone-kasoa',
    coordinates: { lat: 5.5333, lng: -0.4167 },
  },
  {
    id: 'addr-kumasi-1',
    label: 'Kumasi, Ashanti Region',
    description: 'Adum, Kumasi',
    line1: 'Adum',
    city: 'Kumasi',
    region: 'Ashanti',
    deliveryZoneId: 'zone-kumasi',
    coordinates: { lat: 6.6885, lng: -1.6244 },
  },
]

export function searchAddressSuggestions(query: string): AddressSuggestion[] {
  const normalized = query.trim().toLowerCase()
  if (normalized.length === 0) return []
  return addressSuggestions.filter(
    (s) =>
      s.label.toLowerCase().includes(normalized) ||
      s.description.toLowerCase().includes(normalized) ||
      s.city.toLowerCase().includes(normalized),
  )
}

export const mockCurrentLocationSuggestion = addressSuggestions[0]
