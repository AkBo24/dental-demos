import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, SearchInput } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { OverflowMenu } from '@/components/ui/OverflowMenu'
import {
  SupplyAvailabilityBadge,
  supplyStatusFromFlags,
} from '@/components/operations/SupplyAvailabilityBadge'
import { evaluateAppointmentSupplies } from '@/domain/forecastEngine'
import { useInventoryStore } from '@/store/inventoryStore'
import { useOperationsStore, type SupplyMutationPayload } from '@/store/operationsStore'
import { useToastStore } from '@/store/toastStore'
import { useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { cn } from '@/lib/utils'
import type {
  Appointment,
  InventoryItem,
  ProcedureSupplyRequirement,
  SupplyChangeScope,
} from '@/types'

type DialogState =
  | { type: 'idle' }
  | { type: 'edit'; req: ProcedureSupplyRequirement; item: InventoryItem }
  | { type: 'replace'; req: ProcedureSupplyRequirement; item: InventoryItem }
  | { type: 'add' }
  | { type: 'remove'; req: ProcedureSupplyRequirement; item: InventoryItem }
  | {
      type: 'scope'
      mutation: SupplyMutationPayload
      title: string
      summary: string
    }
  | { type: 'templateConfirm'; mutation: SupplyMutationPayload; summary: string }

function ScopeChooser({
  value,
  onChange,
}: {
  value: SupplyChangeScope
  onChange: (v: SupplyChangeScope) => void
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-ink">Apply changes to:</legend>
      <label
        className={cn(
          'flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors',
          value === 'visit' ? 'border-brand-600 bg-brand-50' : 'border-line hover:bg-slate-50',
        )}
      >
        <input
          type="radio"
          name="scope"
          className="mt-1"
          checked={value === 'visit'}
          onChange={() => onChange('visit')}
        />
        <span>
          <span className="block text-sm font-semibold text-ink">This Visit Only</span>
          <span className="mt-0.5 block text-xs text-muted">
            Only affects today&apos;s appointment. The procedure template stays unchanged.
          </span>
        </span>
      </label>
      <label
        className={cn(
          'flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors',
          value === 'template' ? 'border-brand-600 bg-brand-50' : 'border-line hover:bg-slate-50',
        )}
      >
        <input
          type="radio"
          name="scope"
          className="mt-1"
          checked={value === 'template'}
          onChange={() => onChange('template')}
        />
        <span>
          <span className="block text-sm font-semibold text-ink">Update Procedure Template</span>
          <span className="mt-0.5 block text-xs text-muted">
            Future procedures of this type will use the updated supply list.
          </span>
        </span>
      </label>
    </fieldset>
  )
}

function ItemPicker({
  items,
  selectedId,
  excludeIds,
  onSelect,
  error,
}: {
  items: InventoryItem[]
  selectedId: string
  excludeIds: string[]
  onSelect: (item: InventoryItem) => void
  error?: string
}) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((i) => !excludeIds.includes(i.id) || i.id === selectedId)
      .filter(
        (i) =>
          !q ||
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      )
      .slice(0, 40)
  }, [items, query, excludeIds, selectedId])

  return (
    <div className="space-y-2">
      <SearchInput value={query} onChange={setQuery} placeholder="Search inventory…" />
      <div className="max-h-48 overflow-y-auto rounded-md border border-line">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted">No matching supplies.</p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                'flex w-full items-start justify-between gap-2 border-b border-line px-3 py-3 text-left last:border-b-0',
                selectedId === item.id ? 'bg-brand-50' : 'hover:bg-slate-50',
              )}
            >
              <span>
                <span className="block text-sm font-medium text-ink">{item.name}</span>
                <span className="text-xs text-muted">
                  {item.sku} · {item.category} · On hand {item.currentQuantity} {item.unit}
                </span>
              </span>
              {selectedId === item.id ? (
                <span className="text-xs font-semibold text-brand-700">Selected</span>
              ) : null}
            </button>
          ))
        )}
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

export function RequiredSuppliesCard({ appointment }: { appointment: Appointment }) {
  const items = useInventoryStore((s) => s.items)
  const getItem = useInventoryStore((s) => s.getItem)
  const getRequirementsForVisit = useOperationsStore((s) => s.getRequirementsForVisit)
  const hasVisitOverride = useOperationsStore((s) => s.hasVisitOverride)
  const applySupplyChange = useOperationsStore((s) => s.applySupplyChange)
  const saving = useOperationsStore((s) => s.saving)
  const templateRequirements = useOperationsStore((s) => s.templateRequirements)
  const visitOverrides = useOperationsStore((s) => s.visitOverrides)
  const pushToast = useToastStore((s) => s.push)
  const forecast = useWeeklyForecast()

  const requirements = useMemo(
    () => getRequirementsForVisit(appointment.id, appointment.procedureTemplateId),
    [appointment.id, appointment.procedureTemplateId, getRequirementsForVisit, templateRequirements, visitOverrides],
  )

  const { lines } = evaluateAppointmentSupplies({
    appointment,
    template: undefined,
    requirements,
    inventory: items,
    forecastConsumptions: forecast.consumptions,
  })

  const [dialog, setDialog] = useState<DialogState>({ type: 'idle' })
  const [scope, setScope] = useState<SupplyChangeScope>('visit')
  const [qty, setQty] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [reason, setReason] = useState('')

  const resetForm = () => {
    setQty('')
    setNotes('')
    setSelectedItemId('')
    setFieldErrors({})
    setReason('')
    setScope('visit')
  }

  const closeDialog = () => {
    setDialog({ type: 'idle' })
    resetForm()
  }

  const openEdit = (req: ProcedureSupplyRequirement, item: InventoryItem) => {
    resetForm()
    setQty(String(req.quantity))
    setNotes(req.notes ?? '')
    setDialog({ type: 'edit', req, item })
  }

  const openReplace = (req: ProcedureSupplyRequirement, item: InventoryItem) => {
    resetForm()
    setSelectedItemId(req.itemId)
    setQty(String(req.quantity))
    setNotes(req.notes ?? '')
    setDialog({ type: 'replace', req, item })
  }

  const openAdd = () => {
    resetForm()
    setDialog({ type: 'add' })
  }

  const validateQuantity = (raw: string): number | null => {
    if (raw.trim() === '') {
      setFieldErrors((e) => ({ ...e, quantity: 'Quantity is required.' }))
      return null
    }
    const n = Number(raw)
    if (!Number.isFinite(n)) {
      setFieldErrors((e) => ({ ...e, quantity: 'Enter a valid number.' }))
      return null
    }
    if (n <= 0) {
      setFieldErrors((e) => ({ ...e, quantity: 'Quantity must be greater than zero.' }))
      return null
    }
    setFieldErrors((e) => {
      const { quantity: _, ...rest } = e
      return rest
    })
    return n
  }

  const requestScope = (mutation: SupplyMutationPayload, title: string, summary: string) => {
    setScope('visit')
    setDialog({ type: 'scope', mutation, title, summary })
  }

  const commit = async (mutation: SupplyMutationPayload, chosenScope: SupplyChangeScope) => {
    const result = await applySupplyChange({
      visitId: appointment.id,
      procedureId: appointment.procedureTemplateId,
      scope: chosenScope,
      mutation,
      reason: reason.trim() || undefined,
    })
    if (!result.ok) {
      pushToast({ type: 'error', title: 'Could not update supplies', description: result.error })
      return
    }
    pushToast({
      type: 'success',
      title: chosenScope === 'template' ? 'Procedure template updated' : 'Visit supplies updated',
      description: 'Inventory forecast and shortage warnings recalculated.',
    })
    closeDialog()
  }

  const submitEdit = () => {
    if (dialog.type !== 'edit') return
    const quantity = validateQuantity(qty)
    if (quantity === null) return
    requestScope(
      {
        action: 'edit_quantity',
        reqId: dialog.req.id,
        quantity,
        notes,
      },
      'Apply quantity change',
      `Update ${dialog.item.name} to ${quantity} ${dialog.item.unit}.`,
    )
  }

  const submitReplace = () => {
    if (dialog.type !== 'replace') return
    const item = getItem(selectedItemId)
    if (!item) {
      setFieldErrors({ supply: 'Select a supply.' })
      return
    }
    const quantity = validateQuantity(qty)
    if (quantity === null) return
    if (
      selectedItemId !== dialog.req.itemId &&
      requirements.some((r) => r.itemId === selectedItemId)
    ) {
      setFieldErrors({ supply: 'That supply is already on this visit.' })
      return
    }
    requestScope(
      {
        action: 'replace_supply',
        reqId: dialog.req.id,
        newItemId: item.id,
        unit: item.unit,
        quantity,
        notes,
      },
      'Apply supply replacement',
      `Replace ${dialog.item.name} with ${item.name}.`,
    )
  }

  const submitAdd = () => {
    if (dialog.type !== 'add') return
    const item = getItem(selectedItemId)
    if (!item) {
      setFieldErrors({ supply: 'Select a supply.' })
      return
    }
    const quantity = validateQuantity(qty)
    if (quantity === null) return
    if (requirements.some((r) => r.itemId === item.id)) {
      setFieldErrors({ supply: 'That supply is already on this visit.' })
      return
    }
    requestScope(
      {
        action: 'add_supply',
        itemId: item.id,
        quantity,
        unit: item.unit,
        notes,
      },
      'Apply new supply',
      `Add ${item.name} (${quantity} ${item.unit}).`,
    )
  }

  const confirmRemove = () => {
    if (dialog.type !== 'remove') return
    requestScope(
      { action: 'remove_supply', reqId: dialog.req.id },
      'Apply removal',
      `Remove ${dialog.item.name} from this visit.`,
    )
  }

  const confirmScope = () => {
    if (dialog.type !== 'scope') return
    if (scope === 'template') {
      setDialog({
        type: 'templateConfirm',
        mutation: dialog.mutation,
        summary: dialog.summary,
      })
      return
    }
    void commit(dialog.mutation, 'visit')
  }

  const existingItemIds = requirements.map((r) => r.itemId)
  const selectedItem = selectedItemId ? getItem(selectedItemId) : undefined

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader
          title="Required supplies"
          description="Availability for this visit and week demand"
          action={
            <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
              {hasVisitOverride(appointment.id) ? (
                <span className="rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold tracking-wide text-brand-800 uppercase ring-1 ring-brand-200">
                  Visit override
                </span>
              ) : null}
              <Button variant="outline" size="sm" onClick={openAdd}>
                <Plus className="h-4 w-4" />
                Add Supply
              </Button>
            </div>
          }
        />
        <ul className="divide-y divide-line">
          {lines.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted sm:px-5">
              No supplies required for this visit yet.
            </li>
          ) : (
            lines.map(({ req, item, stockNeeded, available, weekNeed, ok, warn }) => {
              const status = supplyStatusFromFlags({ available, stockNeeded, weekNeed, ok, warn })
              return (
                <li key={req.id} className="flex items-start gap-2 px-3 py-3 sm:gap-3 sm:px-5">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/inventory/${item.id}`}
                        className="font-medium text-ink hover:text-brand-700 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <SupplyAvailabilityBadge status={status} />
                      {!req.required ? (
                        <span className="text-[10px] font-semibold tracking-wide text-muted uppercase">
                          Optional
                        </span>
                      ) : null}
                    </div>
                    <dl className="grid grid-cols-1 gap-1 text-xs text-muted sm:grid-cols-3">
                      <div>
                        <dt className="inline text-slate-400">Need </dt>
                        <dd className="inline font-medium text-slate-700">
                          {stockNeeded.toFixed(2)} {item.unit}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline text-slate-400">On hand </dt>
                        <dd className="inline font-medium text-slate-700">
                          {available} {item.unit}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline text-slate-400">Week demand </dt>
                        <dd className="inline font-medium text-slate-700">
                          ~{weekNeed.toFixed(2)} {item.unit}
                        </dd>
                      </div>
                    </dl>
                    {req.notes ? (
                      <p className="text-xs text-slate-600">Note: {req.notes}</p>
                    ) : null}
                  </div>
                  <OverflowMenu
                    label={`Actions for ${item.name}`}
                    actions={[
                      {
                        id: 'edit',
                        label: 'Edit Quantity',
                        onSelect: () => openEdit(req, item),
                      },
                      {
                        id: 'replace',
                        label: 'Replace Supply',
                        onSelect: () => openReplace(req, item),
                      },
                      {
                        id: 'remove',
                        label: 'Remove Supply',
                        tone: 'danger',
                        onSelect: () => setDialog({ type: 'remove', req, item }),
                      },
                    ]}
                  />
                </li>
              )
            })
          )}
        </ul>
      </Card>

      {/* Edit quantity */}
      <Modal
        open={dialog.type === 'edit'}
        onClose={closeDialog}
        title="Edit Quantity"
        description={dialog.type === 'edit' ? dialog.item.name : undefined}
        footer={
          <>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={submitEdit}>Continue</Button>
          </>
        }
      >
        {dialog.type === 'edit' ? (
          <div className="space-y-4">
            <Input
              label="Quantity Required"
              type="number"
              min={0}
              step={0.01}
              value={qty}
              onChange={setQty}
              error={fieldErrors.quantity}
              required
            />
            <Input
              label="Unit"
              value={dialog.req.unit}
              onChange={() => undefined}
              readOnly
            />
            <p className="-mt-3 text-xs text-muted">Unit is set by the inventory item and cannot be changed.</p>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                placeholder="Chairside note for this supply…"
              />
            </label>
          </div>
        ) : null}
      </Modal>

      {/* Replace */}
      <Modal
        open={dialog.type === 'replace'}
        onClose={closeDialog}
        title="Replace Supply"
        description="Search inventory and choose a replacement."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={submitReplace}>Continue</Button>
          </>
        }
      >
        {dialog.type === 'replace' ? (
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Supply</p>
              <ItemPicker
                items={items}
                selectedId={selectedItemId}
                excludeIds={existingItemIds.filter((id) => id !== dialog.req.itemId)}
                onSelect={(item) => {
                  setSelectedItemId(item.id)
                  setFieldErrors((e) => {
                    const { supply: _, ...rest } = e
                    return rest
                  })
                }}
                error={fieldErrors.supply}
              />
            </div>
            <Input
              label="Quantity"
              type="number"
              min={0}
              step={0.01}
              value={qty}
              onChange={setQty}
              error={fieldErrors.quantity}
              required
            />
            <Input
              label="Unit"
              value={selectedItem?.unit ?? dialog.item.unit}
              onChange={() => undefined}
              readOnly
            />
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              />
            </label>
          </div>
        ) : null}
      </Modal>

      {/* Add */}
      <Modal
        open={dialog.type === 'add'}
        onClose={closeDialog}
        title="Add Supply"
        description="Search existing inventory items for this visit."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={submitAdd}>Continue</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs font-medium text-muted">
              Supply <span className="text-rose-600">*</span>
            </p>
            <ItemPicker
              items={items}
              selectedId={selectedItemId}
              excludeIds={existingItemIds}
              onSelect={(item) => {
                setSelectedItemId(item.id)
                setFieldErrors((e) => {
                  const { supply: _, ...rest } = e
                  return rest
                })
              }}
              error={fieldErrors.supply}
            />
          </div>
          <Input
            label="Quantity"
            type="number"
            min={0}
            step={0.01}
            value={qty}
            onChange={setQty}
            error={fieldErrors.quantity}
            required
          />
          <Input
            label="Unit"
            value={selectedItem?.unit ?? '—'}
            onChange={() => undefined}
            readOnly
          />
          <p className="-mt-3 text-xs text-muted">Unit fills automatically from the selected supply.</p>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
        </div>
      </Modal>

      {/* Remove confirm */}
      <Modal
        open={dialog.type === 'remove'}
        onClose={closeDialog}
        title="Remove supply"
        description="Remove this supply from this visit?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Remove
            </Button>
          </>
        }
      >
        {dialog.type === 'remove' ? (
          <p className="text-sm text-slate-700">
            <span className="font-medium text-ink">{dialog.item.name}</span> will be removed from the
            required supplies list for {appointment.patientName}.
          </p>
        ) : null}
      </Modal>

      {/* Scope chooser */}
      <Modal
        open={dialog.type === 'scope'}
        onClose={closeDialog}
        title={dialog.type === 'scope' ? dialog.title : 'Apply changes'}
        description={dialog.type === 'scope' ? dialog.summary : undefined}
        footer={
          <>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={confirmScope} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <ScopeChooser value={scope} onChange={setScope} />
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted">Reason (optional)</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 rounded-md border border-line px-3 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="e.g. Patient preference / chairside adjustment"
            />
          </label>
        </div>
      </Modal>

      {/* Template confirm */}
      <Modal
        open={dialog.type === 'templateConfirm'}
        onClose={closeDialog}
        title="Update procedure template?"
        description="This changes the supply list for future procedures of this type."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button
              loading={saving}
              onClick={() => {
                if (dialog.type !== 'templateConfirm') return
                void commit(dialog.mutation, 'template')
              }}
            >
              Update template
            </Button>
          </>
        }
      >
        {dialog.type === 'templateConfirm' ? (
          <p className="text-sm text-slate-700">{dialog.summary}</p>
        ) : null}
      </Modal>
    </>
  )
}
