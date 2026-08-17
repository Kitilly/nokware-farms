import type { FaqEntry } from '@/types/support'

export const faqEntries: FaqEntry[] = [
  {
    id: 'faq-delivery-areas',
    topic: 'delivery',
    question: 'Where do you deliver?',
    answer:
      'We currently deliver across Greater Accra, parts of the Central Region, and the Eastern Region near our farm. Enter your address at checkout to confirm eligibility.',
  },
  {
    id: 'faq-delivery-time',
    topic: 'delivery',
    question: 'How long does delivery take?',
    answer:
      'Most fresh meat and poultry orders are delivered within the same day or next day, depending on your chosen slot. Live animal orders require additional lead time for transport arrangements.',
  },
  {
    id: 'faq-live-animal-weight',
    topic: 'order',
    question: 'Why don’t live animals have an exact weight?',
    answer:
      'Live animals are sold within an approximate weight range rather than an exact figure, since weight naturally varies. Our team confirms the specific animal with you before dispatch.',
  },
  {
    id: 'faq-final-weight',
    topic: 'payment',
    question: 'Why might my final charge differ from the estimate?',
    answer:
      'Some fresh meat products are priced per kilogram with an estimated total based on your selected weight. The final charge reflects the exact weight measured during packing, within a small margin.',
  },
  {
    id: 'faq-payment-methods',
    topic: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We support mobile money, bank cards, and bank transfer. Cash on delivery may be available depending on your location. This is a demo checkout — no real charges are made.',
  },
  {
    id: 'faq-cancel-order',
    topic: 'cancellation-refund',
    question: 'Can I cancel my order?',
    answer:
      'Orders can be cancelled before they enter processing. Once processing has started, contact support to check if cancellation is still possible.',
  },
  {
    id: 'faq-damaged-item',
    topic: 'damaged-incorrect-item',
    question: 'What if my order arrives damaged or incorrect?',
    answer:
      'Contact support with your order number and photos where possible — we’ll arrange a replacement or refund based on our policy.',
  },
  {
    id: 'faq-product-quality',
    topic: 'product-quality',
    question: 'What if I’m not happy with the quality of a product?',
    answer:
      'We stand behind the freshness and quality of everything we sell. Reach out to support within 24 hours of delivery and we’ll make it right.',
  },
]

export function getFaqsByTopic(topic?: FaqEntry['topic']): FaqEntry[] {
  if (!topic) return faqEntries
  return faqEntries.filter((f) => f.topic === topic)
}
