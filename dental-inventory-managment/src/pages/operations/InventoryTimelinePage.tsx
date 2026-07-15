import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import {
  AlertTriangle,
  ArrowDown,
  CalendarDays,
  PackagePlus,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react'
import { FORECAST_WEEK_START, NEXT_WEEK_START, useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { TimelineEventType } from '@/types'

const icons: Record<TimelineEventType, typeof CalendarDays> = {
  today: CalendarDays,
  shipment: PackagePlus,
  procedure_block: CalendarDays,
  inventory_drop: TrendingDown,
  shortage: AlertTriangle,
  recommendation: ShoppingCart,
}

const tones: Record<TimelineEventType, string> = {
  today: 'bg-brand-50 text-brand-800 ring-brand-200',
  shipment: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  procedure_block: 'bg-sky-50 text-sky-800 ring-sky-200',
  inventory_drop: 'bg-amber-50 text-amber-800 ring-amber-200',
  shortage: 'bg-rose-50 text-rose-800 ring-rose-200',
  recommendation: 'bg-orange-50 text-orange-800 ring-orange-200',
}

export function InventoryTimelinePage() {
  const [weekStart, setWeekStart] = useState(FORECAST_WEEK_START)
  const forecast = useWeeklyForecast(weekStart)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Inventory timeline</h1>
          <p className="mt-1 text-sm text-muted">
            How shipments, procedures, and shortages unfold across the week.
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

      <Card className="p-5 sm:p-8">
        <ol className="relative mx-auto max-w-2xl">
          {forecast.timeline.map((event, index) => {
            const Icon = icons[event.type]
            return (
              <li key={event.id} className="relative pb-8 last:pb-0">
                {index < forecast.timeline.length - 1 ? (
                  <div className="absolute top-10 bottom-0 left-5 flex justify-center">
                    <ArrowDown className="h-4 w-4 text-slate-300" />
                  </div>
                ) : null}
                <div className="flex gap-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1',
                      tones[event.type],
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border border-line bg-slate-50/80 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{event.title}</p>
                      <time className="text-xs tabular-nums text-muted">
                        {format(parseISO(event.date), 'EEE, MMM d')}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                    {event.relatedItemIds?.[0] ? (
                      <Link
                        to={`/inventory/${event.relatedItemIds[0]}`}
                        className="mt-2 inline-block text-xs font-semibold text-brand-700 hover:underline"
                      >
                        View supply →
                      </Link>
                    ) : null}
                    {event.relatedAppointmentIds?.[0] ? (
                      <Link
                        to={`/operations/appointments/${event.relatedAppointmentIds[0]}`}
                        className="mt-2 ml-3 inline-block text-xs font-semibold text-brand-700 hover:underline"
                      >
                        View appointment →
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </Card>
    </div>
  )
}
