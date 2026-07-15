import { create } from 'zustand'
import {
  initialPurchaseList,
  inventoryItems as seedItems,
  transactions as seedTransactions,
  unitCosts,
  vendors as seedVendors,
} from '@/data/mockData'
import type {
  InventoryItem,
  InventoryTransaction,
  PurchaseList,
  PurchaseListItem,
  Vendor,
} from '@/types'
import { getItemStatus } from '@/lib/utils'

interface InventoryState {
  vendors: Vendor[]
  items: InventoryItem[]
  transactions: InventoryTransaction[]
  purchaseList: PurchaseList
  submittedLists: PurchaseList[]
  isLoading: boolean
  error: string | null

  // Derived helpers exposed as actions
  getVendor: (id: string) => Vendor | undefined
  getItem: (id: string) => InventoryItem | undefined
  getAttentionItems: () => InventoryItem[]
  getRecentlyReceived: (limit?: number) => InventoryTransaction[]

  // Mutations
  setLoading: (loading: boolean) => void
  receiveInventory: (itemId: string, quantity: number, date: string, note?: string) => void
  addToPurchaseList: (itemIds: string[]) => number
  updatePurchaseQuantity: (itemId: string, quantity: number) => void
  removeFromPurchaseList: (itemId: string) => void
  clearPurchaseList: () => void
  submitPurchaseList: (notes?: string) => PurchaseList | null
  simulateLoad: () => Promise<void>
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  vendors: seedVendors,
  items: seedItems,
  transactions: seedTransactions,
  purchaseList: initialPurchaseList,
  submittedLists: [],
  isLoading: false,
  error: null,

  getVendor: (id) => get().vendors.find((v) => v.id === id),
  getItem: (id) => get().items.find((i) => i.id === id),

  getAttentionItems: () =>
    get().items.filter((item) => getItemStatus(item) !== 'Healthy'),

  getRecentlyReceived: (limit = 5) =>
    [...get().transactions]
      .filter((t) => t.type === 'received')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit),

  setLoading: (loading) => set({ isLoading: loading }),

  receiveInventory: (itemId, quantity, date, note) => {
    if (quantity <= 0) {
      set({ error: 'Quantity must be greater than zero.' })
      return
    }

    set((state) => {
      const items = state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentQuantity: item.currentQuantity + quantity,
              lastRestocked: date,
            }
          : item,
      )

      const transaction: InventoryTransaction = {
        id: uid('t'),
        itemId,
        type: 'received',
        quantity,
        date,
        note: note || 'Manual receive',
        reference: `RCV-${Date.now().toString().slice(-6)}`,
      }

      return {
        items,
        transactions: [transaction, ...state.transactions],
        error: null,
      }
    })
  },

  addToPurchaseList: (itemIds) => {
    let added = 0
    set((state) => {
      if (state.purchaseList.status === 'submitted') {
        return state
      }

      const existing = new Map(
        state.purchaseList.items.map((i) => [i.itemId, i] as const),
      )

      for (const itemId of itemIds) {
        const item = state.items.find((i) => i.id === itemId)
        if (!item) continue
        if (existing.has(itemId)) continue

        const entry: PurchaseListItem = {
          itemId,
          quantity: item.preferredReorderQuantity,
          unitCost: unitCosts[itemId] ?? 10,
        }
        existing.set(itemId, entry)
        added += 1
      }

      return {
        purchaseList: {
          ...state.purchaseList,
          items: Array.from(existing.values()),
        },
      }
    })
    return added
  },

  updatePurchaseQuantity: (itemId, quantity) => {
    set((state) => ({
      purchaseList: {
        ...state.purchaseList,
        items: state.purchaseList.items.map((i) =>
          i.itemId === itemId ? { ...i, quantity: Math.max(1, quantity) } : i,
        ),
      },
    }))
  },

  removeFromPurchaseList: (itemId) => {
    set((state) => ({
      purchaseList: {
        ...state.purchaseList,
        items: state.purchaseList.items.filter((i) => i.itemId !== itemId),
      },
    }))
  },

  clearPurchaseList: () => {
    set((state) => ({
      purchaseList: {
        ...state.purchaseList,
        items: [],
        notes: '',
      },
    }))
  },

  submitPurchaseList: (notes) => {
    const state = get()
    if (state.purchaseList.items.length === 0) {
      set({ error: 'Purchase list is empty.' })
      return null
    }

    const submitted: PurchaseList = {
      ...state.purchaseList,
      id: uid('po'),
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      notes: notes ?? state.purchaseList.notes,
    }

    const txns: InventoryTransaction[] = submitted.items.map((line) => ({
      id: uid('t'),
      itemId: line.itemId,
      type: 'purchase_submitted' as const,
      quantity: line.quantity,
      date: new Date().toISOString().slice(0, 10),
      note: 'Added to submitted purchase list',
      reference: submitted.id.toUpperCase(),
    }))

    set({
      submittedLists: [submitted, ...state.submittedLists],
      purchaseList: {
        id: 'pl-draft',
        status: 'draft',
        createdAt: new Date().toISOString(),
        items: [],
        notes: '',
      },
      transactions: [...txns, ...state.transactions],
      error: null,
    })

    return submitted
  },

  simulateLoad: async () => {
    set({ isLoading: true, error: null })
    await new Promise((r) => setTimeout(r, 450))
    set({ isLoading: false })
  },
}))
