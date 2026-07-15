import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import {
  appointments,
  getOperatory,
  getProvider,
  getRequirementsForTemplate,
  getTemplate,
} from '@/data/mockData'
import { useInventoryStore } from '@/store/inventoryStore'
import { useToastStore } from '@/store/toastStore'
import { useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { evaluateAppointmentSupplies } from '@/domain/forecastEngine'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RiskBadge } from '@/components/operations/RiskBadge'
import { ErrorState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

export function AppointmentDetailPage() {
  const { id } = useParams()
  const appt = appointments.find((a) => a.id === id)
  const items = useInventoryStore((s) => s.items)
  const addToPurchaseList = useInventoryStore((s) => s.addToPurchaseList)
  const pushToast = useToastStore((s) => s.push)
  const forecast = useWeeklyForecast()

  if (!appt) {
    return <ErrorState message="Appointment not found." />
  }

  const template = getTemplate(appt.procedureTemplateId)
  const reqs = getRequirementsForTemplate(appt.procedureTemplateId)
  const provider = getProvider(appt.providerId)
  const operatory = getOperatory(appt.operatoryId)
  const { lines, riskLevel } = evaluateAppointmentSupplies({
    appointment: appt,
    template,
    requirements: reqs,
    inventory: items,
    forecastConsumptions: forecast.consumptions,
  })

  const orderShortages = () => {
    const ids = lines.filter((l) => !l.ok || l.warn).map((l) => l.item.id)
    const added = addToPurchaseList(ids)
    pushToast({
      type: added ? 'success' : 'info',
      title: added ? `Added ${added} items` : 'Already on purchase list',
      description: 'From appointment supply gaps.',
    })
  }

  return (
    <div className="space-y-5">
      <Link
        to="/operations/schedule"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to schedule
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{template?.name}</h1>
            <RiskBadge level={riskLevel} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {appt.patientName} · {format(parseISO(appt.startTime), 'EEE MMM d · h:mm a')} ·{' '}
            {appt.durationMinutes} min
          </p>
        </div>
        <Button size="sm" onClick={orderShortages}>
          <ShoppingCart className="h-4 w-4" />
          Order shortages
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Procedure information" />
          <dl className="space-y-3 px-4 py-4 sm:px-5 text-sm">
            {[
              ['Patient', appt.patientName],
              ['Provider', provider?.name ?? '—'],
              ['Operatory', operatory?.name ?? '—'],
              ['Status', appt.status.replace('_', ' ')],
              ['Category', template?.category ?? '—'],
              ['Est. revenue', template ? `$${template.averageRevenue}` : '—'],
              ['Est. supply cost', template ? `$${template.estimatedSupplyCost}` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium capitalize text-ink">{v}</dd>
              </div>
            ))}
            {appt.notes ? (
              <div>
                <dt className="text-muted">Notes</dt>
                <dd className="mt-1 text-slate-700">{appt.notes}</dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Required supplies"
            description="Availability for this visit and week demand"
          />
          <ul className="divide-y divide-line">
            {lines.map(({ req, item, stockNeeded, available, weekNeed, ok, warn }) => (
              <li key={req.id} className="flex items-start gap-3 px-4 py-3 sm:px-5">
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                    ok && !warn
                      ? 'bg-emerald-100 text-emerald-700'
                      : ok
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-700',
                  )}
                >
                  {ok && !warn ? '✓' : ok ? '!' : '✕'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/inventory/${item.id}`}
                      className="font-medium text-ink hover:text-brand-700 hover:underline"
                    >
                      {item.name}
                    </Link>
                    {!req.required ? (
                      <span className="text-[10px] font-semibold tracking-wide text-muted uppercase">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted">
                    Need {stockNeeded.toFixed(2)} {item.unit} for this visit · On hand {available}{' '}
                    {item.unit} · Week demand ~{weekNeed.toFixed(2)} {item.unit}
                  </p>
                  {!ok ? (
                    <p className="mt-1 text-xs font-medium text-rose-700">
                      Insufficient for this procedure — order recommended
                    </p>
                  ) : warn ? (
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      Available now, but week demand may exhaust stock
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
