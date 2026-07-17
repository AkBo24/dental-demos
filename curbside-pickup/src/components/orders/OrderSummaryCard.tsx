import type { ReactNode } from 'react'
import { format, parseISO } from 'date-fns'
import { cn, currency } from '@/lib/utils'
import type { Order } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'

export function OrderSummaryCard({
  order,
  onClick,
  className,
  trailing,
}: {
  order: Order
  onClick?: () => void
  className?: string
  trailing?: ReactNode
}) {
  const packed = order.lines.filter((l) => l.packed).length
  const total = order.lines.length

  const classNames = cn(
    'w-full rounded-xl border border-line bg-white p-4 text-left transition-shadow',
    onClick &&
      'hover:border-brand-200 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
    className,
  )

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink">{order.id}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-xs text-muted">
            Placed {format(parseISO(order.createdAt), 'MMM d · h:mm a')} · {total} item
            {total === 1 ? '' : 's'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-ink">{currency(order.total)}</p>
          {trailing}
        </div>
      </div>
      {(order.status === 'packing' || order.status === 'paid') && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Packed</span>
            <span>
              {packed}/{total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-50">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-300"
              style={{ width: `${total ? (packed / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classNames}>
        {body}
      </button>
    )
  }

  return <div className={classNames}>{body}</div>
}
