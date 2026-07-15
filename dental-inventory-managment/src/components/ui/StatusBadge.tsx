import { cn } from '@/lib/utils'
import type { InventoryStatus } from '@/types'

const styles: Record<InventoryStatus, string> = {
  Healthy: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  Low: 'bg-amber-50 text-amber-800 ring-amber-200',
  Critical: 'bg-orange-50 text-orange-800 ring-orange-200',
  'Out of Stock': 'bg-rose-50 text-rose-800 ring-rose-200',
}

export function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        styles[status],
      )}
    >
      {status}
    </span>
  )
}
