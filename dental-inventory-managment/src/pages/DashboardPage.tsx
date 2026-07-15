import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Package,
  PackageCheck,
  PackageX,
} from 'lucide-react'
import { useInventoryStore } from '@/store/inventoryStore'
import { getItemStatus, currency } from '@/lib/utils'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export function DashboardPage() {
  const navigate = useNavigate()
  const items = useInventoryStore((s) => s.items)
  const purchaseList = useInventoryStore((s) => s.purchaseList)
  const getVendor = useInventoryStore((s) => s.getVendor)
  const getItem = useInventoryStore((s) => s.getItem)
  const recentlyReceived = useInventoryStore((s) => s.getRecentlyReceived)(5)

  const outOfStock = items.filter((i) => getItemStatus(i) === 'Out of Stock')
  const critical = items.filter((i) => getItemStatus(i) === 'Critical')
  const low = items.filter((i) => getItemStatus(i) === 'Low')
  const healthy = items.filter((i) => getItemStatus(i) === 'Healthy')
  const attention = [...outOfStock, ...critical, ...low]

  const purchaseTotal = purchaseList.items.reduce(
    (sum, line) => sum + line.quantity * line.unitCost,
    0,
  )

  const stats = [
    {
      label: 'Out of stock',
      value: outOfStock.length,
      icon: PackageX,
      tone: 'text-rose-700 bg-rose-50',
    },
    {
      label: 'Critical / Low',
      value: critical.length + low.length,
      icon: AlertTriangle,
      tone: 'text-amber-700 bg-amber-50',
    },
    {
      label: 'Healthy',
      value: healthy.length,
      icon: Package,
      tone: 'text-emerald-700 bg-emerald-50',
    },
    {
      label: 'On purchase list',
      value: purchaseList.items.length,
      icon: ClipboardList,
      tone: 'text-brand-800 bg-brand-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            What needs your attention today — {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/receive">
            <Button variant="outline" size="sm">
              Receive inventory
            </Button>
          </Link>
          <Link to="/reorder">
            <Button size="sm">
              Start reorder
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-md ${stat.tone}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-ink">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Items needing attention"
            description="Out of stock, critical, and low inventory"
            action={
              <Link to="/reorder" className="text-sm font-semibold text-brand-700 hover:underline">
                Reorder
              </Link>
            }
          />
          {attention.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              title="All stocked up"
              description="No items are below minimum levels right now."
            />
          ) : (
            <ul className="divide-y divide-line">
              {attention.slice(0, 8).map((item) => {
                const status = getItemStatus(item)
                return (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/inventory/${item.id}`}
                        className="font-medium text-ink hover:text-brand-700 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {item.currentQuantity} {item.unit} · min {item.minimumQuantity} ·{' '}
                        {getVendor(item.vendorId)?.name}
                      </p>
                    </div>
                    <StatusBadge status={status} />
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Pending purchase list"
            description={`${purchaseList.items.length} items · ${currency(purchaseTotal)}`}
            action={
              <Link
                to="/purchase-list"
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                Open
              </Link>
            }
          />
          {purchaseList.items.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Purchase list is empty"
              description="Add low-stock items from the reorder workflow."
              actionLabel="Go to reorder"
              onAction={() => navigate('/reorder')}
            />
          ) : (
            <ul className="divide-y divide-line">
              {purchaseList.items.slice(0, 6).map((line) => {
                const item = getItem(line.itemId)
                if (!item) return null
                return (
                  <li key={line.itemId} className="flex justify-between gap-2 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-muted">
                        Qty {line.quantity} · {currency(line.unitCost)} each
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-ink">
                      {currency(line.quantity * line.unitCost)}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recently received" description="Latest restocks recorded" />
          {recentlyReceived.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              title="No receipts yet"
              description="Record incoming shipments from the Receive page."
            />
          ) : (
            <ul className="divide-y divide-line">
              {recentlyReceived.map((txn) => {
                const item = getItem(txn.itemId)
                return (
                  <li key={txn.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <div>
                      <p className="text-sm font-medium text-ink">{item?.name ?? 'Unknown item'}</p>
                      <p className="text-xs text-muted">
                        +{txn.quantity} {item?.unit} · {txn.date}
                        {txn.reference ? ` · ${txn.reference}` : ''}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Inventory summary" description="Stock health across the practice" />
          <div className="space-y-4 px-4 py-4 sm:px-5">
            {[
              { label: 'Healthy', count: healthy.length, color: 'bg-emerald-500' },
              { label: 'Low', count: low.length, color: 'bg-amber-500' },
              { label: 'Critical', count: critical.length, color: 'bg-orange-500' },
              { label: 'Out of Stock', count: outOfStock.length, color: 'bg-rose-500' },
            ].map((row) => {
              const pct = items.length ? Math.round((row.count / items.length) * 100) : 0
              return (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600">{row.label}</span>
                    <span className="font-medium tabular-nums text-ink">
                      {row.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            <p className="text-xs text-muted">{items.length} SKUs tracked in this practice</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
