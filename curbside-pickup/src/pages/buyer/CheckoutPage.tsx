import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CreditCard, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TAX_RATE } from '@/data/store'
import { currency } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'

export function CheckoutPage() {
  const navigate = useNavigate()
  const cart = usePickupStore((s) => s.cart)
  const subtotal = usePickupStore((s) => s.cartSubtotal())
  const checkout = usePickupStore((s) => s.checkout)
  const [name, setName] = useState('Alex Buyer')
  const [card, setCard] = useState('4242 4242 4242 4242')
  const [expiry, setExpiry] = useState('12/28')
  const [cvc, setCvc] = useState('123')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  if (cart.length === 0) {
    return <Navigate to="/buyer/cart" replace />
  }

  async function handlePay(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || card.replace(/\s/g, '').length < 12) {
      setError('Enter a name and mock card number to continue.')
      return
    }
    setPaying(true)
    await new Promise((r) => setTimeout(r, 650))
    const order = checkout()
    setPaying(false)
    if (!order) {
      setError('Could not place order. Try again.')
      return
    }
    navigate(`/buyer/orders/${order.id}`, { replace: true })
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={handlePay}
        className="space-y-5 rounded-xl border border-line bg-white p-5 sm:p-6"
      >
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Checkout</h1>
          <p className="mt-1 text-sm text-muted">
            Mock payment always succeeds — no real charges.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink">Name on card</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            autoComplete="cc-name"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink">Card number</span>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="h-11 w-full rounded-lg border border-line pr-3 pl-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              autoComplete="cc-number"
              inputMode="numeric"
            />
          </div>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Expiry</span>
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              autoComplete="cc-exp"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">CVC</span>
            <input
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              autoComplete="cc-csc"
            />
          </label>
        </div>

        {error ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" loading={paying}>
          <Lock className="h-4 w-4" />
          Pay {currency(total)}
        </Button>

        <p className="text-center text-xs text-muted">
          Or{' '}
          <Link to="/buyer/cart" className="font-medium text-brand-700 hover:underline">
            return to cart
          </Link>
        </p>
      </form>

      <aside className="h-fit rounded-xl border border-line bg-white p-5">
        <h2 className="font-semibold text-ink">Order total</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Items</dt>
            <dd>{cart.reduce((n, c) => n + c.quantity, 0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{currency(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tax</dt>
            <dd>{currency(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-brand-800">{currency(total)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          After payment, your order starts as <strong>Paid</strong>. A packer prepares
          the bag; when status is <strong>Ready</strong>, walk in and collect at the desk.
        </p>
      </aside>
    </div>
  )
}
