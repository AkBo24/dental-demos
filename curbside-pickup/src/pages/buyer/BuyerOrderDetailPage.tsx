import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, CheckCircle2, Circle, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DEMO_STORE } from '@/data/store'
import { cn, currency, ORDER_STATUS_LABEL } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'
import type { OrderStatus } from '@/types'

const STEPS: OrderStatus[] = ['paid', 'packing', 'ready', 'picked_up']

export function BuyerOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = usePickupStore((s) => s.orders.find((o) => o.id === id))

  if (!order) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="font-display text-xl font-semibold">Order not found</h1>
        <Button onClick={() => navigate('/buyer/orders')}>Back to orders</Button>
      </div>
    )
  }

  const stepIndex = STEPS.indexOf(order.status)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to="/buyer/orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{order.id}</h1>
            <p className="text-sm text-muted">
              Placed {format(parseISO(order.createdAt), 'MMM d, yyyy · h:mm a')}
            </p>
          </div>
          <StatusBadge status={order.status} className="text-sm" />
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((step, i) => {
          const done = i <= stepIndex
          const current = i === stepIndex
          return (
            <li
              key={step}
              className={cn(
                'rounded-lg border px-3 py-3 text-center',
                done ? 'border-brand-200 bg-brand-50' : 'border-line bg-white',
                current && 'ring-2 ring-brand-600/30',
              )}
            >
              <div className="flex justify-center">
                {done ? (
                  <CheckCircle2
                    className={cn(
                      'h-5 w-5',
                      current ? 'animate-pulse-soft text-brand-700' : 'text-brand-600',
                    )}
                  />
                ) : (
                  <Circle className="h-5 w-5 text-line" />
                )}
              </div>
              <p
                className={cn(
                  'mt-1.5 text-xs font-semibold',
                  done ? 'text-brand-800' : 'text-muted',
                )}
              >
                {ORDER_STATUS_LABEL[step]}
              </p>
            </li>
          )
        })}
      </ol>

      {order.status === 'ready' ? (
        <div className="animate-fade-up rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <p className="font-semibold text-emerald-900">Ready for desk pickup</p>
              <p className="mt-1 text-sm text-emerald-800/90">
                Walk into {DEMO_STORE.name} ({DEMO_STORE.address}) and collect your bag at
                the pickup desk. {DEMO_STORE.deskHours}.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {order.status === 'paid' || order.status === 'packing' ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Store packers are preparing your bag. Switch to the <strong>Packer</strong> role
          to advance this demo order.
        </p>
      ) : null}

      <section className="rounded-xl border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <h2 className="font-semibold text-ink">Items</h2>
        </div>
        <ul className="divide-y divide-line">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium text-ink">{line.name}</p>
                <p className="text-xs text-muted">
                  {line.quantity} × {currency(line.unitPrice)}
                </p>
              </div>
              <p className="font-medium">{currency(line.unitPrice * line.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 border-t border-line px-4 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{currency(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tax</dt>
            <dd>{currency(order.tax)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total paid</dt>
            <dd className="text-brand-800">{currency(order.total)}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
