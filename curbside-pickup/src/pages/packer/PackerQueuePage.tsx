import { useNavigate } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { OrderSummaryCard } from '@/components/orders/OrderSummaryCard'
import { QUEUE_STATUS_ORDER } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'
import type { Order } from '@/types'

function packerQueue(orders: Order[]): Order[] {
  return [...orders]
    .filter((o) => o.status !== 'picked_up')
    .sort((a, b) => {
      const byStatus =
        QUEUE_STATUS_ORDER.indexOf(a.status) - QUEUE_STATUS_ORDER.indexOf(b.status)
      if (byStatus !== 0) return byStatus
      return a.createdAt.localeCompare(b.createdAt)
    })
}

export function PackerQueuePage() {
  const navigate = useNavigate()
  // Select stable state only — deriving a new array inside the selector
  // causes Zustand to see a changed value every render (React error #185).
  const orders = usePickupStore((s) => s.orders)
  const queue = packerQueue(orders)
  const packing = queue.filter((o) => o.status === 'packing')
  const paid = queue.filter((o) => o.status === 'paid')
  const ready = queue.filter((o) => o.status === 'ready')

  if (queue.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="h-8 w-8" />}
        title="Queue is clear"
        description="No paid orders waiting. Place one as Buyer, then come back here to pack."
        action={
          <Button variant="outline" onClick={() => navigate('/buyer')}>
            Switch to Buyer
          </Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Pickup queue</h1>
        <p className="text-sm text-muted">
          Work packing first, then hand off ready bags at the desk.
        </p>
      </div>

      {packing.length > 0 ? (
        <QueueSection
          title="Packing now"
          hint="Continue checking items"
          orders={packing}
          onOpen={(id) => navigate(`/packer/orders/${id}`)}
        />
      ) : null}

      {paid.length > 0 ? (
        <QueueSection
          title="Needs packing"
          hint="Start these next"
          orders={paid}
          onOpen={(id) => navigate(`/packer/orders/${id}`)}
        />
      ) : null}

      {ready.length > 0 ? (
        <QueueSection
          title="Ready for handoff"
          hint="Mark picked up when the buyer collects"
          orders={ready}
          onOpen={(id) => navigate(`/packer/orders/${id}`)}
        />
      ) : null}
    </div>
  )
}

function QueueSection({
  title,
  hint,
  orders,
  onOpen,
}: {
  title: string
  hint: string
  orders: ReturnType<typeof usePickupStore.getState>['orders']
  onOpen: (id: string) => void
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      {orders.map((order) => (
        <OrderSummaryCard
          key={order.id}
          order={order}
          onClick={() => onOpen(order.id)}
          trailing={
            <span className="mt-1 block text-xs font-medium text-brand-700">Open →</span>
          }
        />
      ))}
    </section>
  )
}
