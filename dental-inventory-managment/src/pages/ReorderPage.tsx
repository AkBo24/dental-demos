import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { getItemStatus } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import {
  InventoryTable,
  sortItems,
  type SortKey,
} from '@/components/inventory/InventoryTable'

export function ReorderPage() {
  const items = useInventoryStore((s) => s.items)
  const getVendor = useInventoryStore((s) => s.getVendor)
  const purchaseList = useInventoryStore((s) => s.purchaseList)
  const addToPurchaseList = useInventoryStore((s) => s.addToPurchaseList)
  const pushToast = useToastStore((s) => s.push)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey>('status')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const attentionItems = useMemo(() => {
    const low = items.filter((i) => getItemStatus(i) !== 'Healthy')
    return sortItems(low, sortKey, sortDir, (id) => getVendor(id)?.name ?? '')
  }, [items, sortKey, sortDir, getVendor])

  const onSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (attentionItems.every((i) => selected.has(i.id))) setSelected(new Set())
    else setSelected(new Set(attentionItems.map((i) => i.id)))
  }

  const selectAllNeedingAttention = () => {
    setSelected(new Set(attentionItems.map((i) => i.id)))
  }

  const handleAdd = () => {
    const ids = [...selected]
    const added = addToPurchaseList(ids)
    if (added === 0) {
      pushToast({
        type: 'info',
        title: 'Already on list',
        description: 'Selected items are already on the purchase list.',
      })
    } else {
      pushToast({
        type: 'success',
        title: `Added ${added} item${added === 1 ? '' : 's'} to purchase list`,
        description: 'Adjust quantities, then submit the list.',
      })
      setSelected(new Set())
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Reorder workflow</h1>
          <p className="mt-1 text-sm text-muted">
            Identify low stock, select what to buy, and queue a purchase list — under two minutes.
          </p>
        </div>
        <Link to="/purchase-list">
          <Button variant="outline" size="sm">
            View purchase list ({purchaseList.items.length})
          </Button>
        </Link>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {[
          { step: '1', title: 'Review low stock', body: 'Out of stock, critical, and low items' },
          { step: '2', title: 'Select & add', body: 'Multi-select items for the purchase list' },
          { step: '3', title: 'Adjust & submit', body: 'Set quantities and mark the list submitted' },
        ].map((s) => (
          <div key={s.step} className="rounded-lg border border-line bg-white px-4 py-3">
            <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
              Step {s.step}
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{s.title}</p>
            <p className="text-xs text-muted">{s.body}</p>
          </div>
        ))}
      </ol>

      <Card>
        <CardHeader
          title={`${attentionItems.length} items need attention`}
          description="Sorted by urgency by default"
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={selectAllNeedingAttention}>
                Select all
              </Button>
              <Button size="sm" disabled={selected.size === 0} onClick={handleAdd}>
                <ShoppingCart className="h-4 w-4" />
                Add to list ({selected.size})
              </Button>
            </div>
          }
        />
        <InventoryTable
          items={attentionItems}
          selectable
          compact
          selectedIds={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
        />
      </Card>
    </div>
  )
}
