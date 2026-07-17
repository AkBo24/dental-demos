import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Package,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react'
import { useState } from 'react'
import { FORECAST_WEEK_START, NEXT_WEEK_START, useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { RiskBadge } from '@/components/operations/RiskBadge'
import { currency } from '@/lib/utils'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { unitCosts } from '@/data/mockData'
import type { ReorderRecommendation } from '@/types'

function WeekToggle({
  weekStart,
  onChange,
}: {
  weekStart: string
  onChange: (w: string) => void
}) {
  return (
    <div className="inline-flex rounded-md border border-line bg-white p-0.5 text-sm">
      <button
        type="button"
        className={`rounded px-3 py-1.5 font-medium ${weekStart === FORECAST_WEEK_START ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        onClick={() => onChange(FORECAST_WEEK_START)}
      >
        This week
      </button>
      <button
        type="button"
        className={`rounded px-3 py-1.5 font-medium ${weekStart === NEXT_WEEK_START ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        onClick={() => onChange(NEXT_WEEK_START)}
      >
        Next week
      </button>
    </div>
  )
}

export function ForecastDashboardPage() {
  const [weekStart, setWeekStart] = useState(FORECAST_WEEK_START)
  const [showLowStock, setShowLowStock] = useState(false)
  const forecast = useWeeklyForecast(weekStart)
  const addToPurchaseList = useInventoryStore((s) => s.addToPurchaseList)
  const updatePurchaseQuantity = useInventoryStore((s) => s.updatePurchaseQuantity)
  const pushToast = useToastStore((s) => s.push)

  const low = forecast.consumptions.filter((c) => c.fallsBelowPar && !c.projectedStockout)
  const outs = forecast.consumptions.filter((c) => c.projectedStockout)
  const maxCat = Math.max(...forecast.consumptionByCategory.map((c) => c.cost), 1)

  const createPO = (rec: ReorderRecommendation) => {
    const added = addToPurchaseList([rec.itemId])
    updatePurchaseQuantity(rec.itemId, rec.recommendedQuantity)
    // Ensure cost is set if newly added — store uses unitCosts
    void unitCosts
    pushToast({
      type: 'success',
      title: added ? 'Added to purchase list' : 'Purchase list updated',
      description: `${rec.recommendedQuantity} ${rec.unit} of ${rec.itemName}`,
    })
  }

  const addAllUrgent = () => {
    const urgent = forecast.recommendations.filter((r) => r.urgency === 'today' || r.urgency === 'this_week')
    const ids = urgent.map((r) => r.itemId)
    addToPurchaseList(ids)
    for (const rec of urgent) updatePurchaseQuantity(rec.itemId, rec.recommendedQuantity)
    pushToast({
      type: 'success',
      title: `Queued ${urgent.length} recommendations`,
      description: 'Review quantities on the Purchase List.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Inventory forecast</h1>
          <p className="mt-1 text-sm text-muted">
            Based on the schedule for {forecast.weekStart} → {forecast.weekEnd} — what will we consume,
            and what is at risk?
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <WeekToggle weekStart={weekStart} onChange={setWeekStart} />
          <Link to="/operations/schedule">
            <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4" />
              Schedule
            </Button>
          </Link>
          <Button size="sm" onClick={addAllUrgent}>
            <ShoppingCart className="h-4 w-4" />
            Queue urgent orders
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Appointments this week',
            value: String(forecast.appointmentCount),
            icon: CalendarDays,
            tone: 'text-brand-800 bg-brand-50',
            to: '/operations/schedule',
            hoverClass: 'hover:border-brand-300 hover:bg-brand-50/40',
          },
          {
            label: 'Expected material cost',
            value: currency(forecast.expectedMaterialCost),
            icon: Package,
            tone: 'text-slate-800 bg-slate-100',
          },
          {
            label: 'Projected low stock',
            value: String(low.length),
            icon: TrendingDown,
            tone: 'text-amber-800 bg-amber-50',
            onClick: () => setShowLowStock(true),
            hoverClass: 'hover:border-amber-300 hover:bg-amber-50/40',
          },
          {
            label: 'Projected stockouts',
            value: String(outs.length),
            icon: AlertTriangle,
            tone: 'text-rose-800 bg-rose-50',
          },
        ].map((s) => {
          const content = (
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-md ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-ink">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            </div>
          )

          const interactiveClass =
            'cursor-pointer rounded-lg border border-line bg-surface p-4 text-left shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'

          if (s.to) {
            return (
              <Link
                key={s.label}
                to={s.to}
                className={`${interactiveClass} ${s.hoverClass ?? ''}`}
              >
                {content}
              </Link>
            )
          }

          if (s.onClick) {
            return (
              <button
                key={s.label}
                type="button"
                onClick={s.onClick}
                aria-label={`View ${s.value} ${s.label.toLowerCase()} items`}
                className={`${interactiveClass} ${s.hoverClass ?? ''}`}
              >
                {content}
              </button>
            )
          }

          return (
            <Card key={s.label} className="p-4">
              {content}
            </Card>
          )
        })}
      </div>

      <Card>
          <CardHeader
            title="Upcoming procedures at risk"
            description="Required supplies projected insufficient before chair time"
            action={
              <Link to="/operations/schedule" className="text-sm font-semibold text-brand-700 hover:underline">
                Open schedule
              </Link>
            }
          />
          {forecast.appointmentRisks.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">No at-risk appointments for this week.</p>
          ) : (
            <ul className="divide-y divide-line">
              {forecast.appointmentRisks.slice(0, 8).map((r) => (
                <li key={r.appointmentId} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/operations/appointments/${r.appointmentId}`}
                      className="font-medium text-ink hover:text-brand-700 hover:underline"
                    >
                      {r.patientName} · {r.procedureName}
                    </Link>
                    <p className="text-xs text-muted">
                      {new Date(r.startTime).toLocaleString()} · missing{' '}
                      {r.missingSupplies.map((m) => m.itemName).join(', ')}
                    </p>
                  </div>
                  <RiskBadge level={r.riskLevel} />
                </li>
              ))}
            </ul>
          )}
        </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Projected inventory after this week" description="Items sorted by remaining risk" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b border-line bg-slate-50 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Item</th>
                  <th className="px-4 py-2 text-right font-semibold">Use</th>
                  <th className="px-4 py-2 text-right font-semibold">Left</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {forecast.consumptions.slice(0, 12).map((c) => (
                  <tr key={c.itemId} className="border-b border-line last:border-0">
                    <td className="px-4 py-2.5">
                      <Link to={`/inventory/${c.itemId}`} className="font-medium hover:text-brand-700 hover:underline">
                        {c.itemName}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {c.projectedConsumption} {c.unit}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                      {c.projectedRemaining}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={c.statusAfter} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Reorder recommendations"
            description="Intelligent suggestions from schedule demand"
            action={
              <Link to="/purchase-list" className="text-sm font-semibold text-brand-700 hover:underline">
                Purchase list
              </Link>
            }
          />
          {forecast.recommendations.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">No reorder recommendations this week.</p>
          ) : (
            <ul className="divide-y divide-line">
              {forecast.recommendations.slice(0, 8).map((rec) => (
                <li key={rec.id} className="px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{rec.itemName}</p>
                      <p className="mt-0.5 text-xs text-muted">{rec.reason}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        <span className="font-semibold capitalize text-amber-800">{rec.urgency.replace('_', ' ')}</span>
                        {' · '}
                        {rec.recommendedQuantity} {rec.unit} · {currency(rec.estimatedCost)} · {rec.vendorName}
                      </p>
                      {rec.affectedProcedures.length > 0 ? (
                        <p className="mt-1 text-xs text-muted">
                          Affects: {rec.affectedProcedures.slice(0, 3).join(', ')}
                          {rec.affectedProcedures.length > 3 ? '…' : ''}
                        </p>
                      ) : null}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => createPO(rec)}>
                      Create PO
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Most used supplies" description="Highest projected consumption" />
          <ul className="divide-y divide-line px-1">
            {forecast.mostUsedSupplies.map((s, i) => (
              <li key={s.itemId} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-5 text-xs font-semibold text-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.itemName}</p>
                </div>
                <span className="text-sm tabular-nums text-slate-700">
                  {s.quantity} {s.unit}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Supply consumption by category" description="Estimated material cost mix" />
          <div className="space-y-3 px-4 py-4 sm:px-5">
            {forecast.consumptionByCategory.slice(0, 8).map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{c.category}</span>
                  <span className="font-medium tabular-nums">{currency(c.cost)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${Math.max(4, (c.cost / maxCat) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/operations/usage">
          <Button variant="outline" size="sm">
            Supply usage
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/operations/templates">
          <Button variant="outline" size="sm">
            Procedure templates
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Modal
        open={showLowStock}
        onClose={() => setShowLowStock(false)}
        title="Projected low stock"
        description={`${low.length} item${low.length === 1 ? '' : 's'} projected below par for this schedule`}
        footer={
          <Button variant="outline" onClick={() => setShowLowStock(false)}>
            Close
          </Button>
        }
      >
        {low.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted">
            No items are projected below par this week.
          </p>
        ) : (
          <ul className="-mx-5 divide-y divide-line">
            {low.map((item) => (
              <li key={item.itemId} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/inventory/${item.itemId}`}
                      onClick={() => setShowLowStock(false)}
                      className="font-medium text-ink hover:text-brand-700 hover:underline"
                    >
                      {item.itemName}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      Projected remaining{' '}
                      <span className="font-semibold text-amber-800">
                        {item.projectedRemaining} {item.unit}
                      </span>
                      {' · '}Par level {item.minimumQuantity} {item.unit}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      Scheduled demand {item.projectedConsumption} {item.unit}
                    </p>
                  </div>
                  <StatusBadge status={item.statusAfter} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
