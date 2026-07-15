import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, PackagePlus, ShoppingCart } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { getItemStatus, currency } from '@/lib/utils'
import { unitCosts } from '@/data/mockData'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { PackageSearch } from 'lucide-react'

export function InventoryDetailPage() {
  const { id } = useParams()
  const item = useInventoryStore((s) => s.getItem(id ?? ''))
  const getVendor = useInventoryStore((s) => s.getVendor)
  const transactions = useInventoryStore((s) => s.transactions)
  const addToPurchaseList = useInventoryStore((s) => s.addToPurchaseList)
  const pushToast = useToastStore((s) => s.push)

  if (!item) {
    return (
      <ErrorState message="This inventory item could not be found. It may have been removed." />
    )
  }

  const vendor = getVendor(item.vendorId)
  const status = getItemStatus(item)
  const history = transactions
    .filter((t) => t.itemId === item.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  const usage = history.filter((t) => t.type === 'used')
  const purchases = history.filter(
    (t) => t.type === 'received' || t.type === 'purchase_submitted',
  )

  const handleAdd = () => {
    const added = addToPurchaseList([item.id])
    pushToast({
      type: added ? 'success' : 'info',
      title: added ? 'Added to purchase list' : 'Already on purchase list',
      description: added
        ? `${item.preferredReorderQuantity} ${item.unit} queued for reorder.`
        : undefined,
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/inventory"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inventory
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{item.name}</h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 font-mono text-sm text-muted">{item.sku}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/receive?item=${item.id}`}>
            <Button variant="outline" size="sm">
              <PackagePlus className="h-4 w-4" />
              Receive stock
            </Button>
          </Link>
          <Button size="sm" onClick={handleAdd}>
            <ShoppingCart className="h-4 w-4" />
            Add to purchase list
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Item information" />
          <dl className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-5">
            {[
              ['Category', item.category],
              ['Vendor', vendor?.name ?? '—'],
              ['Storage location', item.storageLocation],
              ['Unit', item.unit],
              ['Minimum quantity', String(item.minimumQuantity)],
              ['Preferred reorder qty', String(item.preferredReorderQuantity)],
              ['Last restocked', item.lastRestocked],
              ['Est. unit cost', currency(unitCosts[item.id] ?? 0)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium tracking-wide text-muted uppercase">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {item.notes ? (
            <div className="border-t border-line px-4 py-4 sm:px-5">
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Notes</p>
              <p className="mt-1 text-sm text-slate-700">{item.notes}</p>
            </div>
          ) : null}
        </Card>

        <Card>
          <CardHeader title="Current stock" />
          <div className="px-4 py-5 sm:px-5">
            <p className="text-4xl font-bold tabular-nums text-ink">
              {item.currentQuantity}
              <span className="ml-2 text-base font-medium text-muted">{item.unit}</span>
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Minimum</span>
                <span className="font-medium">{item.minimumQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Preferred vendor</span>
                <span className="font-medium text-right">{vendor?.name}</span>
              </div>
              {vendor ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted">Lead time</span>
                    <span className="font-medium">{vendor.leadTimeDays} days</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted">Contact</span>
                    <span className="text-right text-xs">{vendor.contactEmail}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Usage history" description="Mock consumption events" />
          {usage.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No usage recorded"
              description="Usage will appear here as stock is consumed."
            />
          ) : (
            <ul className="divide-y divide-line">
              {usage.map((t) => (
                <li key={t.id} className="flex justify-between gap-3 px-4 py-3 sm:px-5">
                  <div>
                    <p className="text-sm font-medium text-ink">Used {t.quantity} {item.unit}</p>
                    <p className="text-xs text-muted">{t.note || 'No note'}</p>
                  </div>
                  <time className="text-xs tabular-nums text-muted">
                    {format(parseISO(t.date), 'MMM d, yyyy')}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Purchase history" description="Receipts and submitted orders" />
          {purchases.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No purchase history"
              description="Receives and purchase list submissions will show here."
            />
          ) : (
            <ul className="divide-y divide-line">
              {purchases.map((t) => (
                <li key={t.id} className="flex justify-between gap-3 px-4 py-3 sm:px-5">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {t.type === 'received' ? 'Received' : 'Order submitted'} · {t.quantity}{' '}
                      {item.unit}
                    </p>
                    <p className="text-xs text-muted">
                      {t.reference ? `${t.reference} · ` : ''}
                      {t.note || '—'}
                    </p>
                  </div>
                  <time className="text-xs tabular-nums text-muted">
                    {format(parseISO(t.date), 'MMM d, yyyy')}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
