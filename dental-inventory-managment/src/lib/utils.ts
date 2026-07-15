import type { InventoryItem, InventoryStatus } from '@/types'

export function getItemStatus(item: Pick<InventoryItem, 'currentQuantity' | 'minimumQuantity'>): InventoryStatus {
  if (item.currentQuantity <= 0) return 'Out of Stock'
  if (item.currentQuantity <= Math.ceil(item.minimumQuantity * 0.5)) return 'Critical'
  if (item.currentQuantity <= item.minimumQuantity) return 'Low'
  return 'Healthy'
}

export function currency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
