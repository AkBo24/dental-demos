export type OrderStatus = 'paid' | 'packing' | 'ready' | 'picked_up'

export type ProductCategory =
  | 'Produce'
  | 'Dairy'
  | 'Bakery'
  | 'Meat & Seafood'
  | 'Pantry'
  | 'Beverages'
  | 'Frozen'
  | 'Snacks'

export interface Store {
  id: string
  name: string
  address: string
  deskHours: string
}

export interface Product {
  id: string
  storeId: string
  name: string
  price: number
  category: ProductCategory
  unit: string
  description: string
  /** CSS hue used for placeholder swatch */
  hue: number
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface OrderLine {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  packed: boolean
}

export interface Order {
  id: string
  storeId: string
  status: OrderStatus
  lines: OrderLine[]
  subtotal: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string
  readyAt?: string
  pickedUpAt?: string
}
