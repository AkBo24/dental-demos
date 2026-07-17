import { create } from 'zustand'
import { procedureRequirements as seedRequirements } from '@/data/mockData'
import type {
  ProcedureSupplyRequirement,
  SupplyAuditAction,
  SupplyAuditEntry,
  SupplyChangeScope,
} from '@/types'

const DEMO_USER = 'Office Manager'

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function cloneReqs(reqs: ProcedureSupplyRequirement[]): ProcedureSupplyRequirement[] {
  return reqs.map((r) => ({ ...r }))
}

export type SupplyMutationPayload =
  | {
      action: 'edit_quantity'
      reqId: string
      quantity: number
      notes?: string
    }
  | {
      action: 'replace_supply'
      reqId: string
      newItemId: string
      unit: string
      quantity?: number
      notes?: string
    }
  | {
      action: 'remove_supply'
      reqId: string
    }
  | {
      action: 'add_supply'
      itemId: string
      quantity: number
      unit: string
      notes?: string
      required?: boolean
    }

interface OperationsState {
  templateRequirements: ProcedureSupplyRequirement[]
  /** Full BOM override per visit. Missing key = use template. */
  visitOverrides: Record<string, ProcedureSupplyRequirement[]>
  auditLog: SupplyAuditEntry[]
  saving: boolean
  lastError: string | null

  getRequirementsForTemplate: (templateId: string) => ProcedureSupplyRequirement[]
  getRequirementsForVisit: (
    visitId: string,
    templateId: string,
  ) => ProcedureSupplyRequirement[]
  hasVisitOverride: (visitId: string) => boolean

  applySupplyChange: (params: {
    visitId: string
    procedureId: string
    scope: SupplyChangeScope
    mutation: SupplyMutationPayload
    reason?: string
  }) => Promise<{ ok: true } | { ok: false; error: string }>
}

function describeReq(req: ProcedureSupplyRequirement | undefined): string {
  if (!req) return '(none)'
  return `${req.itemId} qty=${req.quantity} unit=${req.unit}${req.notes ? ` notes="${req.notes}"` : ''}`
}

function applyMutation(
  list: ProcedureSupplyRequirement[],
  procedureId: string,
  mutation: SupplyMutationPayload,
): { next: ProcedureSupplyRequirement[]; error?: string; oldValue: string; newValue: string; itemId?: string; action: SupplyAuditAction } {
  const next = cloneReqs(list)

  if (mutation.action === 'edit_quantity') {
    const idx = next.findIndex((r) => r.id === mutation.reqId)
    if (idx < 0) return { next: list, error: 'Supply not found.', oldValue: '', newValue: '', action: 'edit_quantity' }
    if (!Number.isFinite(mutation.quantity) || mutation.quantity <= 0) {
      return { next: list, error: 'Quantity must be greater than zero.', oldValue: '', newValue: '', action: 'edit_quantity' }
    }
    const old = next[idx]
    next[idx] = {
      ...old,
      quantity: mutation.quantity,
      notes: mutation.notes?.trim() ? mutation.notes.trim() : undefined,
    }
    return {
      next,
      oldValue: describeReq(old),
      newValue: describeReq(next[idx]),
      itemId: old.itemId,
      action: 'edit_quantity',
    }
  }

  if (mutation.action === 'replace_supply') {
    const idx = next.findIndex((r) => r.id === mutation.reqId)
    if (idx < 0) return { next: list, error: 'Supply not found.', oldValue: '', newValue: '', action: 'replace_supply' }
    const duplicate = next.some((r, i) => i !== idx && r.itemId === mutation.newItemId)
    if (duplicate) {
      return {
        next: list,
        error: 'That supply is already on this visit.',
        oldValue: '',
        newValue: '',
        action: 'replace_supply',
      }
    }
    const old = next[idx]
    next[idx] = {
      ...old,
      itemId: mutation.newItemId,
      unit: mutation.unit,
      quantity: mutation.quantity ?? old.quantity,
      notes: mutation.notes?.trim() ? mutation.notes.trim() : old.notes,
    }
    return {
      next,
      oldValue: describeReq(old),
      newValue: describeReq(next[idx]),
      itemId: mutation.newItemId,
      action: 'replace_supply',
    }
  }

  if (mutation.action === 'remove_supply') {
    const idx = next.findIndex((r) => r.id === mutation.reqId)
    if (idx < 0) return { next: list, error: 'Supply not found.', oldValue: '', newValue: '', action: 'remove_supply' }
    const old = next[idx]
    next.splice(idx, 1)
    return {
      next,
      oldValue: describeReq(old),
      newValue: '(removed)',
      itemId: old.itemId,
      action: 'remove_supply',
    }
  }

  // add_supply
  if (!Number.isFinite(mutation.quantity) || mutation.quantity <= 0) {
    return { next: list, error: 'Quantity must be greater than zero.', oldValue: '', newValue: '', action: 'add_supply' }
  }
  if (!mutation.itemId) {
    return { next: list, error: 'Select a supply.', oldValue: '', newValue: '', action: 'add_supply' }
  }
  if (next.some((r) => r.itemId === mutation.itemId)) {
    return {
      next: list,
      error: 'That supply is already on this visit.',
      oldValue: '',
      newValue: '',
      action: 'add_supply',
    }
  }
  const created: ProcedureSupplyRequirement = {
    id: uid(`${procedureId}-r`),
    procedureTemplateId: procedureId,
    itemId: mutation.itemId,
    quantity: mutation.quantity,
    unit: mutation.unit,
    required: mutation.required ?? true,
    wastePercent: 5,
    notes: mutation.notes?.trim() ? mutation.notes.trim() : undefined,
  }
  next.push(created)
  return {
    next,
    oldValue: '(none)',
    newValue: describeReq(created),
    itemId: created.itemId,
    action: 'add_supply',
  }
}

/** Simulate network latency / occasional failure for optimistic UX demo */
async function simulatePersist(): Promise<void> {
  await new Promise((r) => setTimeout(r, 280))
}

export const useOperationsStore = create<OperationsState>((set, get) => ({
  templateRequirements: cloneReqs(seedRequirements),
  visitOverrides: {},
  auditLog: [],
  saving: false,
  lastError: null,

  getRequirementsForTemplate: (templateId) =>
    get().templateRequirements.filter((r) => r.procedureTemplateId === templateId),

  getRequirementsForVisit: (visitId, templateId) => {
    const override = get().visitOverrides[visitId]
    if (override) return override
    return get().getRequirementsForTemplate(templateId)
  },

  hasVisitOverride: (visitId) => Boolean(get().visitOverrides[visitId]),

  applySupplyChange: async ({ visitId, procedureId, scope, mutation, reason }) => {
    const snapshot = {
      templateRequirements: cloneReqs(get().templateRequirements),
      visitOverrides: { ...get().visitOverrides },
      auditLog: [...get().auditLog],
    }

    const currentVisitList = get().getRequirementsForVisit(visitId, procedureId)
    const result = applyMutation(currentVisitList, procedureId, mutation)
    if (result.error) {
      set({ lastError: result.error })
      return { ok: false, error: result.error }
    }

    const audit: SupplyAuditEntry = {
      id: uid('audit'),
      user: DEMO_USER,
      timestamp: new Date().toISOString(),
      action: result.action,
      visitId,
      procedureId,
      itemId: result.itemId,
      oldValue: result.oldValue,
      newValue: result.newValue,
      reason,
      scope,
    }

    // Optimistic update
    set((state) => {
      if (scope === 'visit') {
        return {
          visitOverrides: { ...state.visitOverrides, [visitId]: result.next },
          auditLog: [audit, ...state.auditLog],
          saving: true,
          lastError: null,
        }
      }

      // Template update: replace all reqs for this procedure, keep other templates
      const without = state.templateRequirements.filter((r) => r.procedureTemplateId !== procedureId)
      const updatedTemplate = result.next.map((r) => ({
        ...r,
        procedureTemplateId: procedureId,
      }))

      // Drop visit override for this visit so it tracks the new template
      const { [visitId]: _removed, ...restOverrides } = state.visitOverrides

      return {
        templateRequirements: [...without, ...updatedTemplate],
        visitOverrides: restOverrides,
        auditLog: [audit, ...state.auditLog],
        saving: true,
        lastError: null,
      }
    })

    try {
      await simulatePersist()
      set({ saving: false })
      return { ok: true }
    } catch {
      // Roll back
      set({
        ...snapshot,
        saving: false,
        lastError: 'Could not save supply change. Changes were reverted.',
      })
      return { ok: false, error: 'Could not save supply change. Changes were reverted.' }
    }
  },
}))
