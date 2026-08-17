export const appConfig = {
  brand: {
    name: 'Nokware Farms',
    tagline: 'Fresh from our farm to your table.',
    shortName: 'Nokware',
  },
  country: {
    name: 'Ghana',
    code: 'GH',
  },
  currency: {
    code: 'GHS',
    symbol: 'GHS',
    locale: 'en-GH',
  },
  phone: {
    dialCode: '+233',
    countryCode: 'GH',
    exampleFormat: '24 123 4567',
    // Ghana mobile numbers: 9 digits after the leading 0/dial code, e.g. 024 123 4567
    nationalLength: 9,
  },
  address: {
    fields: ['line1', 'line2', 'city', 'region', 'landmark', 'gpsDigitalAddress'] as const,
    regions: [
      'Greater Accra',
      'Ashanti',
      'Western',
      'Central',
      'Eastern',
      'Volta',
      'Northern',
      'Bono',
    ],
  },
  otp: {
    length: 6,
    resendCooldownSeconds: 45,
    expirySeconds: 300,
    demoCode: '123456',
  },
} as const

export type AppConfig = typeof appConfig
