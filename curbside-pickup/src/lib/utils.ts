import type { OrderStatus, ProductCategory } from '@/types'

export function currency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  paid: 'Paid',
  packing: 'Packing',
  ready: 'Ready',
  picked_up: 'Picked up',
}

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  paid: 'bg-sky-50 text-sky-800 ring-sky-200',
  packing: 'bg-amber-50 text-amber-900 ring-amber-200',
  ready: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  picked_up: 'bg-slate-100 text-slate-600 ring-slate-200',
}

/** Packer queue priority: active work first, then ready handoff, then newest paid */
export const QUEUE_STATUS_ORDER: OrderStatus[] = ['packing', 'paid', 'ready', 'picked_up']

export const CATEGORIES: ProductCategory[] = [
  'Produce',
  'Dairy',
  'Bakery',
  'Meat & Seafood',
  'Pantry',
  'Beverages',
  'Frozen',
  'Snacks',
]
