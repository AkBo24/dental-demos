import type { InventoryItem, Vendor } from '@/types'

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Henry Schein Dental',
    contactEmail: 'orders@henryschein.com',
    phone: '(800) 372-4346',
    leadTimeDays: 2,
  },
  {
    id: 'v2',
    name: 'Patterson Dental',
    contactEmail: 'support@pattersondental.com',
    phone: '(800) 328-5536',
    leadTimeDays: 3,
  },
  {
    id: 'v3',
    name: 'Benco Dental',
    contactEmail: 'orders@benco.com',
    phone: '(800) 462-3626',
    leadTimeDays: 2,
  },
  {
    id: 'v4',
    name: 'Darby Dental Supply',
    contactEmail: 'cs@darby.com',
    phone: '(800) 645-2310',
    leadTimeDays: 4,
  },
]

type CatalogSeed = {
  id: string
  name: string
  category: string
  sku: string
  vendorId: string
  currentQuantity: number
  unit: string
  unitsPerPackage: number
  minimumQuantity: number
  preferredReorderQuantity: number
  storageLocation: string
  lastRestocked: string
  notes?: string
  expirationDate?: string
  unitCost: number
}

/** Core clinical supplies referenced by procedure BOMs — stable IDs. */
const coreCatalog: CatalogSeed[] = [
  { id: 'i1', name: 'Nitrile Gloves (Medium)', category: 'PPE', sku: 'PPE-NGL-M-100', vendorId: 'v1', currentQuantity: 8, unit: 'boxes', unitsPerPackage: 100, minimumQuantity: 12, preferredReorderQuantity: 24, storageLocation: 'Sterilization Closet A', lastRestocked: '2026-06-28', notes: '100 pairs/box', unitCost: 12.5 },
  { id: 'i2', name: 'Composite Resin (A2)', category: 'Restorative', sku: 'RES-COMP-A2', vendorId: 'v2', currentQuantity: 6, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 10, preferredReorderQuantity: 12, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-06-15', notes: 'Refrigerate', expirationDate: '2026-09-01', unitCost: 28 },
  { id: 'i3', name: 'Phosphoric Acid Etchant 37%', category: 'Restorative', sku: 'RES-ETCH-37', vendorId: 'v2', currentQuantity: 14, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 6, preferredReorderQuantity: 10, storageLocation: 'Central Supply Shelf B', lastRestocked: '2026-07-01', unitCost: 9.75 },
  { id: 'i4', name: 'Cotton Rolls', category: 'Disposables', sku: 'DIS-COT-500', vendorId: 'v4', currentQuantity: 6, unit: 'bags', unitsPerPackage: 500, minimumQuantity: 5, preferredReorderQuantity: 10, storageLocation: 'Central Supply Shelf A', lastRestocked: '2026-06-10', unitCost: 6.4 },
  { id: 'i5', name: 'Lidocaine 2% with Epinephrine', category: 'Anesthetics', sku: 'ANE-LIDO-2EP', vendorId: 'v1', currentQuantity: 80, unit: 'cartridges', unitsPerPackage: 1, minimumQuantity: 100, preferredReorderQuantity: 200, storageLocation: 'Locked Med Cabinet', lastRestocked: '2026-07-01', notes: 'Keep locked', unitCost: 1.85 },
  { id: 'i6', name: 'High-Speed Diamond Bur #557', category: 'Instruments', sku: 'INS-BUR-557', vendorId: 'v3', currentQuantity: 40, unit: 'pieces', unitsPerPackage: 1, minimumQuantity: 20, preferredReorderQuantity: 50, storageLocation: 'Operatory Bur Block Drawer', lastRestocked: '2026-07-05', unitCost: 3.2 },
  { id: 'i7', name: 'Saliva Ejector Tips', category: 'Disposables', sku: 'DIS-SEJ-100', vendorId: 'v4', currentQuantity: 10, unit: 'bags', unitsPerPackage: 100, minimumQuantity: 8, preferredReorderQuantity: 16, storageLocation: 'Central Supply Shelf A', lastRestocked: '2026-06-20', unitCost: 8.9 },
  { id: 'i8', name: 'Vinyl Polysiloxane Impression Material', category: 'Impression', sku: 'IMP-VPS-HEAVY', vendorId: 'v2', currentQuantity: 12, unit: 'cartridges', unitsPerPackage: 1, minimumQuantity: 6, preferredReorderQuantity: 12, storageLocation: 'Operatory 1 Side Cart', lastRestocked: '2026-07-08', unitCost: 42 },
  { id: 'i9', name: 'Matrix Bands (Universal)', category: 'Restorative', sku: 'RES-MXB-UNI', vendorId: 'v3', currentQuantity: 5, unit: 'packs', unitsPerPackage: 50, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Operatory 3 Drawer 2', lastRestocked: '2026-06-18', unitCost: 14.5 },
  { id: 'i10', name: 'Bonding Agent (5th Gen)', category: 'Restorative', sku: 'RES-BOND-5G', vendorId: 'v2', currentQuantity: 4, unit: 'bottles', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Central Supply Shelf B', lastRestocked: '2026-06-05', expirationDate: '2026-08-15', unitCost: 56 },
  { id: 'i11', name: 'Prophy Paste (Mint)', category: 'Hygiene', sku: 'HYG-PRO-MNT', vendorId: 'v1', currentQuantity: 120, unit: 'cups', unitsPerPackage: 1, minimumQuantity: 40, preferredReorderQuantity: 100, storageLocation: 'Hygiene Closet', lastRestocked: '2026-07-02', unitCost: 0.85 },
  { id: 'i12', name: 'Autoclave Indicator Strips', category: 'Sterilization', sku: 'STE-IND-250', vendorId: 'v3', currentQuantity: 180, unit: 'strips', unitsPerPackage: 1, minimumQuantity: 100, preferredReorderQuantity: 250, storageLocation: 'Sterilization Room', lastRestocked: '2026-06-25', unitCost: 0.12 },
  { id: 'i13', name: 'Face Masks (Level 3)', category: 'PPE', sku: 'PPE-MSK-L3', vendorId: 'v1', currentQuantity: 18, unit: 'boxes', unitsPerPackage: 50, minimumQuantity: 10, preferredReorderQuantity: 20, storageLocation: 'Sterilization Closet A', lastRestocked: '2026-07-10', unitCost: 11 },
  { id: 'i14', name: 'Articulating Paper', category: 'Disposables', sku: 'DIS-ART-BKRD', vendorId: 'v4', currentQuantity: 12, unit: 'books', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Central Supply Shelf C', lastRestocked: '2026-07-06', unitCost: 7.25 },
  { id: 'i15', name: 'Temporary Crown Material', category: 'Restorative', sku: 'RES-TEMP-CRN', vendorId: 'v2', currentQuantity: 3, unit: 'cartridges', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-07-08', unitCost: 38.5 },
  // Additional core BOM supplies
  { id: 'i16', name: 'Disposable Needles 27G Long', category: 'Anesthetics', sku: 'ANE-NDL-27L', vendorId: 'v1', currentQuantity: 200, unit: 'needles', unitsPerPackage: 1, minimumQuantity: 100, preferredReorderQuantity: 200, storageLocation: 'Locked Med Cabinet', lastRestocked: '2026-07-03', unitCost: 0.35 },
  { id: 'i17', name: 'Microbrushes', category: 'Disposables', sku: 'DIS-MBR-100', vendorId: 'v4', currentQuantity: 8, unit: 'packs', unitsPerPackage: 100, minimumQuantity: 4, preferredReorderQuantity: 10, storageLocation: 'Central Supply Shelf C', lastRestocked: '2026-06-22', unitCost: 9.5 },
  { id: 'i18', name: 'Wooden Wedges', category: 'Restorative', sku: 'RES-WDG-100', vendorId: 'v3', currentQuantity: 6, unit: 'packs', unitsPerPackage: 100, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Operatory 3 Drawer 2', lastRestocked: '2026-06-30', unitCost: 8.2 },
  { id: 'i19', name: 'Disposable Barriers (Chair)', category: 'PPE', sku: 'PPE-BAR-250', vendorId: 'v1', currentQuantity: 9, unit: 'boxes', unitsPerPackage: 250, minimumQuantity: 6, preferredReorderQuantity: 12, storageLocation: 'Sterilization Closet B', lastRestocked: '2026-07-04', unitCost: 18 },
  { id: 'i20', name: 'HVE Tips', category: 'Disposables', sku: 'DIS-HVE-100', vendorId: 'v4', currentQuantity: 7, unit: 'bags', unitsPerPackage: 100, minimumQuantity: 6, preferredReorderQuantity: 12, storageLocation: 'Central Supply Shelf A', lastRestocked: '2026-06-28', unitCost: 11.5 },
  { id: 'i21', name: 'Patient Bibs', category: 'Disposables', sku: 'DIS-BIB-500', vendorId: 'v4', currentQuantity: 5, unit: 'packs', unitsPerPackage: 500, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Central Supply Shelf A', lastRestocked: '2026-07-01', unitCost: 14 },
  { id: 'i22', name: 'Barrier Film Rolls', category: 'PPE', sku: 'PPE-FIL-1200', vendorId: 'v1', currentQuantity: 6, unit: 'rolls', unitsPerPackage: 1200, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Sterilization Closet B', lastRestocked: '2026-06-18', unitCost: 22 },
  { id: 'i23', name: 'Prophy Angles', category: 'Hygiene', sku: 'HYG-ANG-100', vendorId: 'v1', currentQuantity: 90, unit: 'pieces', unitsPerPackage: 1, minimumQuantity: 50, preferredReorderQuantity: 100, storageLocation: 'Hygiene Closet', lastRestocked: '2026-07-02', unitCost: 0.45 },
  { id: 'i24', name: 'Fluoride Varnish', category: 'Hygiene', sku: 'HYG-FLV-50', vendorId: 'v2', currentQuantity: 60, unit: 'units', unitsPerPackage: 1, minimumQuantity: 30, preferredReorderQuantity: 50, storageLocation: 'Hygiene Closet', lastRestocked: '2026-06-25', unitCost: 1.9 },
  { id: 'i25', name: 'Rubber Dam Sheets', category: 'Endodontics', sku: 'END-RDS-36', vendorId: 'v3', currentQuantity: 40, unit: 'sheets', unitsPerPackage: 1, minimumQuantity: 20, preferredReorderQuantity: 36, storageLocation: 'Endo Cart', lastRestocked: '2026-07-05', unitCost: 1.1 },
  { id: 'i26', name: 'Rubber Dam Clamps Assortment', category: 'Endodontics', sku: 'END-RDC-SET', vendorId: 'v3', currentQuantity: 8, unit: 'sets', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 4, storageLocation: 'Endo Cart', lastRestocked: '2026-05-20', unitCost: 48 },
  { id: 'i27', name: 'Endodontic Files (K-File Assortment)', category: 'Endodontics', sku: 'END-FIL-ASS', vendorId: 'v2', currentQuantity: 25, unit: 'packs', unitsPerPackage: 1, minimumQuantity: 15, preferredReorderQuantity: 30, storageLocation: 'Endo Cart', lastRestocked: '2026-06-12', unitCost: 18 },
  { id: 'i28', name: 'Irrigation Syringes', category: 'Endodontics', sku: 'END-IRR-50', vendorId: 'v4', currentQuantity: 70, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 40, preferredReorderQuantity: 50, storageLocation: 'Endo Cart', lastRestocked: '2026-07-01', unitCost: 0.55 },
  { id: 'i29', name: 'Sodium Hypochlorite 3%', category: 'Endodontics', sku: 'END-NAOCL-3', vendorId: 'v2', currentQuantity: 8, unit: 'bottles', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Endo Cart', lastRestocked: '2026-06-08', unitCost: 12 },
  { id: 'i30', name: 'Paper Points Assortment', category: 'Endodontics', sku: 'END-PP-ASS', vendorId: 'v2', currentQuantity: 18, unit: 'packs', unitsPerPackage: 1, minimumQuantity: 10, preferredReorderQuantity: 20, storageLocation: 'Endo Cart', lastRestocked: '2026-06-15', unitCost: 9.5 },
  { id: 'i31', name: 'Gutta Percha Points', category: 'Endodontics', sku: 'END-GP-ASS', vendorId: 'v2', currentQuantity: 16, unit: 'packs', unitsPerPackage: 1, minimumQuantity: 10, preferredReorderQuantity: 20, storageLocation: 'Endo Cart', lastRestocked: '2026-06-15', unitCost: 14 },
  { id: 'i32', name: 'Endodontic Sealer', category: 'Endodontics', sku: 'END-SEAL-1', vendorId: 'v2', currentQuantity: 5, unit: 'tubes', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Endo Cart', lastRestocked: '2026-05-28', expirationDate: '2026-10-01', unitCost: 32 },
  { id: 'i33', name: 'Temporary Filling Material (Cavit)', category: 'Restorative', sku: 'RES-CAV-1', vendorId: 'v3', currentQuantity: 7, unit: 'jars', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Central Supply Shelf B', lastRestocked: '2026-06-20', unitCost: 16 },
  { id: 'i34', name: 'Alginate Impression Powder', category: 'Impression', sku: 'IMP-ALG-1LB', vendorId: 'v4', currentQuantity: 10, unit: 'cans', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Lab Bench', lastRestocked: '2026-07-02', unitCost: 19 },
  { id: 'i35', name: 'Impression Trays (Disposable)', category: 'Impression', sku: 'IMP-TRY-50', vendorId: 'v4', currentQuantity: 45, unit: 'trays', unitsPerPackage: 1, minimumQuantity: 30, preferredReorderQuantity: 50, storageLocation: 'Lab Bench', lastRestocked: '2026-07-06', unitCost: 1.25 },
  { id: 'i36', name: 'Retraction Cord', category: 'Restorative', sku: 'RES-RTC-1', vendorId: 'v2', currentQuantity: 8, unit: 'bottles', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 6, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-06-14', unitCost: 24 },
  { id: 'i37', name: 'Temporary Cement', category: 'Restorative', sku: 'RES-TCEM-1', vendorId: 'v2', currentQuantity: 6, unit: 'tubes', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-06-22', unitCost: 21 },
  { id: 'i38', name: 'Permanent Resin Cement', category: 'Restorative', sku: 'RES-RCEM-1', vendorId: 'v2', currentQuantity: 5, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-07-01', unitCost: 68 },
  { id: 'i39', name: 'Surgical Sutures 4-0', category: 'Surgery', sku: 'SUR-SUT-40', vendorId: 'v1', currentQuantity: 30, unit: 'packs', unitsPerPackage: 1, minimumQuantity: 15, preferredReorderQuantity: 30, storageLocation: 'Surgical Closet', lastRestocked: '2026-06-28', unitCost: 4.5 },
  { id: 'i40', name: 'Gauze Sponges 2x2', category: 'Surgery', sku: 'SUR-GAZ-200', vendorId: 'v4', currentQuantity: 12, unit: 'packs', unitsPerPackage: 200, minimumQuantity: 6, preferredReorderQuantity: 12, storageLocation: 'Surgical Closet', lastRestocked: '2026-07-03', unitCost: 7.8 },
  { id: 'i41', name: 'Hemostatic Agent', category: 'Surgery', sku: 'SUR-HEM-1', vendorId: 'v1', currentQuantity: 8, unit: 'bottles', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 6, storageLocation: 'Surgical Closet', lastRestocked: '2026-06-10', unitCost: 28 },
  { id: 'i42', name: 'Surgical Aspirator Tips', category: 'Surgery', sku: 'SUR-ASP-50', vendorId: 'v3', currentQuantity: 55, unit: 'tips', unitsPerPackage: 1, minimumQuantity: 30, preferredReorderQuantity: 50, storageLocation: 'Surgical Closet', lastRestocked: '2026-07-05', unitCost: 0.9 },
  { id: 'i43', name: 'Implant Healing Abutment Kit', category: 'Implant', sku: 'IMP-HAB-1', vendorId: 'v2', currentQuantity: 6, unit: 'kits', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Implant Cabinet', lastRestocked: '2026-05-15', unitCost: 85 },
  { id: 'i44', name: 'Bone Graft Material (0.5cc)', category: 'Implant', sku: 'IMP-BGR-05', vendorId: 'v2', currentQuantity: 8, unit: 'vials', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Implant Cabinet', lastRestocked: '2026-06-01', expirationDate: '2027-01-01', unitCost: 120 },
  { id: 'i45', name: 'Membrane (Resorbable)', category: 'Implant', sku: 'IMP-MEM-1', vendorId: 'v2', currentQuantity: 5, unit: 'pieces', unitsPerPackage: 1, minimumQuantity: 3, preferredReorderQuantity: 6, storageLocation: 'Implant Cabinet', lastRestocked: '2026-06-01', unitCost: 95 },
  { id: 'i46', name: 'Whitening Gel Syringes', category: 'Cosmetic', sku: 'COS-WHT-4', vendorId: 'v3', currentQuantity: 20, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 10, preferredReorderQuantity: 20, storageLocation: 'Cosmetic Closet', lastRestocked: '2026-07-07', unitCost: 8 },
  { id: 'i47', name: 'Night Guard Material Sheets', category: 'Lab', sku: 'LAB-NG-10', vendorId: 'v3', currentQuantity: 14, unit: 'sheets', unitsPerPackage: 1, minimumQuantity: 8, preferredReorderQuantity: 15, storageLocation: 'Lab Bench', lastRestocked: '2026-06-20', unitCost: 6.5 },
  { id: 'i48', name: 'Shade Guide Tabs (Disposable)', category: 'Cosmetic', sku: 'COS-SHD-20', vendorId: 'v4', currentQuantity: 25, unit: 'tabs', unitsPerPackage: 1, minimumQuantity: 10, preferredReorderQuantity: 20, storageLocation: 'Cosmetic Closet', lastRestocked: '2026-07-09', unitCost: 1.2 },
  { id: 'i49', name: 'Composite Resin (A1)', category: 'Restorative', sku: 'RES-COMP-A1', vendorId: 'v2', currentQuantity: 5, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 6, preferredReorderQuantity: 12, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-06-15', expirationDate: '2026-07-20', unitCost: 28 },
  { id: 'i50', name: 'Composite Resin (B1)', category: 'Restorative', sku: 'RES-COMP-B1', vendorId: 'v2', currentQuantity: 4, unit: 'syringes', unitsPerPackage: 1, minimumQuantity: 4, preferredReorderQuantity: 8, storageLocation: 'Operatory 2 Cabinet', lastRestocked: '2026-06-15', unitCost: 28 },
]

const locations = [
  'Central Supply Shelf A',
  'Central Supply Shelf B',
  'Central Supply Shelf C',
  'Sterilization Closet A',
  'Sterilization Closet B',
  'Hygiene Closet',
  'Operatory 1 Side Cart',
  'Operatory 2 Cabinet',
  'Operatory 3 Drawer 2',
  'Surgical Closet',
  'Endo Cart',
  'Implant Cabinet',
  'Lab Bench',
  'Locked Med Cabinet',
]

const extraProducts: Array<{ name: string; category: string; unit: string; unitsPerPackage: number; baseQty: number; min: number; reorder: number; cost: number }> = [
  { name: 'Nitrile Gloves (Small)', category: 'PPE', unit: 'boxes', unitsPerPackage: 100, baseQty: 10, min: 8, reorder: 16, cost: 12.5 },
  { name: 'Nitrile Gloves (Large)', category: 'PPE', unit: 'boxes', unitsPerPackage: 100, baseQty: 9, min: 8, reorder: 16, cost: 12.5 },
  { name: 'Nitrile Gloves (XL)', category: 'PPE', unit: 'boxes', unitsPerPackage: 100, baseQty: 4, min: 4, reorder: 8, cost: 12.5 },
  { name: 'Face Shields', category: 'PPE', unit: 'pieces', unitsPerPackage: 1, baseQty: 40, min: 20, reorder: 40, cost: 2.5 },
  { name: 'Isolation Gowns', category: 'PPE', unit: 'packs', unitsPerPackage: 10, baseQty: 12, min: 6, reorder: 12, cost: 28 },
  { name: 'Bouffant Caps', category: 'PPE', unit: 'boxes', unitsPerPackage: 100, baseQty: 5, min: 3, reorder: 6, cost: 9 },
  { name: 'Shoe Covers', category: 'PPE', unit: 'boxes', unitsPerPackage: 100, baseQty: 4, min: 3, reorder: 6, cost: 11 },
  { name: 'Surface Disinfectant Wipes', category: 'Sterilization', unit: 'canisters', unitsPerPackage: 1, baseQty: 14, min: 8, reorder: 12, cost: 15 },
  { name: 'Instrument Cassette Wrap', category: 'Sterilization', unit: 'rolls', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 8, cost: 32 },
  { name: 'Sterilization Pouches (Small)', category: 'Sterilization', unit: 'boxes', unitsPerPackage: 200, baseQty: 6, min: 4, reorder: 8, cost: 24 },
  { name: 'Sterilization Pouches (Large)', category: 'Sterilization', unit: 'boxes', unitsPerPackage: 200, baseQty: 5, min: 4, reorder: 8, cost: 28 },
  { name: 'Ultrasonic Cleaner Solution', category: 'Sterilization', unit: 'gallons', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 4, cost: 35 },
  { name: 'Hand Soap Refills', category: 'Sterilization', unit: 'cartridges', unitsPerPackage: 1, baseQty: 10, min: 4, reorder: 8, cost: 14 },
  { name: 'Alcohol Prep Pads', category: 'Disposables', unit: 'boxes', unitsPerPackage: 200, baseQty: 8, min: 4, reorder: 8, cost: 6 },
  { name: 'Cotton Pellets', category: 'Disposables', unit: 'bags', unitsPerPackage: 1000, baseQty: 5, min: 3, reorder: 6, cost: 5.5 },
  { name: 'Dry Angles', category: 'Disposables', unit: 'boxes', unitsPerPackage: 200, baseQty: 7, min: 4, reorder: 8, cost: 18 },
  { name: 'Air/Water Syringe Tips', category: 'Disposables', unit: 'bags', unitsPerPackage: 250, baseQty: 9, min: 5, reorder: 10, cost: 16 },
  { name: 'Mixing Pads', category: 'Disposables', unit: 'pads', unitsPerPackage: 1, baseQty: 20, min: 10, reorder: 20, cost: 3.5 },
  { name: 'Applicator Brushes', category: 'Disposables', unit: 'packs', unitsPerPackage: 100, baseQty: 6, min: 3, reorder: 6, cost: 8 },
  { name: 'Plastic Cups (3oz)', category: 'Disposables', unit: 'sleeves', unitsPerPackage: 100, baseQty: 15, min: 8, reorder: 16, cost: 4 },
  { name: 'Topical Anesthetic Gel', category: 'Anesthetics', unit: 'jars', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 6, cost: 18 },
  { name: 'Articaine 4% with Epinephrine', category: 'Anesthetics', unit: 'cartridges', unitsPerPackage: 1, baseQty: 120, min: 80, reorder: 150, cost: 2.1 },
  { name: 'Mepivacaine 3% Plain', category: 'Anesthetics', unit: 'cartridges', unitsPerPackage: 1, baseQty: 60, min: 40, reorder: 80, cost: 1.9 },
  { name: 'Needles 30G Short', category: 'Anesthetics', unit: 'needles', unitsPerPackage: 1, baseQty: 250, min: 100, reorder: 200, cost: 0.32 },
  { name: 'Aspirating Syringes', category: 'Anesthetics', unit: 'pieces', unitsPerPackage: 1, baseQty: 12, min: 6, reorder: 6, cost: 22 },
  { name: 'Composite Resin (A3)', category: 'Restorative', unit: 'syringes', unitsPerPackage: 1, baseQty: 5, min: 4, reorder: 8, cost: 28 },
  { name: 'Composite Resin (A3.5)', category: 'Restorative', unit: 'syringes', unitsPerPackage: 1, baseQty: 4, min: 3, reorder: 6, cost: 28 },
  { name: 'Flowable Composite', category: 'Restorative', unit: 'syringes', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 8, cost: 32 },
  { name: 'Glass Ionomer Cement', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 5, min: 3, reorder: 5, cost: 45 },
  { name: 'Calcium Hydroxide Liner', category: 'Restorative', unit: 'syringes', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 6, cost: 19 },
  { name: 'Finishing Discs Assortment', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 7, min: 3, reorder: 6, cost: 38 },
  { name: 'Polishing Paste', category: 'Restorative', unit: 'jars', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 6, cost: 22 },
  { name: 'Sectional Matrix Rings', category: 'Restorative', unit: 'sets', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 4, cost: 95 },
  { name: 'Sectional Matrix Bands', category: 'Restorative', unit: 'packs', unitsPerPackage: 50, baseQty: 5, min: 3, reorder: 6, cost: 28 },
  { name: 'Core Build-Up Material', category: 'Restorative', unit: 'syringes', unitsPerPackage: 1, baseQty: 5, min: 3, reorder: 6, cost: 52 },
  { name: 'Post Kit Fiber', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 110 },
  { name: 'Carbide Bur #330', category: 'Instruments', unit: 'pieces', unitsPerPackage: 1, baseQty: 35, min: 15, reorder: 40, cost: 2.8 },
  { name: 'Carbide Bur #245', category: 'Instruments', unit: 'pieces', unitsPerPackage: 1, baseQty: 30, min: 15, reorder: 40, cost: 2.8 },
  { name: 'Diamond Bur Fine Football', category: 'Instruments', unit: 'pieces', unitsPerPackage: 1, baseQty: 28, min: 12, reorder: 30, cost: 4.1 },
  { name: 'Diamond Bur Chamfer', category: 'Instruments', unit: 'pieces', unitsPerPackage: 1, baseQty: 22, min: 12, reorder: 30, cost: 4.5 },
  { name: 'Slow-Speed Latch Burs', category: 'Instruments', unit: 'packs', unitsPerPackage: 10, baseQty: 8, min: 4, reorder: 8, cost: 18 },
  { name: 'Scaler Tips (Ultrasonic)', category: 'Hygiene', unit: 'pieces', unitsPerPackage: 1, baseQty: 10, min: 4, reorder: 6, cost: 65 },
  { name: 'Disposable Prophy Cups', category: 'Hygiene', unit: 'bags', unitsPerPackage: 144, baseQty: 6, min: 3, reorder: 6, cost: 22 },
  { name: 'Floss (Chairside)', category: 'Hygiene', unit: 'boxes', unitsPerPackage: 1, baseQty: 20, min: 10, reorder: 20, cost: 4 },
  { name: 'Patient Toothbrushes', category: 'Hygiene', unit: 'boxes', unitsPerPackage: 72, baseQty: 8, min: 4, reorder: 8, cost: 35 },
  { name: 'Patient Toothpaste Samples', category: 'Hygiene', unit: 'boxes', unitsPerPackage: 100, baseQty: 6, min: 3, reorder: 6, cost: 28 },
  { name: 'Sealant Material', category: 'Hygiene', unit: 'syringes', unitsPerPackage: 1, baseQty: 12, min: 6, reorder: 12, cost: 24 },
  { name: 'Disclosing Solution', category: 'Hygiene', unit: 'bottles', unitsPerPackage: 1, baseQty: 5, min: 2, reorder: 4, cost: 16 },
  { name: 'Light Body VPS', category: 'Impression', unit: 'cartridges', unitsPerPackage: 1, baseQty: 10, min: 5, reorder: 10, cost: 42 },
  { name: 'Bite Registration Material', category: 'Impression', unit: 'cartridges', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 8, cost: 36 },
  { name: 'Impression Adhesive', category: 'Impression', unit: 'bottles', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 6, cost: 18 },
  { name: 'Stone (Die Stone)', category: 'Lab', unit: 'bags', unitsPerPackage: 1, baseQty: 8, min: 3, reorder: 6, cost: 28 },
  { name: 'Model Trimmer Discs', category: 'Lab', unit: 'pieces', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 4, cost: 22 },
  { name: 'Wax Bites', category: 'Lab', unit: 'boxes', unitsPerPackage: 50, baseQty: 5, min: 3, reorder: 6, cost: 14 },
  { name: 'Lab Burs', category: 'Lab', unit: 'packs', unitsPerPackage: 12, baseQty: 4, min: 2, reorder: 4, cost: 26 },
  { name: 'Extraction Forceps Tip Covers', category: 'Surgery', unit: 'packs', unitsPerPackage: 20, baseQty: 5, min: 2, reorder: 4, cost: 12 },
  { name: 'Surgical Blades #15', category: 'Surgery', unit: 'boxes', unitsPerPackage: 100, baseQty: 3, min: 2, reorder: 4, cost: 35 },
  { name: 'Elevator Tip Protectors', category: 'Surgery', unit: 'packs', unitsPerPackage: 25, baseQty: 4, min: 2, reorder: 4, cost: 15 },
  { name: 'Ice Packs (Patient)', category: 'Surgery', unit: 'packs', unitsPerPackage: 20, baseQty: 6, min: 3, reorder: 6, cost: 18 },
  { name: 'Gauze 4x4', category: 'Surgery', unit: 'packs', unitsPerPackage: 200, baseQty: 8, min: 4, reorder: 8, cost: 9 },
  { name: 'Chlorhexidine Rinse', category: 'Surgery', unit: 'bottles', unitsPerPackage: 1, baseQty: 15, min: 8, reorder: 12, cost: 6.5 },
  { name: 'EDTA Irrigation', category: 'Endodontics', unit: 'bottles', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 6, cost: 22 },
  { name: 'RC Prep', category: 'Endodontics', unit: 'syringes', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 8, cost: 28 },
  { name: 'Absorbent Points Extra', category: 'Endodontics', unit: 'packs', unitsPerPackage: 1, baseQty: 12, min: 6, reorder: 12, cost: 8 },
  { name: 'Gates Glidden Drills', category: 'Endodontics', unit: 'packs', unitsPerPackage: 6, baseQty: 5, min: 2, reorder: 4, cost: 32 },
  { name: 'Rotary NiTi File Pack', category: 'Endodontics', unit: 'packs', unitsPerPackage: 1, baseQty: 10, min: 6, reorder: 12, cost: 48 },
  { name: 'Implant Motor Sleeves', category: 'Implant', unit: 'packs', unitsPerPackage: 20, baseQty: 4, min: 2, reorder: 4, cost: 40 },
  { name: 'Implant Drill Kit Disposable', category: 'Implant', unit: 'kits', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 4, cost: 180 },
  { name: 'Cover Screws Assortment', category: 'Implant', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 95 },
  { name: 'Transfer Coping Kit', category: 'Implant', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 120 },
  { name: 'Veneer Try-In Paste', category: 'Cosmetic', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 85 },
  { name: 'Veneer Cement', category: 'Cosmetic', unit: 'syringes', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 4, cost: 72 },
  { name: 'Opalescence Go Trays', category: 'Cosmetic', unit: 'kits', unitsPerPackage: 1, baseQty: 10, min: 5, reorder: 10, cost: 28 },
  { name: 'Gingival Barrier', category: 'Cosmetic', unit: 'syringes', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 8, cost: 24 },
  { name: 'X-Ray Sensor Sleeves', category: 'Imaging', unit: 'boxes', unitsPerPackage: 500, baseQty: 6, min: 3, reorder: 6, cost: 42 },
  { name: 'Bitewing Tabs', category: 'Imaging', unit: 'boxes', unitsPerPackage: 300, baseQty: 5, min: 3, reorder: 6, cost: 18 },
  { name: 'PSP Barrier Envelopes', category: 'Imaging', unit: 'boxes', unitsPerPackage: 300, baseQty: 4, min: 2, reorder: 4, cost: 55 },
  { name: 'Lead Apron Covers', category: 'Imaging', unit: 'packs', unitsPerPackage: 50, baseQty: 3, min: 2, reorder: 4, cost: 25 },
  { name: 'Exam Gloves Powder-Free Alt', category: 'PPE', unit: 'boxes', unitsPerPackage: 100, baseQty: 6, min: 4, reorder: 8, cost: 11 },
  { name: 'Safety Glasses (Patient)', category: 'PPE', unit: 'pieces', unitsPerPackage: 1, baseQty: 30, min: 15, reorder: 20, cost: 3 },
  { name: 'Headrest Covers', category: 'PPE', unit: 'boxes', unitsPerPackage: 250, baseQty: 5, min: 3, reorder: 6, cost: 20 },
  { name: 'Light Handle Barriers', category: 'PPE', unit: 'boxes', unitsPerPackage: 500, baseQty: 4, min: 3, reorder: 6, cost: 16 },
  { name: 'Tray Covers', category: 'PPE', unit: 'boxes', unitsPerPackage: 500, baseQty: 5, min: 3, reorder: 6, cost: 19 },
  { name: 'Composite Instrument Tips', category: 'Instruments', unit: 'packs', unitsPerPackage: 5, baseQty: 6, min: 3, reorder: 6, cost: 28 },
  { name: 'Amalgam Carrier Tips', category: 'Instruments', unit: 'packs', unitsPerPackage: 10, baseQty: 3, min: 2, reorder: 3, cost: 15 },
  { name: 'Mirror Heads Disposable', category: 'Instruments', unit: 'boxes', unitsPerPackage: 100, baseQty: 4, min: 2, reorder: 4, cost: 45 },
  { name: 'Explorer Tips', category: 'Instruments', unit: 'packs', unitsPerPackage: 6, baseQty: 5, min: 2, reorder: 4, cost: 22 },
  { name: 'Periodontal Probe Tips', category: 'Instruments', unit: 'packs', unitsPerPackage: 6, baseQty: 4, min: 2, reorder: 4, cost: 24 },
  { name: 'Cavitron Insert #1000', category: 'Hygiene', unit: 'pieces', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 4, cost: 120 },
  { name: 'Air Polisher Powder', category: 'Hygiene', unit: 'bottles', unitsPerPackage: 1, baseQty: 5, min: 2, reorder: 4, cost: 55 },
  { name: 'SRP Local Delivery Antibiotic', category: 'Hygiene', unit: 'kits', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 4, cost: 95 },
  { name: 'Desensitizing Agent', category: 'Hygiene', unit: 'syringes', unitsPerPackage: 1, baseQty: 10, min: 5, reorder: 10, cost: 18 },
  { name: 'Hemodent Liquid', category: 'Restorative', unit: 'bottles', unitsPerPackage: 1, baseQty: 5, min: 2, reorder: 4, cost: 26 },
  { name: 'Temporary Crown Forms', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 65 },
  { name: 'Bite Sticks', category: 'Disposables', unit: 'bags', unitsPerPackage: 100, baseQty: 4, min: 2, reorder: 4, cost: 12 },
  { name: 'Cotton Tip Applicators', category: 'Disposables', unit: 'boxes', unitsPerPackage: 1000, baseQty: 6, min: 3, reorder: 6, cost: 8 },
  { name: 'Tongue Depressors', category: 'Disposables', unit: 'boxes', unitsPerPackage: 500, baseQty: 4, min: 2, reorder: 4, cost: 7 },
  { name: 'Suction Canister Liners', category: 'Disposables', unit: 'boxes', unitsPerPackage: 50, baseQty: 5, min: 3, reorder: 6, cost: 32 },
  { name: 'Biohazard Bags', category: 'Sterilization', unit: 'boxes', unitsPerPackage: 100, baseQty: 4, min: 2, reorder: 4, cost: 18 },
  { name: 'Sharps Containers', category: 'Sterilization', unit: 'pieces', unitsPerPackage: 1, baseQty: 8, min: 4, reorder: 6, cost: 12 },
  { name: 'Spore Test Vials', category: 'Sterilization', unit: 'boxes', unitsPerPackage: 25, baseQty: 3, min: 2, reorder: 3, cost: 55 },
  { name: 'Enzyme Instrument Spray', category: 'Sterilization', unit: 'bottles', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 6, cost: 22 },
  { name: 'Handpiece Lubricant', category: 'Instruments', unit: 'cans', unitsPerPackage: 1, baseQty: 5, min: 2, reorder: 4, cost: 38 },
  { name: 'Bur Blocks Empty', category: 'Instruments', unit: 'pieces', unitsPerPackage: 1, baseQty: 6, min: 2, reorder: 4, cost: 18 },
  { name: 'Composite Warming Tray Liners', category: 'Restorative', unit: 'packs', unitsPerPackage: 50, baseQty: 3, min: 2, reorder: 3, cost: 20 },
  { name: 'Curing Light Sleeves', category: 'Restorative', unit: 'boxes', unitsPerPackage: 200, baseQty: 5, min: 3, reorder: 6, cost: 24 },
  { name: 'Rubber Dam Napkins', category: 'Endodontics', unit: 'packs', unitsPerPackage: 50, baseQty: 4, min: 2, reorder: 4, cost: 14 },
  { name: 'Dental Floss Threaders', category: 'Hygiene', unit: 'boxes', unitsPerPackage: 100, baseQty: 4, min: 2, reorder: 4, cost: 12 },
  { name: 'Interproximal Brushes', category: 'Hygiene', unit: 'boxes', unitsPerPackage: 50, baseQty: 5, min: 2, reorder: 4, cost: 16 },
  { name: 'Ortho Wax', category: 'Disposables', unit: 'boxes', unitsPerPackage: 100, baseQty: 3, min: 2, reorder: 3, cost: 15 },
  { name: 'Temporary Soft Reline', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 55 },
  { name: 'Denture Adhesive Samples', category: 'Disposables', unit: 'boxes', unitsPerPackage: 50, baseQty: 4, min: 2, reorder: 4, cost: 22 },
  { name: 'Fluoride Trays Disposable', category: 'Hygiene', unit: 'boxes', unitsPerPackage: 100, baseQty: 5, min: 3, reorder: 6, cost: 28 },
  { name: 'Nitrous Oxide Nasal Hoods', category: 'Anesthetics', unit: 'boxes', unitsPerPackage: 24, baseQty: 4, min: 2, reorder: 4, cost: 48 },
  { name: 'Scavenger System Filters', category: 'Anesthetics', unit: 'pieces', unitsPerPackage: 1, baseQty: 6, min: 3, reorder: 6, cost: 35 },
  { name: 'Emergency Oxygen Masks', category: 'PPE', unit: 'pieces', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 2, cost: 18 },
  { name: 'Ammonia Inhalants', category: 'Disposables', unit: 'boxes', unitsPerPackage: 10, baseQty: 3, min: 1, reorder: 2, cost: 12 },
  { name: 'Glucose Tablets', category: 'Disposables', unit: 'bottles', unitsPerPackage: 1, baseQty: 3, min: 1, reorder: 2, cost: 8 },
  { name: 'Cold Sterile Solution', category: 'Sterilization', unit: 'gallons', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 45 },
  { name: 'Impression Mixing Tips', category: 'Impression', unit: 'bags', unitsPerPackage: 50, baseQty: 8, min: 4, reorder: 8, cost: 22 },
  { name: 'Dynamic Mixing Tips', category: 'Impression', unit: 'bags', unitsPerPackage: 40, baseQty: 5, min: 3, reorder: 6, cost: 28 },
  { name: 'Triple Tray Disposable', category: 'Impression', unit: 'boxes', unitsPerPackage: 50, baseQty: 4, min: 2, reorder: 4, cost: 55 },
  { name: 'Alginate Spatulas Disposable', category: 'Impression', unit: 'boxes', unitsPerPackage: 100, baseQty: 3, min: 2, reorder: 3, cost: 20 },
  { name: 'Water Syringe Bottles', category: 'Disposables', unit: 'pieces', unitsPerPackage: 1, baseQty: 16, min: 8, reorder: 12, cost: 4 },
  { name: 'Unit Dose Etchant', category: 'Restorative', unit: 'boxes', unitsPerPackage: 50, baseQty: 4, min: 2, reorder: 4, cost: 42 },
  { name: 'Unit Dose Bond', category: 'Restorative', unit: 'boxes', unitsPerPackage: 50, baseQty: 3, min: 2, reorder: 4, cost: 85 },
  { name: 'Mylar Strips', category: 'Restorative', unit: 'packs', unitsPerPackage: 100, baseQty: 5, min: 2, reorder: 4, cost: 14 },
  { name: 'Celluloid Crowns', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 2, min: 2, reorder: 2, cost: 75 },
  { name: 'Zinc Oxide Eugenol', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 3, cost: 28 },
  { name: 'IRM Material', category: 'Restorative', unit: 'kits', unitsPerPackage: 1, baseQty: 4, min: 2, reorder: 3, cost: 32 },
  { name: 'Calcium Hydroxide Powder', category: 'Endodontics', unit: 'jars', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 18 },
  { name: 'Apex Locator Probe Covers', category: 'Endodontics', unit: 'packs', unitsPerPackage: 50, baseQty: 4, min: 2, reorder: 4, cost: 25 },
  { name: 'Endo Rulers Disposable', category: 'Endodontics', unit: 'packs', unitsPerPackage: 50, baseQty: 3, min: 2, reorder: 3, cost: 16 },
  { name: 'Implant Analog Assortment', category: 'Implant', unit: 'kits', unitsPerPackage: 1, baseQty: 2, min: 2, reorder: 2, cost: 150 },
  { name: 'Torque Wrench Drivers', category: 'Implant', unit: 'sets', unitsPerPackage: 1, baseQty: 2, min: 1, reorder: 1, cost: 220 },
  { name: 'Surgical Guide Sleeves', category: 'Implant', unit: 'packs', unitsPerPackage: 10, baseQty: 3, min: 2, reorder: 3, cost: 65 },
  { name: 'PRP Tubes', category: 'Surgery', unit: 'boxes', unitsPerPackage: 25, baseQty: 2, min: 2, reorder: 2, cost: 95 },
  { name: 'Bone Collectors Disposable', category: 'Surgery', unit: 'pieces', unitsPerPackage: 1, baseQty: 5, min: 2, reorder: 4, cost: 35 },
  { name: 'Collagen Plugs', category: 'Surgery', unit: 'boxes', unitsPerPackage: 10, baseQty: 3, min: 2, reorder: 3, cost: 85 },
  { name: 'Socket Preservation Kit', category: 'Surgery', unit: 'kits', unitsPerPackage: 1, baseQty: 3, min: 2, reorder: 3, cost: 140 },
]

function toItem(seed: CatalogSeed): InventoryItem {
  return {
    id: seed.id,
    name: seed.name,
    category: seed.category,
    sku: seed.sku,
    vendorId: seed.vendorId,
    currentQuantity: seed.currentQuantity,
    unit: seed.unit,
    unitsPerPackage: seed.unitsPerPackage,
    minimumQuantity: seed.minimumQuantity,
    preferredReorderQuantity: seed.preferredReorderQuantity,
    storageLocation: seed.storageLocation,
    lastRestocked: seed.lastRestocked,
    notes: seed.notes ?? '',
    expirationDate: seed.expirationDate,
  }
}

function buildExpandedCatalog(): { items: InventoryItem[]; unitCosts: Record<string, number> } {
  const items: InventoryItem[] = coreCatalog.map(toItem)
  const unitCosts: Record<string, number> = {}
  for (const c of coreCatalog) unitCosts[c.id] = c.unitCost

  let idx = coreCatalog.length + 1
  for (const extra of extraProducts) {
    if (items.length >= 200) break
    const id = `i${idx}`
    const vendorId = `v${((idx - 1) % 4) + 1}`
    const sku = `${extra.category.slice(0, 3).toUpperCase()}-${idx.toString().padStart(3, '0')}`
    items.push({
      id,
      name: extra.name,
      category: extra.category,
      sku,
      vendorId,
      currentQuantity: extra.baseQty,
      unit: extra.unit,
      unitsPerPackage: extra.unitsPerPackage,
      minimumQuantity: extra.min,
      preferredReorderQuantity: extra.reorder,
      storageLocation: locations[idx % locations.length],
      lastRestocked: `2026-06-${String((idx % 28) + 1).padStart(2, '0')}`,
      notes: '',
    })
    unitCosts[id] = extra.cost
    idx += 1
  }

  // Pad to exactly 200 with numbered accessory SKUs if needed
  while (items.length < 200) {
    const id = `i${items.length + 1}`
    const n = items.length + 1
    items.push({
      id,
      name: `Clinic Accessory Supply ${n}`,
      category: 'Disposables',
      sku: `ACC-${n.toString().padStart(3, '0')}`,
      vendorId: `v${(n % 4) + 1}`,
      currentQuantity: 10 + (n % 20),
      unit: 'units',
      unitsPerPackage: 1,
      minimumQuantity: 5,
      preferredReorderQuantity: 15,
      storageLocation: locations[n % locations.length],
      lastRestocked: '2026-06-15',
      notes: '',
    })
    unitCosts[id] = 5 + (n % 20)
  }

  return { items, unitCosts }
}

const built = buildExpandedCatalog()
export const inventoryItems: InventoryItem[] = built.items
export const unitCosts: Record<string, number> = built.unitCosts

export const categories = [
  ...new Set(inventoryItems.map((i) => i.category)),
].sort()
