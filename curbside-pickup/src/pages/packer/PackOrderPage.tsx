import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Check, PackageCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn, currency } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'

export function PackOrderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = usePickupStore((s) => s.orders.find((o) => o.id === id))
  const startPacking = usePickupStore((s) => s.startPacking)
  const toggleLinePacked = usePickupStore((s) => s.toggleLinePacked)
  const packAllLines = usePickupStore((s) => s.packAllLines)
  const markReady = usePickupStore((s) => s.markReady)
  const markPickedUp = usePickupStore((s) => s.markPickedUp)

  if (!order) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="font-display text-xl font-semibold">Order not found</h1>
        <Button onClick={() => navigate('/packer')}>Back to queue</Button>
      </div>
    )
  }

  const packedCount = order.lines.filter((l) => l.packed).length
  const allPacked = packedCount === order.lines.length
  const editable = order.status === 'paid' || order.status === 'packing'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to="/packer"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Queue
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{order.id}</h1>
            <p className="text-sm text-muted">
              Paid {format(parseISO(order.createdAt), 'h:mm a')} · {currency(order.total)}
            </p>
          </div>
          <StatusBadge status={order.status} className="text-sm" />
        </div>
      </div>

      {order.status === 'paid' ? (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => startPacking(order.id)}
          >
            Start packing
          </Button>
        </div>
      ) : null}

      <section className="rounded-xl border border-line bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 className="font-semibold text-ink">Pack checklist</h2>
            <p className="text-xs text-muted">
              {packedCount}/{order.lines.length} items packed
            </p>
          </div>
          {editable ? (
            <Button variant="outline" size="sm" onClick={() => packAllLines(order.id)}>
              Pack all
            </Button>
          ) : null}
        </div>
        <ul className="divide-y divide-line">
          {order.lines.map((line) => {
            const checked = line.packed
            return (
              <li key={line.productId}>
                <button
                  type="button"
                  disabled={!editable}
                  onClick={() => toggleLinePacked(order.id, line.productId)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors',
                    editable && 'hover:bg-brand-50/50',
                    !editable && 'cursor-default',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                      checked
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-line bg-white text-transparent',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block font-medium',
                        checked ? 'text-muted line-through' : 'text-ink',
                      )}
                    >
                      {line.name}
                    </span>
                    <span className="text-xs text-muted">
                      Qty {line.quantity} · {currency(line.unitPrice * line.quantity)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="sticky bottom-4 space-y-2 rounded-xl border border-line bg-white/95 p-4 shadow-lg backdrop-blur">
        {editable ? (
          <>
            <Button
              className="w-full"
              size="lg"
              disabled={!allPacked}
              onClick={() => markReady(order.id)}
            >
              <PackageCheck className="h-4 w-4" />
              Mark ready for pickup
            </Button>
            {!allPacked ? (
              <p className="text-center text-xs text-muted">
                Check off every item before marking ready.
              </p>
            ) : (
              <p className="text-center text-xs text-muted">
                Bag is complete — move to ready for desk handoff.
              </p>
            )}
          </>
        ) : null}

        {order.status === 'ready' ? (
          <>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                markPickedUp(order.id)
                navigate('/packer')
              }}
            >
              Mark picked up
            </Button>
            <p className="text-center text-xs text-muted">
              Confirm when the buyer collects the bag at the desk.
            </p>
          </>
        ) : null}

        {order.status === 'picked_up' ? (
          <p className="text-center text-sm text-muted">
            Handoff complete ·{' '}
            {order.pickedUpAt
              ? format(parseISO(order.pickedUpAt), 'MMM d · h:mm a')
              : 'done'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
