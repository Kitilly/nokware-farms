import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { OrderCard } from '@/components/domain/orders/OrderCard'
import { useOrdersStore } from '@/store/orders.store'
import type { OrderLifecycleStatus } from '@/types/order'

const tabs: { value: OrderLifecycleStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrdersListPage() {
  const navigate = useNavigate()
  const orders = useOrdersStore((s) => s.orders)
  const [tab, setTab] = useState<OrderLifecycleStatus>('active')

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 pt-4 md:px-8">
        <h1 className="text-h1 text-charcoal-900">Orders</h1>

        <Tabs value={tab} onValueChange={(v) => setTab(v as OrderLifecycleStatus)} className="mt-4">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => {
            const filtered = orders.filter((o) => o.status === t.value)
            return (
              <TabsContent key={t.value} value={t.value} className="mt-4">
                {filtered.length === 0 ? (
                  <EmptyState
                    icon={<ClipboardList className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
                    title={`No ${t.label.toLowerCase()} orders`}
                    body={t.value === 'active' ? 'Your active and upcoming orders will show up here.' : `You don’t have any ${t.label.toLowerCase()} orders yet.`}
                    action={t.value === 'active' ? <Button onClick={() => navigate('/shop')}>Start shopping</Button> : undefined}
                  />
                ) : (
                  <div className="space-y-3">
                    {filtered.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </AppShell>
  )
}
