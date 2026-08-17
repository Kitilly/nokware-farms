import { mockRequest } from './_client'
import { generateId } from '@/lib/id'
import { getFaqsByTopic } from '@/data/mock/faq'
import { getContactChannels as getConfiguredChannels } from '@/config/contact-channels.config'
import type { FaqEntry, SupportTicket, SupportTopic } from '@/types/support'

let tickets: SupportTicket[] = []

export function getFaqs(topic?: SupportTopic): Promise<FaqEntry[]> {
  return mockRequest(() => getFaqsByTopic(topic))
}

export function submitTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): Promise<SupportTicket> {
  return mockRequest(() => {
    const created: SupportTicket = {
      ...ticket,
      id: generateId('ticket'),
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    tickets = [created, ...tickets]
    return created
  })
}

export function getTickets(): Promise<SupportTicket[]> {
  return mockRequest(() => [...tickets])
}

export function getContactChannels() {
  return mockRequest(() => getConfiguredChannels(), { minDelayMs: 50, maxDelayMs: 150 })
}
