import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  PackageCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
} from 'lucide-react'
import { DEMO_STORE } from '@/data/store'
import { cn } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'
import { Button } from '@/components/ui/Button'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = usePickupStore((s) => s.cartCount())
  const queueCount = usePickupStore(
    (s) => s.orders.filter((o) => o.status !== 'picked_up').length,
  )
  const isBuyer = location.pathname.startsWith('/buyer')
  const isPacker = location.pathname.startsWith('/packer')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold leading-tight tracking-tight text-ink">
                GreenCart
              </p>
              <p className="truncate text-xs text-muted">
                {DEMO_STORE.name} · desk pickup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex rounded-lg border border-line bg-canvas p-0.5"
              role="group"
              aria-label="Role switcher"
            >
              <button
                type="button"
                onClick={() => navigate('/buyer')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isBuyer
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-muted hover:text-ink',
                )}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => navigate('/packer')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isPacker
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-muted hover:text-ink',
                )}
              >
                Packer
              </button>
            </div>
          </div>
        </div>

        {isBuyer ? (
          <nav className="border-t border-line/60 bg-white/60">
            <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2 sm:px-4">
              <TabLink to="/buyer" end icon={ShoppingBag} label="Catalog" />
              <TabLink
                to="/buyer/cart"
                icon={ShoppingCart}
                label="Cart"
                badge={cartCount > 0 ? cartCount : undefined}
              />
              <TabLink to="/buyer/orders" icon={ClipboardList} label="My orders" />
            </div>
          </nav>
        ) : null}

        {isPacker ? (
          <nav className="border-t border-line/60 bg-white/60">
            <div className="mx-auto flex max-w-6xl gap-1 px-2 py-2 sm:px-4">
              <TabLink
                to="/packer"
                end
                icon={PackageCheck}
                label="Pickup queue"
                badge={queueCount > 0 ? queueCount : undefined}
              />
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line/70 py-6 text-center text-xs text-muted">
        <p>
          {DEMO_STORE.address} · {DEMO_STORE.deskHours}
        </p>
        <p className="mt-1">
          Demo prototype — mock payment only ·{' '}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-1 py-0 text-xs text-brand-700"
            onClick={() => {
              usePickupStore.getState().resetDemo()
              navigate('/buyer')
            }}
          >
            Reset demo data
          </Button>
        </p>
      </footer>
    </div>
  )
}

function TabLink({
  to,
  end,
  icon: Icon,
  label,
  badge,
}: {
  to: string
  end?: boolean
  icon: typeof ShoppingBag
  label: string
  badge?: number
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-800'
            : 'text-muted hover:bg-brand-50/60 hover:text-ink',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
      {badge !== undefined ? (
        <span className="rounded-md bg-brand-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </NavLink>
  )
}
