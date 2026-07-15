import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FORECAST_WEEK_START, NEXT_WEEK_START, useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchInput, Select } from '@/components/ui/Input'
import { currency, cn } from '@/lib/utils'

export function SupplyUsagePage() {
  const [weekStart, setWeekStart] = useState(FORECAST_WEEK_START)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const forecast = useWeeklyForecast(weekStart)

  const categories = useMemo(
    () => [...new Set(forecast.consumptions.map((c) => c.category))].sort(),
    [forecast.consumptions],
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return forecast.consumptions.filter((c) => {
      const matchQ = !q || c.itemName.toLowerCase().includes(q)
      const matchC = category === 'all' || c.category === category
      return matchQ && matchC
    })
  }, [forecast.consumptions, query, category])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Supply usage</h1>
          <p className="mt-1 text-sm text-muted">
            Aggregated projected consumption from the procedure schedule.
          </p>
        </div>
        <div className="inline-flex rounded-md border border-line bg-white p-0.5 text-sm">
          <button
            type="button"
            className={cn(
              'rounded px-3 py-1.5 font-medium',
              weekStart === FORECAST_WEEK_START ? 'bg-brand-700 text-white' : 'text-slate-600',
            )}
            onClick={() => setWeekStart(FORECAST_WEEK_START)}
          >
            This week
          </button>
          <button
            type="button"
            className={cn(
              'rounded px-3 py-1.5 font-medium',
              weekStart === NEXT_WEEK_START ? 'bg-brand-700 text-white' : 'text-slate-600',
            )}
            onClick={() => setWeekStart(NEXT_WEEK_START)}
          >
            Next week
          </button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Search supplies…" className="md:col-span-2" />
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
        <CardHeader
          title={`${rows.length} supplies with projected use`}
          description={`Total material cost ${currency(forecast.expectedMaterialCost)}`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Supply</th>
                <th className="px-4 py-2.5 text-left font-semibold">Category</th>
                <th className="px-4 py-2.5 text-right font-semibold">On hand</th>
                <th className="px-4 py-2.5 text-right font-semibold">Projected use</th>
                <th className="px-4 py-2.5 text-right font-semibold">Remaining</th>
                <th className="px-4 py-2.5 text-right font-semibold">Cost</th>
                <th className="px-4 py-2.5 text-left font-semibold">After</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.itemId} className="table-row-interactive border-b border-line last:border-0">
                  <td className="px-4 py-2.5">
                    <Link to={`/inventory/${c.itemId}`} className="font-medium hover:text-brand-700 hover:underline">
                      {c.itemName}
                    </Link>
                    <p className="text-xs text-muted">
                      Used by {c.procedureNames.slice(0, 2).join(', ')}
                      {c.procedureNames.length > 2 ? ` +${c.procedureNames.length - 2}` : ''}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{c.category}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {c.currentQuantity} {c.unit}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{c.projectedConsumption}</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{c.projectedRemaining}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{currency(c.estimatedCost)}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={c.statusAfter} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
