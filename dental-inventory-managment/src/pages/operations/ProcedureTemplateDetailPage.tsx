import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getRequirementsForTemplate, getTemplate } from '@/data/mockData'
import { useInventoryStore } from '@/store/inventoryStore'
import { Card, CardHeader } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/EmptyState'
import { currency } from '@/lib/utils'
import { unitCosts } from '@/data/mockData'

export function ProcedureTemplateDetailPage() {
  const { id } = useParams()
  const template = getTemplate(id ?? '')
  const getItem = useInventoryStore((s) => s.getItem)

  if (!template) {
    return <ErrorState message="Procedure template not found." />
  }

  const reqs = getRequirementsForTemplate(template.id)
  const bomCost = reqs.reduce((sum, r) => {
    const item = getItem(r.itemId)
    if (!item) return sum
    const stock = (r.quantity * (1 + r.wastePercent / 100)) / (item.unitsPerPackage || 1)
    return sum + stock * (unitCosts[r.itemId] ?? 0)
  }, 0)

  return (
    <div className="space-y-5">
      <Link
        to="/operations/templates"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All templates
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{template.name}</h1>
        <p className="mt-1 text-sm text-muted">{template.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Category', template.category],
          ['Avg duration', `${template.averageDurationMinutes} min`],
          ['Avg revenue', currency(template.averageRevenue)],
          ['BOM cost (calc)', currency(bomCost)],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-xs text-muted">{k}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{v}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Bill of materials"
          description={`${reqs.length} supply lines · waste factors included in forecast`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Supply</th>
                <th className="px-4 py-2.5 text-right font-semibold">Qty</th>
                <th className="px-4 py-2.5 text-left font-semibold">Unit</th>
                <th className="px-4 py-2.5 text-left font-semibold">Required</th>
                <th className="px-4 py-2.5 text-right font-semibold">Waste %</th>
              </tr>
            </thead>
            <tbody>
              {reqs.map((r) => {
                const item = getItem(r.itemId)
                return (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-2.5">
                      {item ? (
                        <Link
                          to={`/inventory/${item.id}`}
                          className="font-medium hover:text-brand-700 hover:underline"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        r.itemId
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{r.quantity}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.unit}</td>
                    <td className="px-4 py-2.5">{r.required ? 'Required' : 'Optional'}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{r.wastePercent}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
