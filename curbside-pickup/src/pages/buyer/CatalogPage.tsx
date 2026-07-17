import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductSwatch } from '@/components/ui/ProductSwatch'
import { CATEGORIES, currency } from '@/lib/utils'
import { usePickupStore } from '@/store/pickupStore'
import type { ProductCategory } from '@/types'
import { DEMO_STORE } from '@/data/store'

export function CatalogPage() {
  const products = usePickupStore((s) => s.products)
  const addToCart = usePickupStore((s) => s.addToCart)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'All'>('All')
  const [addedId, setAddedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })
  }, [products, query, category])

  function handleAdd(productId: string) {
    addToCart(productId, 1)
    setAddedId(productId)
    window.setTimeout(() => setAddedId((id) => (id === productId ? null : id)), 900)
  }

  return (
    <div className="space-y-6">
      <section className="animate-fade-up overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-6 py-8 text-white sm:px-8 sm:py-10">
        <p className="text-sm font-medium text-brand-100">{DEMO_STORE.name}</p>
        <h1 className="font-display mt-1 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          GreenCart
        </h1>
        <p className="mt-2 max-w-lg text-sm text-brand-50/90 sm:text-base">
          Order ahead online, pay here, then walk in and grab your bag at the desk.
        </p>
      </section>

      <div className="animate-fade-up stagger-1 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search produce, dairy, snacks…"
            className="h-11 w-full rounded-lg border border-line bg-white pr-3 pl-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
        <p className="text-sm text-muted sm:shrink-0">
          {filtered.length} product{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="animate-fade-up stagger-2 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        <CategoryChip
          label="All"
          active={category === 'All'}
          onClick={() => setCategory('All')}
        />
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, index) => (
          <article
            key={product.id}
            className="animate-fade-up flex gap-3 rounded-xl border border-line bg-white p-3 transition-shadow hover:shadow-sm"
            style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
          >
            <ProductSwatch product={product} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-ink">{product.name}</h2>
                  <p className="text-xs text-muted">
                    {product.category} · {product.unit}
                  </p>
                </div>
                <p className="shrink-0 font-semibold text-brand-800">
                  {currency(product.price)}
                </p>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{product.description}</p>
              <div className="mt-2.5">
                <Button
                  size="sm"
                  variant={addedId === product.id ? 'secondary' : 'primary'}
                  onClick={() => handleAdd(product.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {addedId === product.id ? 'Added' : 'Add'}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">No products match that search.</p>
      ) : null}
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-md bg-brand-700 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white'
          : 'rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted hover:border-brand-200 hover:text-ink'
      }
    >
      {label}
    </button>
  )
}
