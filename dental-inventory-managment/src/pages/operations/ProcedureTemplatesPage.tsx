import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { procedureTemplates } from '@/data/mockData'
import { SearchInput, Select } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { currency } from '@/lib/utils'

export function ProcedureTemplatesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(
    () => [...new Set(procedureTemplates.map((t) => t.category))].sort(),
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return procedureTemplates.filter((t) => {
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      const matchC = category === 'all' || t.category === category
      return matchQ && matchC
    })
  }, [query, category])

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Operations</p>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Procedure templates</h1>
        <p className="mt-1 text-sm text-muted">
          Catalog of procedures with bills of materials used by the forecast engine.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search procedures…"
            className="md:col-span-2"
          />
          <Select
            value={category}
            onChange={setCategory}
            options={[
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Procedure</th>
                <th className="px-4 py-2.5 text-left font-semibold">Category</th>
                <th className="px-4 py-2.5 text-right font-semibold">Duration</th>
                <th className="px-4 py-2.5 text-right font-semibold">Revenue</th>
                <th className="px-4 py-2.5 text-right font-semibold">Supply cost</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="table-row-interactive border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      to={`/operations/templates/${t.id}`}
                      className="font-medium text-ink hover:text-brand-700 hover:underline"
                    >
                      {t.name}
                    </Link>
                    <p className="text-xs text-muted">{t.description}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.category}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{t.averageDurationMinutes} min</td>
                  <td className="px-4 py-3 text-right tabular-nums">{currency(t.averageRevenue)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{currency(t.estimatedSupplyCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
