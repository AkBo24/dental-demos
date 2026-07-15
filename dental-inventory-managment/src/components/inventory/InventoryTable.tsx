import { Link } from 'react-router-dom'
import type { InventoryItem, InventoryStatus } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getItemStatus, cn } from '@/lib/utils'
import { useInventoryStore } from '@/store/inventoryStore'
import { EmptyState } from '@/components/ui/EmptyState'
import { PackageSearch } from 'lucide-react'

export type SortKey =
  | 'name'
  | 'category'
  | 'quantity'
  | 'status'
  | 'vendor'
  | 'lastRestocked'

const statusOrder: Record<InventoryStatus, number> = {
  'Out of Stock': 0,
  Critical: 1,
  Low: 2,
  Healthy: 3,
}

export function sortItems(
  items: InventoryItem[],
  sortKey: SortKey,
  sortDir: 'asc' | 'desc',
  getVendorName: (id: string) => string,
): InventoryItem[] {
  const sorted = [...items].sort((a, b) => {
    let cmp = 0
    switch (sortKey) {
      case 'name':
        cmp = a.name.localeCompare(b.name)
        break
      case 'category':
        cmp = a.category.localeCompare(b.category)
        break
      case 'quantity':
        cmp = a.currentQuantity - b.currentQuantity
        break
      case 'status':
        cmp = statusOrder[getItemStatus(a)] - statusOrder[getItemStatus(b)]
        break
      case 'vendor':
        cmp = getVendorName(a.vendorId).localeCompare(getVendorName(b.vendorId))
        break
      case 'lastRestocked':
        cmp = a.lastRestocked.localeCompare(b.lastRestocked)
        break
    }
    return sortDir === 'asc' ? cmp : -cmp
  })
  return sorted
}

export function InventoryTable({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  sortKey,
  sortDir,
  onSort,
  selectable = false,
  compact = false,
}: {
  items: InventoryItem[]
  selectedIds?: Set<string>
  onToggle?: (id: string) => void
  onToggleAll?: () => void
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  selectable?: boolean
  compact?: boolean
}) {
  const getVendor = useInventoryStore((s) => s.getVendor)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No items match"
        description="Try adjusting your search or filters to find inventory."
      />
    )
  }

  const allSelected = selectable && items.every((i) => selectedIds?.has(i.id))

  const SortHeader = ({
    label,
    column,
    className,
  }: {
    label: string
    column: SortKey
    className?: string
  }) => (
    <th className={cn('px-3 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase', className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-ink"
        onClick={() => onSort(column)}
      >
        {label}
        {sortKey === column ? (
          <span className="text-brand-700">{sortDir === 'asc' ? '↑' : '↓'}</span>
        ) : null}
      </button>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-sm">
        <thead className="border-b border-line bg-slate-50">
          <tr>
            {selectable ? (
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Select all"
                  className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-600"
                />
              </th>
            ) : null}
            <SortHeader label="Item" column="name" />
            <SortHeader label="Category" column="category" />
            {!compact ? <th className="px-3 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">SKU</th> : null}
            <SortHeader label="Vendor" column="vendor" />
            <SortHeader label="Qty" column="quantity" />
            <SortHeader label="Status" column="status" />
            {!compact ? (
              <th className="px-3 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                Location
              </th>
            ) : null}
            <SortHeader label="Restocked" column="lastRestocked" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const status = getItemStatus(item)
            const vendor = getVendor(item.vendorId)
            return (
              <tr key={item.id} className="table-row-interactive border-b border-line last:border-0">
                {selectable ? (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds?.has(item.id) ?? false}
                      onChange={() => onToggle?.(item.id)}
                      aria-label={`Select ${item.name}`}
                      className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-600"
                    />
                  </td>
                ) : null}
                <td className="px-3 py-3">
                  <Link
                    to={`/inventory/${item.id}`}
                    className="font-medium text-ink hover:text-brand-700 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">
                    Min {item.minimumQuantity} · Reorder {item.preferredReorderQuantity}
                  </p>
                </td>
                <td className="px-3 py-3 text-slate-600">{item.category}</td>
                {!compact ? (
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">{item.sku}</td>
                ) : null}
                <td className="px-3 py-3 text-slate-600">{vendor?.name ?? '—'}</td>
                <td className="px-3 py-3">
                  <span className="font-semibold tabular-nums text-ink">{item.currentQuantity}</span>
                  <span className="ml-1 text-muted">{item.unit}</span>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={status} />
                </td>
                {!compact ? (
                  <td className="px-3 py-3 text-slate-600">{item.storageLocation}</td>
                ) : null}
                <td className="px-3 py-3 tabular-nums text-slate-600">{item.lastRestocked}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
