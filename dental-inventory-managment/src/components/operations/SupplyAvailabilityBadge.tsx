import { cn } from '@/lib/utils'
import type { SupplyAvailabilityStatus } from '@/types'

const copy: Record<SupplyAvailabilityStatus, { label: string; icon: string; className: string }> = {
  available: {
    label: 'Available',
    icon: '✓',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  low: {
    label: 'Low Inventory',
    icon: '⚠',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  out: {
    label: 'Out of Stock',
    icon: '✖',
    className: 'bg-rose-50 text-rose-800 ring-rose-200',
  },
}

export function supplyStatusFromFlags(params: {
  available: number
  stockNeeded: number
  weekNeed: number
  ok: boolean
  warn: boolean
}): SupplyAvailabilityStatus {
  if (params.available <= 0 || !params.ok) return 'out'
  if (params.warn || params.available < params.weekNeed) return 'low'
  return 'available'
}

export function SupplyAvailabilityBadge({ status }: { status: SupplyAvailabilityStatus }) {
  const meta = copy[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        meta.className,
      )}
    >
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  )
}
