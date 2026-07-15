import type { InventoryTransaction, PurchaseList } from '@/types'

export { vendors, inventoryItems, unitCosts, categories } from './catalog'
export { procedureTemplates, procedureRequirements, getTemplate, getRequirementsForTemplate } from './procedures'
export {
  providers,
  operatories,
  appointments,
  getProvider,
  getOperatory,
} from './schedule'

export const transactions: InventoryTransaction[] = [
  { id: 't1', itemId: 'i13', type: 'received', quantity: 10, date: '2026-07-10', note: 'Weekly PPE restock', reference: 'PO-1082' },
  { id: 't2', itemId: 'i8', type: 'received', quantity: 4, date: '2026-07-08', note: 'VPS heavy body', reference: 'PO-1079' },
  { id: 't3', itemId: 'i6', type: 'received', quantity: 25, date: '2026-07-05', note: 'Bur restock', reference: 'PO-1075' },
  { id: 't4', itemId: 'i14', type: 'received', quantity: 4, date: '2026-07-06', note: '', reference: 'PO-1078' },
  { id: 't5', itemId: 'i3', type: 'received', quantity: 6, date: '2026-07-01', note: 'Etchant refill', reference: 'PO-1070' },
  { id: 't6', itemId: 'i1', type: 'used', quantity: 1, date: '2026-07-11', note: 'Hygiene + restorative day' },
  { id: 't7', itemId: 'i4', type: 'used', quantity: 1, date: '2026-07-11', note: 'Morning hygiene block' },
  { id: 't8', itemId: 'i5', type: 'used', quantity: 12, date: '2026-07-09', note: 'Restorative schedule' },
  { id: 't9', itemId: 'i2', type: 'used', quantity: 1, date: '2026-07-10', note: 'Anterior composites' },
  { id: 't10', itemId: 'i7', type: 'used', quantity: 1, date: '2026-07-12', note: 'All operatories' },
  { id: 't11', itemId: 'i10', type: 'used', quantity: 1, date: '2026-07-08', note: 'Bonding cases' },
  { id: 't12', itemId: 'i15', type: 'used', quantity: 1, date: '2026-07-07', note: 'Temp crown' },
  { id: 't13', itemId: 'i1', type: 'received', quantity: 12, date: '2026-06-28', note: 'Gloves restock', reference: 'PO-1055' },
  { id: 't14', itemId: 'i9', type: 'used', quantity: 1, date: '2026-07-11', note: 'Class II restorations' },
  { id: 't15', itemId: 'i11', type: 'used', quantity: 6, date: '2026-07-12', note: 'Hygiene day' },
  { id: 't16', itemId: 'i5', type: 'purchase_submitted', quantity: 100, date: '2026-07-01', note: 'Prior order', reference: 'PO-1068' },
  { id: 't17', itemId: 'i12', type: 'used', quantity: 15, date: '2026-07-12', note: 'Daily sterilization cycles' },
  { id: 't18', itemId: 'i2', type: 'received', quantity: 6, date: '2026-06-15', note: 'Composite A2', reference: 'PO-1040' },
]

export const initialPurchaseList: PurchaseList = {
  id: 'pl-draft',
  status: 'draft',
  createdAt: '2026-07-13T08:00:00.000Z',
  items: [
    { itemId: 'i5', quantity: 200, unitCost: 1.85 },
    { itemId: 'i1', quantity: 24, unitCost: 12.5 },
  ],
  notes: 'Priority: anesthetic cartridges for Wednesday schedule.',
}

/** Demo planned receipts used by forecast timeline */
export const plannedShipments = [
  {
    itemId: 'i5',
    quantity: 100,
    date: '2026-07-15',
    label: 'Lidocaine shipment arrives',
  },
  {
    itemId: 'i2',
    quantity: 12,
    date: '2026-07-16',
    label: 'Composite resin restock arrives',
  },
  {
    itemId: 'i1',
    quantity: 24,
    date: '2026-07-21',
    label: 'Gloves order arrives',
  },
]
