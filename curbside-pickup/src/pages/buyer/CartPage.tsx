import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductSwatch } from '@/components/ui/ProductSwatch'
import { TAX_RATE } from '@/data/store'
import { currency } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'

export function CartPage() {
  const navigate = useNavigate()
  const cart = usePickupStore((s) => s.cart)
  const products = usePickupStore((s) => s.products)
  const setCartQuantity = usePickupStore((s) => s.setCartQuantity)
  const removeFromCart = usePickupStore((s) => s.removeFromCart)
  const clearCart = usePickupStore((s) => s.clearCart)
  const subtotal = usePickupStore((s) => s.cartSubtotal())
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      return { item, product }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-8 w-8" />}
        title="Your cart is empty"
        description="Browse the catalog and add a few items for desk pickup."
        action={
          <Button onClick={() => navigate('/buyer')}>Browse catalog</Button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Cart</h1>
          <p className="text-sm text-muted">
            {lines.length} line{lines.length === 1 ? '' : 's'} ready for checkout
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear
        </Button>
      </div>

      <ul className="space-y-3">
        {lines.map(({ item, product }) => (
          <li
            key={product.id}
            className="flex gap-3 rounded-xl border border-line bg-white p-3 sm:p-4"
          >
            <ProductSwatch product={product} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink">{product.name}</p>
                  <p className="text-xs text-muted">
                    {currency(product.price)} / {product.unit}
                  </p>
                </div>
                <p className="font-semibold text-ink">
                  {currency(product.price * item.quantity)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="inline-flex items-center rounded-md border border-line">
                  <button
                    type="button"
                    className="px-2 py-1.5 text-muted hover:bg-brand-50 hover:text-ink"
                    onClick={() => setCartQuantity(product.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="px-2 py-1.5 text-muted hover:bg-brand-50 hover:text-ink"
                    onClick={() => setCartQuantity(product.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
                  onClick={() => removeFromCart(product.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium">{currency(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tax (est.)</dt>
            <dd className="font-medium">{currency(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-semibold text-brand-800">{currency(total)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={() => navigate('/buyer/checkout')}>
            Checkout
          </Button>
          <Link
            to="/buyer"
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-medium text-ink hover:bg-brand-50"
          >
            Keep shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
