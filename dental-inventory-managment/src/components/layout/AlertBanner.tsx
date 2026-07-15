import { AlertTriangle, PackageX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInventoryStore } from '@/store/inventoryStore'
import { getItemStatus } from '@/lib/utils'

export function AlertBanner() {
  const items = useInventoryStore((s) => s.items)
  const out = items.filter((i) => getItemStatus(i) === 'Out of Stock').length
  const critical = items.filter((i) => getItemStatus(i) === 'Critical').length
  const low = items.filter((i) => getItemStatus(i) === 'Low').length

  if (out + critical + low === 0) return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2 font-medium text-amber-950">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Attention needed
        </div>
        <div className="flex flex-wrap items-center gap-3 text-amber-900">
          {out > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <PackageX className="h-3.5 w-3.5" />
              {out} out of stock
            </span>
          ) : null}
          {critical > 0 ? <span>{critical} critical</span> : null}
          {low > 0 ? <span>{low} low</span> : null}
        </div>
        <Link
          to="/"
          className="ml-auto font-semibold text-brand-800 underline-offset-2 hover:underline"
        >
          Open forecast →
        </Link>
      </div>
    </div>
  )
}
