import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as catalog } from '@/data/catalog'
import { DEMO_STORE, TAX_RATE } from '@/data/store'
import { QUEUE_STATUS_ORDER, uid } from '@/lib/utils'
import type { CartItem, Order, OrderLine, Product } from '@/types'

interface PickupState {
  storeId: string
  products: Product[]
  cart: CartItem[]
  orders: Order[]

  cartCount: () => number
  cartSubtotal: () => number
  getProduct: (id: string) => Product | undefined
  getOrder: (id: string) => Order | undefined
  getActiveOrders: () => Order[]
  getPackerQueue: () => Order[]

  addToCart: (productId: string, quantity?: number) => void
  setCartQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  checkout: () => Order | null

  startPacking: (orderId: string) => void
  toggleLinePacked: (orderId: string, productId: string) => void
  packAllLines: (orderId: string) => void
  markReady: (orderId: string) => void
  markPickedUp: (orderId: string) => void
  resetDemo: () => void
}

function nowIso(): string {
  return new Date().toISOString()
}

function buildLines(cart: CartItem[], products: Product[]): OrderLine[] {
  const lines: OrderLine[] = []
  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId)
    if (!product || item.quantity <= 0) continue
    lines.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      packed: false,
    })
  }
  return lines
}

export const usePickupStore = create<PickupState>()(
  persist(
    (set, get) => ({
      storeId: DEMO_STORE.id,
      products: catalog,
      cart: [],
      orders: [],

      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      cartSubtotal: () => {
        const { cart, products } = get()
        return cart.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId)
          return sum + (product ? product.price * item.quantity : 0)
        }, 0)
      },

      getProduct: (id) => get().products.find((p) => p.id === id),
      getOrder: (id) => get().orders.find((o) => o.id === id),

      getActiveOrders: () =>
        [...get().orders]
          .filter((o) => o.status !== 'picked_up')
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

      getPackerQueue: () =>
        [...get().orders]
          .filter((o) => o.status !== 'picked_up')
          .sort((a, b) => {
            const byStatus =
              QUEUE_STATUS_ORDER.indexOf(a.status) -
              QUEUE_STATUS_ORDER.indexOf(b.status)
            if (byStatus !== 0) return byStatus
            return a.createdAt.localeCompare(b.createdAt)
          }),

      addToCart: (productId, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((c) => c.productId === productId)
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.productId === productId
                  ? { ...c, quantity: c.quantity + quantity }
                  : c,
              ),
            }
          }
          return { cart: [...state.cart, { productId, quantity }] }
        })
      },

      setCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        set((state) => ({
          cart: state.cart.map((c) =>
            c.productId === productId ? { ...c, quantity } : c,
          ),
        }))
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((c) => c.productId !== productId),
        }))
      },

      clearCart: () => set({ cart: [] }),

      checkout: () => {
        const { cart, products, storeId } = get()
        const lines = buildLines(cart, products)
        if (lines.length === 0) return null

        const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
        const tax = Math.round(subtotal * TAX_RATE * 100) / 100
        const total = Math.round((subtotal + tax) * 100) / 100
        const stamp = nowIso()

        const order: Order = {
          id: uid('ord'),
          storeId,
          status: 'paid',
          lines,
          subtotal: Math.round(subtotal * 100) / 100,
          tax,
          total,
          createdAt: stamp,
          updatedAt: stamp,
        }

        set((state) => ({
          orders: [order, ...state.orders],
          cart: [],
        }))

        return order
      },

      startPacking: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId && order.status === 'paid'
              ? { ...order, status: 'packing', updatedAt: nowIso() }
              : order,
          ),
        }))
      },

      toggleLinePacked: (orderId, productId) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order
            if (order.status === 'ready' || order.status === 'picked_up') return order

            const lines = order.lines.map((line) =>
              line.productId === productId ? { ...line, packed: !line.packed } : line,
            )
            const nextStatus =
              order.status === 'paid' ? ('packing' as const) : order.status

            return {
              ...order,
              lines,
              status: nextStatus,
              updatedAt: nowIso(),
            }
          }),
        }))
      },

      packAllLines: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order
            if (order.status === 'ready' || order.status === 'picked_up') return order
            return {
              ...order,
              lines: order.lines.map((line) => ({ ...line, packed: true })),
              status: 'packing',
              updatedAt: nowIso(),
            }
          }),
        }))
      },

      markReady: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order
            if (order.status === 'picked_up') return order
            const allPacked = order.lines.every((l) => l.packed)
            if (!allPacked) return order
            const stamp = nowIso()
            return {
              ...order,
              status: 'ready',
              readyAt: stamp,
              updatedAt: stamp,
            }
          }),
        }))
      },

      markPickedUp: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId || order.status !== 'ready') return order
            const stamp = nowIso()
            return {
              ...order,
              status: 'picked_up',
              pickedUpAt: stamp,
              updatedAt: stamp,
            }
          }),
        }))
      },

      resetDemo: () => set({ cart: [], orders: [] }),
    }),
    {
      name: 'greencart-pickup',
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
      }),
    },
  ),
)
