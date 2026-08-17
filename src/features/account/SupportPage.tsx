import { useNavigate } from 'react-router-dom'
import { ArrowLeft, HelpCircle, Truck, CreditCard, PackageX, RotateCcw, MessageCircleQuestion, Phone, MessageCircle, Mail } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsRow } from '@/components/domain/account/SettingsRow'
import { Divider } from '@/components/ui/Divider'
import { getContactChannels } from '@/config/contact-channels.config'
import type { SupportTopic } from '@/types/support'

const channelIcons = { phone: Phone, whatsapp: MessageCircle, email: Mail }

const topics: { topic: SupportTopic; label: string; icon: typeof Truck }[] = [
  { topic: 'delivery', label: 'Delivery issue', icon: Truck },
  { topic: 'payment', label: 'Payment issue', icon: CreditCard },
  { topic: 'product-quality', label: 'Product quality issue', icon: MessageCircleQuestion },
  { topic: 'damaged-incorrect-item', label: 'Damaged or incorrect item', icon: PackageX },
  { topic: 'cancellation-refund', label: 'Cancellation or refund', icon: RotateCcw },
]

export function SupportPage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Support</h1>

        <div className="mt-5 space-y-0.5">
          <SettingsRow icon={<HelpCircle className="h-4 w-4 text-charcoal-600" />} label="Frequently asked questions" to="/account/support/faq" />
        </div>

        <Divider className="my-4" />

        <p className="mb-2 text-body font-medium text-charcoal-800">Report a problem</p>
        <div className="space-y-0.5">
          {topics.map((t) => (
            <SettingsRow key={t.topic} icon={<t.icon className="h-4 w-4 text-charcoal-600" />} label={t.label} to={`/account/support/contact?topic=${t.topic}`} />
          ))}
        </div>

        <Divider className="my-4" />

        <p className="mb-2 text-body font-medium text-charcoal-800">Contact us directly</p>
        <div className="space-y-2">
          {getContactChannels().map((c) => {
            const Icon = channelIcons[c.type]
            return (
              <a key={c.type} href={c.href} className="flex items-center gap-3 rounded-lg border border-border p-3.5 hover:bg-cream-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-200">
                  <Icon className="h-4 w-4 text-charcoal-600" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-body-lg font-medium text-charcoal-900">{c.label}</p>
                  <p className="text-body text-charcoal-500">{c.value}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
