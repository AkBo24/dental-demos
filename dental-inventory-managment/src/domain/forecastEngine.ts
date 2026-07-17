import type {
  Appointment,
  AppointmentRisk,
  ForecastConsumptionLine,
  InventoryItem,
  InventoryRisk,
  InventoryStatus,
  ProcedureSupplyRequirement,
  ProcedureTemplate,
  ReorderRecommendation,
  RiskLevel,
  TimelineEvent,
  Vendor,
  WeeklyForecast,
} from '@/types'
import { addDays, format, parseISO, startOfDay } from 'date-fns'

export interface ForecastInput {
  weekStart: string // YYYY-MM-DD
  appointments: Appointment[]
  templates: ProcedureTemplate[]
  requirements: ProcedureSupplyRequirement[]
  inventory: InventoryItem[]
  vendors: Vendor[]
  unitCosts: Record<string, number>
  /** Optional planned receipts during the week */
  plannedShipments?: Array<{ itemId: string; quantity: number; date: string; label: string }>
  /** Prefer visit-specific BOM when present (visit overrides). */
  getRequirementsForAppointment?: (
    appointment: Appointment,
  ) => ProcedureSupplyRequirement[]
}

function getItemStatusFromQty(qty: number, minimum: number): InventoryStatus {
  if (qty <= 0) return 'Out of Stock'
  if (qty <= Math.ceil(minimum * 0.5)) return 'Critical'
  if (qty <= minimum) return 'Low'
  return 'Healthy'
}

/** Convert clinical BOM quantity into stock/shelf units. */
export function toStockUnits(clinicalQty: number, item: InventoryItem, wastePercent: number): number {
  const withWaste = clinicalQty * (1 + wastePercent / 100)
  const perPkg = item.unitsPerPackage || 1
  return withWaste / perPkg
}

function riskLabel(score: number): string {
  if (score >= 90) return 'Perfect readiness'
  if (score >= 80) return 'Minor shortages'
  if (score >= 60) return 'Procedures affected'
  if (score >= 40) return 'High operational risk'
  return 'Critical shortages'
}

function scoreRisk(params: {
  stockouts: number
  belowPar: number
  proceduresAtRisk: number
  totalAppointments: number
  expires: number
}): InventoryRisk {
  let score = 100
  const reasons: string[] = []

  score -= params.stockouts * 12
  score -= params.belowPar * 3
  score -= params.proceduresAtRisk * 4
  score -= params.expires * 2

  if (params.stockouts > 0) {
    reasons.push(`${params.stockouts} supply item${params.stockouts === 1 ? '' : 's'} projected to run out this week.`)
  }
  if (params.proceduresAtRisk > 0) {
    reasons.push(
      `${params.proceduresAtRisk} of ${params.totalAppointments} appointments have required supplies at risk.`,
    )
  }
  if (params.belowPar > 0) {
    reasons.push(`${params.belowPar} items fall below par after scheduled consumption.`)
  }
  if (params.expires > 0) {
    reasons.push(`${params.expires} items may expire before projected use.`)
  }
  if (reasons.length === 0) {
    reasons.push('On-hand inventory covers next week’s scheduled procedures with healthy buffers.')
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  return {
    score,
    label: riskLabel(score),
    reasons,
    proceduresAtRisk: params.proceduresAtRisk,
    projectedStockouts: params.stockouts,
    projectedBelowPar: params.belowPar,
  }
}

function urgencyFromDays(days: number | null): ReorderRecommendation['urgency'] {
  if (days === null || days <= 1) return 'today'
  if (days <= 5) return 'this_week'
  return 'next_week'
}

/**
 * Pure forecasting engine — no UI or store dependencies.
 * Designed so historical learning, PMS sync, and auto-PO can plug in later.
 */
export function computeWeeklyForecast(input: ForecastInput): WeeklyForecast {
  const weekStart = startOfDay(parseISO(input.weekStart))
  const weekEnd = addDays(weekStart, 6)
  const weekStartStr = format(weekStart, 'yyyy-MM-dd')
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd')

  const templateMap = new Map(input.templates.map((t) => [t.id, t]))
  const itemMap = new Map(input.inventory.map((i) => [i.id, i]))
  const vendorMap = new Map(input.vendors.map((v) => [v.id, v]))
  const reqsByTemplate = new Map<string, ProcedureSupplyRequirement[]>()
  for (const req of input.requirements) {
    const list = reqsByTemplate.get(req.procedureTemplateId) ?? []
    list.push(req)
    reqsByTemplate.set(req.procedureTemplateId, list)
  }

  const weekAppointments = input.appointments.filter((a) => {
    if (a.status === 'cancelled') return false
    const d = parseISO(a.startTime)
    return d >= weekStart && d <= addDays(weekEnd, 1)
  })

  type Acc = {
    stockQty: number
    appointmentIds: Set<string>
    procedureNames: Set<string>
    cost: number
  }

  const consumption = new Map<string, Acc>()

  for (const appt of weekAppointments) {
    const reqs =
      input.getRequirementsForAppointment?.(appt) ??
      reqsByTemplate.get(appt.procedureTemplateId) ??
      []
    const template = templateMap.get(appt.procedureTemplateId)
    for (const req of reqs) {
      const item = itemMap.get(req.itemId)
      if (!item) continue
      const stockQty = toStockUnits(req.quantity, item, req.wastePercent)
      const unitCost = input.unitCosts[item.id] ?? 0
      const prev = consumption.get(item.id) ?? {
        stockQty: 0,
        appointmentIds: new Set<string>(),
        procedureNames: new Set<string>(),
        cost: 0,
      }
      prev.stockQty += stockQty
      prev.appointmentIds.add(appt.id)
      if (template) prev.procedureNames.add(template.name)
      prev.cost += stockQty * unitCost
      consumption.set(item.id, prev)
    }
  }

  // Apply planned shipments chronologically for remaining calc (simple: add before projection)
  const shipmentByItem = new Map<string, number>()
  for (const ship of input.plannedShipments ?? []) {
    if (ship.date >= weekStartStr && ship.date <= weekEndStr) {
      shipmentByItem.set(ship.itemId, (shipmentByItem.get(ship.itemId) ?? 0) + ship.quantity)
    }
  }

  const consumptions: ForecastConsumptionLine[] = []
  for (const [itemId, acc] of consumption.entries()) {
    const item = itemMap.get(itemId)
    if (!item) continue
    const incoming = shipmentByItem.get(itemId) ?? 0
    const available = item.currentQuantity + incoming
    const projectedRemaining = available - acc.stockQty
    const statusAfter = getItemStatusFromQty(projectedRemaining, item.minimumQuantity)
    const expiresBeforeUse = Boolean(
      item.expirationDate &&
        item.expirationDate <= weekEndStr &&
        acc.stockQty > 0,
    )

    consumptions.push({
      itemId,
      itemName: item.name,
      category: item.category,
      unit: item.unit,
      currentQuantity: item.currentQuantity,
      minimumQuantity: item.minimumQuantity,
      projectedConsumption: Math.round(acc.stockQty * 1000) / 1000,
      projectedRemaining: Math.round(projectedRemaining * 1000) / 1000,
      unitsPerPackage: item.unitsPerPackage,
      statusAfter,
      fallsBelowPar: projectedRemaining < item.minimumQuantity,
      projectedStockout: projectedRemaining <= 0,
      expiresBeforeUse,
      expirationDate: item.expirationDate,
      estimatedCost: Math.round(acc.cost * 100) / 100,
      appointmentIds: [...acc.appointmentIds],
      procedureNames: [...acc.procedureNames],
    })
  }

  consumptions.sort((a, b) => a.projectedRemaining - b.projectedRemaining)

  // Appointment-level risk: walk appointments chronologically depleting inventory
  const running = new Map(input.inventory.map((i) => [i.id, i.currentQuantity + (shipmentByItem.get(i.id) ?? 0)]))
  const appointmentRisks: AppointmentRisk[] = []

  const sortedAppts = [...weekAppointments].sort((a, b) => a.startTime.localeCompare(b.startTime))
  for (const appt of sortedAppts) {
    const reqs =
      input.getRequirementsForAppointment?.(appt) ??
      reqsByTemplate.get(appt.procedureTemplateId) ??
      []
    const template = templateMap.get(appt.procedureTemplateId)
    const missing: AppointmentRisk['missingSupplies'] = []

    for (const req of reqs) {
      if (!req.required) continue
      const item = itemMap.get(req.itemId)
      if (!item) continue
      const needed = toStockUnits(req.quantity, item, req.wastePercent)
      const available = running.get(item.id) ?? 0
      if (available < needed) {
        missing.push({
          itemId: item.id,
          itemName: item.name,
          needed: Math.round(needed * 1000) / 1000,
          available: Math.round(available * 1000) / 1000,
          unit: item.unit,
        })
      }
      running.set(item.id, available - needed)
    }

    let riskLevel: RiskLevel = 'none'
    if (missing.length >= 3) riskLevel = 'critical'
    else if (missing.length === 2) riskLevel = 'high'
    else if (missing.length === 1) riskLevel = 'moderate'
    else riskLevel = 'none'

    if (missing.length > 0) {
      appointmentRisks.push({
        appointmentId: appt.id,
        patientName: appt.patientName,
        procedureName: template?.name ?? 'Procedure',
        providerId: appt.providerId,
        startTime: appt.startTime,
        riskLevel,
        missingSupplies: missing,
      })
    }
  }

  // Recommendations
  const recommendations: ReorderRecommendation[] = []
  for (const line of consumptions) {
    if (!line.fallsBelowPar && !line.projectedStockout && !line.expiresBeforeUse) continue
    const item = itemMap.get(line.itemId)!
    const vendor = vendorMap.get(item.vendorId)
    const deficit = Math.max(0, item.minimumQuantity - line.projectedRemaining)
    const recommendedQuantity = Math.max(
      item.preferredReorderQuantity,
      Math.ceil(deficit + line.projectedConsumption),
    )

    let daysRemaining: number | null = null
    if (line.projectedStockout) {
      // Estimate day of stockout from chronological depletion already done — approximate
      daysRemaining = 0
      const daily = line.projectedConsumption / 5
      if (daily > 0 && line.currentQuantity > 0) {
        daysRemaining = Math.max(0, Math.floor(line.currentQuantity / daily))
      }
    } else if (line.fallsBelowPar) {
      daysRemaining = 3
    }

    let reason = `${line.itemName} projected to ${line.projectedStockout ? 'stock out' : 'fall below par'} after this week’s schedule.`
    if (line.expiresBeforeUse) {
      reason = `${line.itemName} expires ${line.expirationDate} before/during scheduled use.`
    }

    recommendations.push({
      id: `rec-${line.itemId}`,
      itemId: line.itemId,
      itemName: line.itemName,
      urgency: urgencyFromDays(daysRemaining),
      reason,
      affectedProcedures: line.procedureNames.slice(0, 6),
      daysRemaining,
      recommendedQuantity,
      unit: line.unit,
      estimatedCost: recommendedQuantity * (input.unitCosts[line.itemId] ?? 0),
      vendorId: item.vendorId,
      vendorName: vendor?.name ?? 'Preferred vendor',
    })
  }

  const urgencyRank = { today: 0, this_week: 1, next_week: 2 }
  recommendations.sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency] || b.estimatedCost - a.estimatedCost)

  const stockouts = consumptions.filter((c) => c.projectedStockout).length
  const belowPar = consumptions.filter((c) => c.fallsBelowPar).length
  const expires = consumptions.filter((c) => c.expiresBeforeUse).length

  const risk = scoreRisk({
    stockouts,
    belowPar,
    proceduresAtRisk: appointmentRisks.length,
    totalAppointments: weekAppointments.length,
    expires,
  })

  // Timeline events
  const timeline: TimelineEvent[] = [
    {
      id: 'tl-today',
      type: 'today',
      date: weekStartStr,
      title: 'Week begins',
      description: `${weekAppointments.length} appointments scheduled · risk score ${risk.score}`,
      severity: risk.score < 60 ? 'high' : risk.score < 80 ? 'moderate' : 'low',
    },
  ]

  for (const ship of input.plannedShipments ?? []) {
    if (ship.date >= weekStartStr && ship.date <= weekEndStr) {
      timeline.push({
        id: `tl-ship-${ship.itemId}-${ship.date}`,
        type: 'shipment',
        date: ship.date,
        title: ship.label,
        description: `Incoming receipt improves on-hand position.`,
        relatedItemIds: [ship.itemId],
      })
    }
  }

  // Group high-volume procedure days
  const byDay = new Map<string, Appointment[]>()
  for (const a of weekAppointments) {
    const d = a.startTime.slice(0, 10)
    const list = byDay.get(d) ?? []
    list.push(a)
    byDay.set(d, list)
  }

  for (const [day, appts] of [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const fillings = appts.filter((a) =>
      ['pt7', 'pt8', 'pt9'].includes(a.procedureTemplateId),
    ).length
    if (fillings >= 3) {
      timeline.push({
        id: `tl-fill-${day}`,
        type: 'procedure_block',
        date: day,
        title: `${fillings} composite fillings`,
        description: 'Elevated restorative supply draw (composite, bond, matrix).',
        relatedAppointmentIds: appts.map((a) => a.id),
      })
    }
    const endo = appts.filter((a) => ['pt14', 'pt15'].includes(a.procedureTemplateId)).length
    if (endo >= 1) {
      timeline.push({
        id: `tl-endo-${day}`,
        type: 'procedure_block',
        date: day,
        title: `${endo} root canal${endo > 1 ? 's' : ''}`,
        description: 'Endodontic kit consumption (files, irrigants, GP).',
        relatedAppointmentIds: appts.map((a) => a.id),
      })
    }
  }

  for (const line of consumptions.filter((c) => c.projectedStockout || c.fallsBelowPar).slice(0, 8)) {
    timeline.push({
      id: `tl-drop-${line.itemId}`,
      type: line.projectedStockout ? 'shortage' : 'inventory_drop',
      date: weekEndStr,
      title: line.projectedStockout
        ? `${line.itemName} projected stockout`
        : `${line.itemName} drops below par`,
      description: `Consume ~${line.projectedConsumption} ${line.unit}; remaining ${line.projectedRemaining} ${line.unit}.`,
      severity: line.projectedStockout ? 'critical' : 'moderate',
      relatedItemIds: [line.itemId],
    })
  }

  for (const rec of recommendations.filter((r) => r.urgency === 'today').slice(0, 5)) {
    timeline.push({
      id: `tl-rec-${rec.itemId}`,
      type: 'recommendation',
      date: weekStartStr,
      title: `Reorder ${rec.itemName}`,
      description: rec.reason,
      severity: 'high',
      relatedItemIds: [rec.itemId],
    })
  }

  timeline.sort((a, b) => a.date.localeCompare(b.date))

  const categoryMap = new Map<string, { quantity: number; cost: number }>()
  for (const line of consumptions) {
    const prev = categoryMap.get(line.category) ?? { quantity: 0, cost: 0 }
    prev.quantity += line.projectedConsumption
    prev.cost += line.estimatedCost
    categoryMap.set(line.category, prev)
  }

  const consumptionByCategory = [...categoryMap.entries()]
    .map(([category, v]) => ({ category, quantity: Math.round(v.quantity * 100) / 100, cost: Math.round(v.cost * 100) / 100 }))
    .sort((a, b) => b.cost - a.cost)

  const mostUsedSupplies = [...consumptions]
    .sort((a, b) => b.projectedConsumption - a.projectedConsumption)
    .slice(0, 10)
    .map((c) => ({
      itemId: c.itemId,
      itemName: c.itemName,
      quantity: c.projectedConsumption,
      unit: c.unit,
    }))

  const expectedMaterialCost = Math.round(
    consumptions.reduce((s, c) => s + c.estimatedCost, 0) * 100,
  ) / 100

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    appointmentCount: weekAppointments.length,
    expectedMaterialCost,
    consumptions,
    appointmentRisks,
    recommendations,
    risk,
    timeline,
    consumptionByCategory,
    mostUsedSupplies,
  }
}

/** Evaluate a single appointment against current inventory (no chronological depletion). */
export function evaluateAppointmentSupplies(params: {
  appointment: Appointment
  template: ProcedureTemplate | undefined
  requirements: ProcedureSupplyRequirement[]
  inventory: InventoryItem[]
  forecastConsumptions?: ForecastConsumptionLine[]
}): {
  lines: Array<{
    req: ProcedureSupplyRequirement
    item: InventoryItem
    stockNeeded: number
    available: number
    weekNeed: number
    ok: boolean
    warn: boolean
  }>
  riskLevel: RiskLevel
} {
  const itemMap = new Map(params.inventory.map((i) => [i.id, i]))
  const weekMap = new Map(params.forecastConsumptions?.map((c) => [c.itemId, c]) ?? [])

  const lines = params.requirements.map((req) => {
    const item = itemMap.get(req.itemId)
    if (!item) {
      return null
    }
    const stockNeeded = toStockUnits(req.quantity, item, req.wastePercent)
    const available = item.currentQuantity
    const weekNeed = weekMap.get(item.id)?.projectedConsumption ?? stockNeeded
    const ok = available >= stockNeeded
    const warn = available < weekNeed || (req.required && available < stockNeeded * 3)
    return { req, item, stockNeeded, available, weekNeed, ok, warn }
  }).filter(Boolean) as Array<{
    req: ProcedureSupplyRequirement
    item: InventoryItem
    stockNeeded: number
    available: number
    weekNeed: number
    ok: boolean
    warn: boolean
  }>

  const missingRequired = lines.filter((l) => l.req.required && !l.ok).length
  let riskLevel: RiskLevel = 'none'
  if (missingRequired >= 3) riskLevel = 'critical'
  else if (missingRequired === 2) riskLevel = 'high'
  else if (missingRequired === 1) riskLevel = 'moderate'
  else if (lines.some((l) => l.warn)) riskLevel = 'low'

  return { lines, riskLevel }
}
