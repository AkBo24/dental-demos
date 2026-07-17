import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  PackagePlus,
  ShoppingCart,
  BookOpen,
  ChartColumn,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { AlertBanner } from './AlertBanner'
import { ToastViewport } from '@/components/ui/Toast'
import { useInventoryStore } from '@/store/inventoryStore'
import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { to: '/', label: 'Forecast', icon: Activity, end: true },
      { to: '/operations/schedule', label: 'Procedure Schedule', icon: CalendarDays },
      { to: '/operations/templates', label: 'Procedure Templates', icon: BookOpen },
      { to: '/operations/usage', label: 'Supply Usage', icon: ChartColumn },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { to: '/inventory/dashboard', label: 'Stock Dashboard', icon: LayoutDashboard },
      { to: '/inventory', label: 'Inventory', icon: Package, end: true },
      { to: '/receive', label: 'Receive', icon: PackagePlus },
      { to: '/reorder', label: 'Reorder', icon: ShoppingCart },
      { to: '/purchase-list', label: 'Purchase List', icon: ClipboardList },
    ],
  },
]

function NavLinks({
  onNavigate,
  purchaseCount,
}: {
  onNavigate?: () => void
  purchaseCount: number
}) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            {section.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.to === '/purchase-list' && purchaseCount > 0 ? (
                  <span className="rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {purchaseCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const purchaseCount = useInventoryStore((s) => s.purchaseList.items.length)

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:flex lg:flex-col">
          <div className="border-b border-line px-5 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
                DS
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-ink">DentStock</p>
                <p className="text-xs text-muted">Operations Planning</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            <NavLinks purchaseCount={purchaseCount} />
          </nav>
          <div className="border-t border-line p-4">
            <p className="text-xs font-medium text-ink">Sunrise Dental</p>
            <p className="text-xs text-muted">Office Manager view</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-xs font-bold text-white">
                  DS
                </div>
                <span className="font-bold text-ink">DentStock</span>
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-slate-600 hover:bg-slate-50"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            {mobileOpen ? (
              <nav className="max-h-[70vh] overflow-y-auto border-t border-line px-2 py-2">
                <NavLinks
                  purchaseCount={purchaseCount}
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
            ) : null}
          </header>

          <AlertBanner />

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <ToastViewport />
    </div>
  )
}
