import { useNavigate } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { OrderSummaryCard } from '@/components/orders/OrderSummaryCard'
import { usePickupStore } from '@/store/pickupStore'

export function OrdersPage() {
  const navigate = useNavigate()
  // Select stable state only — sorting inside the selector returns a new array
  // every time and triggers an infinite re-render loop (React error #185).
  const orders = usePickupStore((s) => s.orders)
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-8 w-8" />}
        title="No orders yet"
        description="Place a mock order from the catalog — you’ll track status here."
        action={<Button onClick={() => navigate('/buyer')}>Shop catalog</Button>}
      />
    )
  }

  const active = sorted.filter((o) => o.status !== 'picked_up')
  const past = sorted.filter((o) => o.status === 'picked_up')

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">My orders</h1>
        <p className="text-sm text-muted">
          Status updates live as the packer works — switch to Packer to advance an order.
        </p>
      </div>

      {active.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
            In progress
          </h2>
          {active.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
              onClick={() => navigate(`/buyer/orders/${order.id}`)}
            />
          ))}
        </section>
      ) : null}

      {past.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
            Picked up
          </h2>
          {past.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
              onClick={() => navigate(`/buyer/orders/${order.id}`)}
            />
          ))}
        </section>
      ) : null}
    </div>
  )
}
