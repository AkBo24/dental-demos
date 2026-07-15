import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { currency, getItemStatus } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { ClipboardList } from 'lucide-react'

export function PurchaseListPage() {
  const navigate = useNavigate()
  const purchaseList = useInventoryStore((s) => s.purchaseList)
  const submittedLists = useInventoryStore((s) => s.submittedLists)
  const getItem = useInventoryStore((s) => s.getItem)
  const getVendor = useInventoryStore((s) => s.getVendor)
  const updatePurchaseQuantity = useInventoryStore((s) => s.updatePurchaseQuantity)
  const removeFromPurchaseList = useInventoryStore((s) => s.removeFromPurchaseList)
  const clearPurchaseList = useInventoryStore((s) => s.clearPurchaseList)
  const submitPurchaseList = useInventoryStore((s) => s.submitPurchaseList)
  const pushToast = useToastStore((s) => s.push)

  const [notes, setNotes] = useState(purchaseList.notes ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [lastPo, setLastPo] = useState<string | null>(null)

  const total = purchaseList.items.reduce(
    (sum, line) => sum + line.quantity * line.unitCost,
    0,
  )

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    const po = submitPurchaseList(notes)
    setSubmitting(false)
    setConfirmOpen(false)
    if (!po) {
      pushToast({ type: 'error', title: 'Could not submit', description: 'Purchase list is empty.' })
      return
    }
    setLastPo(po.id.toUpperCase())
    setNotes('')
    pushToast({
      type: 'success',
      title: 'Purchase list submitted',
      description: `Mock PO ${po.id.toUpperCase()} created. No vendor integration in this prototype.`,
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Purchase list</h1>
          <p className="mt-1 text-sm text-muted">
            Adjust quantities, then mark as submitted. Vendor integrations are out of scope.
          </p>
        </div>
        <Link to="/reorder">
          <Button variant="outline" size="sm">
            Add more items
          </Button>
        </Link>
      </div>

      {lastPo ? (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Mock purchase order generated</p>
            <p className="mt-0.5">
              Reference <span className="font-mono font-medium">{lastPo}</span> — print or email
              offline. Integrate suppliers later.
            </p>
          </div>
        </div>
      ) : null}

      <Card>
        <CardHeader
          title="Draft list"
          description={
            purchaseList.items.length
              ? `${purchaseList.items.length} line items · ${currency(total)} estimated`
              : 'No items queued'
          }
          action={
            purchaseList.items.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)}>
                Clear all
              </Button>
            ) : null
          }
        />

        {purchaseList.items.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Purchase list is empty"
            description="Use the reorder workflow to add low-stock supplies."
            actionLabel="Go to reorder"
            onAction={() => navigate('/reorder')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b border-line bg-slate-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                      Item
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                      Vendor
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold tracking-wide text-muted uppercase">
                      Line total
                    </th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {purchaseList.items.map((line) => {
                    const item = getItem(line.itemId)
                    if (!item) return null
                    const vendor = getVendor(item.vendorId)
                    return (
                      <tr key={line.itemId} className="border-b border-line last:border-0">
                        <td className="px-4 py-3">
                          <Link
                            to={`/inventory/${item.id}`}
                            className="font-medium text-ink hover:text-brand-700 hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted">
                            On hand {item.currentQuantity} · preferred {item.preferredReorderQuantity}{' '}
                            {item.unit}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{vendor?.name}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={getItemStatus(item)} />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={1}
                            value={line.quantity}
                            onChange={(e) =>
                              updatePurchaseQuantity(line.itemId, Number(e.target.value) || 1)
                            }
                            className="h-9 w-24 rounded-md border border-line px-2 tabular-nums focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">
                          {currency(line.quantity * line.unitCost)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              removeFromPurchaseList(line.itemId)
                              pushToast({
                                type: 'info',
                                title: 'Removed from list',
                                description: item.name,
                              })
                            }}
                            className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 border-t border-line px-4 py-4 sm:px-5">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted">Order notes</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Delivery instructions, priority items, etc."
                  className="rounded-md border border-line px-3 py-2 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  Estimated total{' '}
                  <span className="text-lg font-bold tabular-nums text-ink">{currency(total)}</span>
                </p>
                <Button onClick={() => setConfirmOpen(true)}>
                  Mark as submitted
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {submittedLists.length > 0 ? (
        <Card>
          <CardHeader title="Recently submitted" description="Mock purchase orders this session" />
          <ul className="divide-y divide-line">
            {submittedLists.map((po) => {
              const poTotal = po.items.reduce((s, l) => s + l.quantity * l.unitCost, 0)
              return (
                <li key={po.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
                  <div>
                    <p className="font-mono text-sm font-semibold text-ink">{po.id.toUpperCase()}</p>
                    <p className="text-xs text-muted">
                      {po.items.length} items · submitted{' '}
                      {po.submittedAt
                        ? new Date(po.submittedAt).toLocaleString()
                        : '—'}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{currency(poTotal)}</p>
                </li>
              )
            })}
          </ul>
        </Card>
      ) : null}

      <Modal
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        title="Submit purchase list?"
        description="This generates a mock purchase order. No vendor API calls are made."
        footer={
          <>
            <Button variant="outline" disabled={submitting} onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button loading={submitting} onClick={handleSubmit}>
              Confirm submit
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">
          Submit <strong>{purchaseList.items.length}</strong> line items totaling{' '}
          <strong>{currency(total)}</strong>?
        </p>
      </Modal>

      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear purchase list?"
        description="All draft line items will be removed."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearPurchaseList()
                setClearOpen(false)
                setNotes('')
                pushToast({ type: 'info', title: 'Purchase list cleared' })
              }}
            >
              Clear list
            </Button>
          </>
        }
      />
    </div>
  )
}
