import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { getFaqs } from '@/services/support'
import type { FaqEntry } from '@/types/support'

export function FaqPage() {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState<FaqEntry[] | null>(null)

  useEffect(() => {
    getFaqs().then(setFaqs)
  }, [])

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pb-10 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/support')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Support
        </button>
        <h1 className="text-h1 text-charcoal-900">Frequently asked questions</h1>

        {!faqs && (
          <div className="mt-5 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {faqs && (
          <div className="mt-5 divide-y divide-border">
            {faqs.map((f) => (
              <details key={f.id} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left focus-visible:outline-none">
                  <span className="text-body-lg font-medium text-charcoal-900">{f.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-charcoal-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-2 text-body-lg text-charcoal-600">{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
