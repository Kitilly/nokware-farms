export interface ContactChannel {
  type: 'phone' | 'whatsapp' | 'email'
  label: string
  value: string
  href: string
  enabled: boolean
}

export const contactChannels: ContactChannel[] = [
  {
    type: 'phone',
    label: 'Call us',
    value: '+233 24 000 1122',
    href: 'tel:+233240001122',
    enabled: true,
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '+233 24 000 1122',
    href: 'https://wa.me/233240001122',
    enabled: true,
  },
  {
    type: 'email',
    label: 'Email',
    value: 'support@nokwarefarms.demo',
    href: 'mailto:support@nokwarefarms.demo',
    enabled: true,
  },
]

export function getContactChannels(): ContactChannel[] {
  return contactChannels.filter((c) => c.enabled)
}
