import { cn, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        ORDER_STATUS_STYLE[status],
        className,
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}
