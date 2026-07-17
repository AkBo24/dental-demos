export type InventoryStatus = 'Healthy' | 'Low' | 'Critical' | 'Out of Stock'

export type TransactionType = 'received' | 'used' | 'adjustment' | 'purchase_submitted'

export type PurchaseListStatus = 'draft' | 'submitted'

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type RiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'critical'

export type TimelineEventType =
  | 'today'
  | 'shipment'
  | 'procedure_block'
  | 'inventory_drop'
  | 'shortage'
  | 'recommendation'

export interface Vendor {
  id: string
  name: string
  contactEmail: string
  phone: string
  leadTimeDays: number
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string
  vendorId: string
  currentQuantity: number
  unit: string
  /** Clinical units per stock unit (e.g. 100 pairs per box). Default 1. */
  unitsPerPackage: number
  minimumQuantity: number
  preferredReorderQuantity: number
  storageLocation: string
  lastRestocked: string
  notes: string
  /** Optional ISO date for lot expiry (demo). */
  expirationDate?: string
}

export interface InventoryTransaction {
  id: string
  itemId: string
  type: TransactionType
  quantity: number
  date: string
  note?: string
  reference?: string
}

export interface PurchaseListItem {
  itemId: string
  quantity: number
  unitCost: number
}

export interface PurchaseList {
  id: string
  status: PurchaseListStatus
  items: PurchaseListItem[]
  createdAt: string
  submittedAt?: string
  notes?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  description?: string
}

export interface Provider {
  id: string
  name: string
  role: 'Dentist' | 'Hygienist' | 'Specialist'
  color: string
}

export interface Operatory {
  id: string
  name: string
  roomNumber: number
}

export interface ProcedureTemplate {
  id: string
  name: string
  category: string
  averageDurationMinutes: number
  averageRevenue: number
  estimatedSupplyCost: number
  description: string
}

export interface ProcedureSupplyRequirement {
  id: string
  procedureTemplateId: string
  itemId: string
  quantity: number
  unit: string
  required: boolean
  wastePercent: number
  notes?: string
}

/** Where a supply BOM edit should apply */
export type SupplyChangeScope = 'visit' | 'template'

export type SupplyAvailabilityStatus = 'available' | 'low' | 'out'

export type SupplyAuditAction =
  | 'edit_quantity'
  | 'replace_supply'
  | 'remove_supply'
  | 'add_supply'

export interface SupplyAuditEntry {
  id: string
  user: string
  timestamp: string
  action: SupplyAuditAction
  visitId: string
  procedureId: string
  itemId?: string
  oldValue: string
  newValue: string
  reason?: string
  scope: SupplyChangeScope
}

export interface Appointment {
  id: string
  patientName: string
  providerId: string
  operatoryId: string
  procedureTemplateId: string
  startTime: string // ISO datetime
  durationMinutes: number
  status: AppointmentStatus
  notes?: string
}

export interface ForecastConsumptionLine {
  itemId: string
  itemName: string
  category: string
  unit: string
  currentQuantity: number
  minimumQuantity: number
  projectedConsumption: number
  projectedRemaining: number
  unitsPerPackage: number
  statusAfter: InventoryStatus
  fallsBelowPar: boolean
  projectedStockout: boolean
  expiresBeforeUse: boolean
  expirationDate?: string
  estimatedCost: number
  appointmentIds: string[]
  procedureNames: string[]
}

export interface AppointmentRisk {
  appointmentId: string
  patientName: string
  procedureName: string
  providerId: string
  startTime: string
  riskLevel: RiskLevel
  missingSupplies: Array<{
    itemId: string
    itemName: string
    needed: number
    available: number
    unit: string
  }>
}

export interface ReorderRecommendation {
  id: string
  itemId: string
  itemName: string
  urgency: 'today' | 'this_week' | 'next_week'
  reason: string
  affectedProcedures: string[]
  daysRemaining: number | null
  recommendedQuantity: number
  unit: string
  estimatedCost: number
  vendorId: string
  vendorName: string
}

export interface InventoryRisk {
  score: number
  label: string
  reasons: string[]
  proceduresAtRisk: number
  projectedStockouts: number
  projectedBelowPar: number
}

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  date: string
  title: string
  description: string
  severity?: RiskLevel
  relatedItemIds?: string[]
  relatedAppointmentIds?: string[]
}

export interface WeeklyForecast {
  weekStart: string
  weekEnd: string
  appointmentCount: number
  expectedMaterialCost: number
  consumptions: ForecastConsumptionLine[]
  appointmentRisks: AppointmentRisk[]
  recommendations: ReorderRecommendation[]
  risk: InventoryRisk
  timeline: TimelineEvent[]
  consumptionByCategory: Array<{ category: string; quantity: number; cost: number }>
  mostUsedSupplies: Array<{ itemId: string; itemName: string; quantity: number; unit: string }>
}
