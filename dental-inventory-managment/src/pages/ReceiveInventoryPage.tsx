import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { getItemStatus } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/ui/Modal'

export function ReceiveInventoryPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const items = useInventoryStore((s) => s.items)
  const receiveInventory = useInventoryStore((s) => s.receiveInventory)
  const getItem = useInventoryStore((s) => s.getItem)
  const pushToast = useToastStore((s) => s.push)

  const [itemId, setItemId] = useState(params.get('item') ?? '')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<{ item?: string; quantity?: string }>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const selected = itemId ? getItem(itemId) : undefined

  const itemOptions = useMemo(
    () => [
      { value: '', label: 'Select an item…' },
      ...[...items]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((i) => ({
          value: i.id,
          label: `${i.name} (${i.currentQuantity} ${i.unit})`,
        })),
    ],
    [items],
  )

  const validate = () => {
    const next: typeof errors = {}
    if (!itemId) next.item = 'Select an inventory item.'
    const qty = Number(quantity)
    if (!quantity || Number.isNaN(qty) || qty <= 0) {
      next.quantity = 'Enter a quantity greater than zero.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setConfirmOpen(true)
  }

  const confirmReceive = async () => {
    if (!selected) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 350))
    receiveInventory(selected.id, Number(quantity), date, note || undefined)
    setSubmitting(false)
    setConfirmOpen(false)
    pushToast({
      type: 'success',
      title: 'Inventory updated',
      description: `Received ${quantity} ${selected.unit} of ${selected.name}.`,
    })
    navigate(`/inventory/${selected.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Receive inventory</h1>
        <p className="mt-1 text-sm text-muted">
          Record a shipment and update on-hand counts immediately.
        </p>
      </div>

      <Card>
        <CardHeader title="Receipt details" description="All fields update live inventory" />
        <form onSubmit={onSubmit} className="space-y-4 px-4 py-4 sm:px-5">
          <div>
            <Select
              label="Item"
              value={itemId}
              onChange={(v) => {
                setItemId(v)
                setErrors((e) => ({ ...e, item: undefined }))
              }}
              options={itemOptions}
            />
            {errors.item ? <p className="mt-1 text-xs text-rose-600">{errors.item}</p> : null}
          </div>

          {selected ? (
            <div className="rounded-md border border-line bg-slate-50 px-3 py-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{selected.name}</p>
                  <p className="text-xs text-muted">
                    Current: {selected.currentQuantity} {selected.unit} · Min{' '}
                    {selected.minimumQuantity} · {selected.storageLocation}
                  </p>
                </div>
                <StatusBadge status={getItemStatus(selected)} />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Quantity received"
              type="number"
              min={1}
              step={1}
              value={quantity}
              required
              error={errors.quantity}
              onChange={(v) => {
                setQuantity(v)
                setErrors((e) => ({ ...e, quantity: undefined }))
              }}
            />
            <Input
              label="Received date"
              type="date"
              value={date}
              required
              onChange={setDate}
            />
          </div>

          <Input
            label="Note (optional)"
            value={note}
            placeholder="PO number, packing slip, etc."
            onChange={setNote}
          />

          {selected && quantity && Number(quantity) > 0 ? (
            <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-900">
              New on-hand quantity will be{' '}
              <strong>
                {selected.currentQuantity + Number(quantity)} {selected.unit}
              </strong>
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">
              <PackageCheck className="h-4 w-4" />
              Update inventory
            </Button>
          </div>
        </form>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        title="Confirm receipt"
        description="This will immediately update the on-hand count."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={confirmReceive} loading={submitting}>
              Confirm receive
            </Button>
          </>
        }
      >
        {selected ? (
          <p className="text-sm text-slate-700">
            Receive <strong>{quantity} {selected.unit}</strong> of{' '}
            <strong>{selected.name}</strong> dated <strong>{date}</strong>?
          </p>
        ) : null}
      </Modal>
    </div>
  )
}
