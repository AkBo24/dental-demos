import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { categories } from '@/data/mockData'
import { getItemStatus } from '@/lib/utils'
import type { InventoryStatus } from '@/types'
import { SearchInput, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  InventoryTable,
  sortItems,
  type SortKey,
} from '@/components/inventory/InventoryTable'

const statusOptions: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'Out of Stock', label: 'Out of Stock' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Low', label: 'Low' },
  { value: 'Healthy', label: 'Healthy' },
]

export function InventoryListPage() {
  const items = useInventoryStore((s) => s.items)
  const getVendor = useInventoryStore((s) => s.getVendor)
  const addToPurchaseList = useInventoryStore((s) => s.addToPurchaseList)
  const pushToast = useToastStore((s) => s.push)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [vendorId, setVendorId] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('status')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const vendors = useInventoryStore((s) => s.vendors)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = items.filter((item) => {
      const vendor = getVendor(item.vendorId)
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        vendor?.name.toLowerCase().includes(q) ||
        item.storageLocation.toLowerCase().includes(q)
      const matchesCategory = category === 'all' || item.category === category
      const itemStatus = getItemStatus(item)
      const matchesStatus = status === 'all' || itemStatus === (status as InventoryStatus)
      const matchesVendor = vendorId === 'all' || item.vendorId === vendorId
      return matchesQuery && matchesCategory && matchesStatus && matchesVendor
    })

    return sortItems(result, sortKey, sortDir, (id) => getVendor(id)?.name ?? '')
  }, [items, query, category, status, vendorId, sortKey, sortDir, getVendor])

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'category' || key === 'vendor' ? 'asc' : 'asc')
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
    if (filtered.every((i) => selected.has(i.id))) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((i) => i.id)))
    }
  }

  const handleAddToList = () => {
    const added = addToPurchaseList([...selected])
    if (added === 0) {
      pushToast({
        type: 'info',
        title: 'Nothing new added',
        description: 'Selected items are already on the purchase list.',
      })
    } else {
      pushToast({
        type: 'success',
        title: `Added ${added} item${added === 1 ? '' : 's'}`,
        description: 'Review quantities on the Purchase List.',
      })
      setSelected(new Set())
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Inventory</h1>
          <p className="mt-1 text-sm text-muted">
            {filtered.length} of {items.length} items
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/receive">
            <Button variant="outline" size="sm">
              Receive
            </Button>
          </Link>
          <Button
            size="sm"
            disabled={selected.size === 0}
            onClick={handleAddToList}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to purchase list ({selected.size})
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search name, SKU, location…"
            className="md:col-span-2 xl:col-span-1"
          />
          <Select
            value={category}
            onChange={setCategory}
            options={[
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Select value={status} onChange={setStatus} options={statusOptions} />
          <Select
            value={vendorId}
            onChange={setVendorId}
            options={[
              { value: 'all', label: 'All vendors' },
              ...vendors.map((v) => ({ value: v.id, label: v.name })),
            ]}
          />
        </div>
      </Card>

      <Card>
        <InventoryTable
          items={filtered}
          selectable
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
