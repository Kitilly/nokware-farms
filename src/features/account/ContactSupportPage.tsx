import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/Select'
import { ConfirmationState } from '@/components/ui/ConfirmationState'
import { submitTicket } from '@/services/support'
import type { SupportTopic } from '@/types/support'

const topicLabels: Record<SupportTopic, string> = {
  order: 'General order question',
  delivery: 'Delivery issue',
  payment: 'Payment issue',
  'product-quality': 'Product quality issue',
  'damaged-incorrect-item': 'Damaged or incorrect item',
  'cancellation-refund': 'Cancellation or refund',
  other: 'Something else',
}

export function ContactSupportPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTopic = (searchParams.get('topic') as SupportTopic) || 'other'

  const [topic, setTopic] = useState<SupportTopic>(initialTopic)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (message.trim().length === 0) return
    setIsSubmitting(true)
    await submitTicket({ topic, message, channel: 'in-app' })
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-5 pt-10 md:px-8">
          <ConfirmationState
            title="We’ve got your message"
            body="Our team will get back to you shortly."
            action={<Button onClick={() => navigate('/account/support')}>Back to Support</Button>}
          />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/support')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Support
        </button>
        <h1 className="text-h1 text-charcoal-900">Contact support</h1>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-body font-medium text-charcoal-800">Topic</label>
            <Select value={topic} onValueChange={(v) => setTopic(v as SupportTopic)}>
              <SelectTrigger placeholder="Select a topic" />
              <SelectContent>
                {(Object.keys(topicLabels) as SupportTopic[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {topicLabels[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-body font-medium text-charcoal-800">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Tell us what's going on…"
              className="w-full rounded-md border border-border-strong bg-cream-50 px-3.5 py-2.5 text-body-lg text-charcoal-900 focus-visible:outline-none focus-visible:border-forest-500"
            />
          </div>
        </div>

        <Button fullWidth size="lg" className="mt-6" isLoading={isSubmitting} disabled={message.trim().length === 0} onClick={handleSubmit}>
          Send message
        </Button>
      </div>
    </AppShell>
  )
}
