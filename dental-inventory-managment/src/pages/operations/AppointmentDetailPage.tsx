import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import {
  appointments,
  getOperatory,
  getProvider,
  getTemplate,
} from '@/data/mockData'
import { useInventoryStore } from '@/store/inventoryStore'
import { useOperationsStore } from '@/store/operationsStore'
import { useToastStore } from '@/store/toastStore'
import { useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { evaluateAppointmentSupplies } from '@/domain/forecastEngine'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RiskBadge } from '@/components/operations/RiskBadge'
import { RequiredSuppliesCard } from '@/components/operations/RequiredSuppliesCard'
import { ErrorState } from '@/components/ui/EmptyState'

export function AppointmentDetailPage() {
  const { id } = useParams()
  const appt = appointments.find((a) => a.id === id)
  const items = useInventoryStore((s) => s.items)
  const addToPurchaseList = useInventoryStore((s) => s.addToPurchaseList)
  const templateRequirements = useOperationsStore((s) => s.templateRequirements)
  const visitOverrides = useOperationsStore((s) => s.visitOverrides)
  const pushToast = useToastStore((s) => s.push)
  const forecast = useWeeklyForecast()

  if (!appt) {
    return <ErrorState message="Appointment not found." />
  }

  const template = getTemplate(appt.procedureTemplateId)
  const reqs =
    visitOverrides[appt.id] ??
    templateRequirements.filter((r) => r.procedureTemplateId === appt.procedureTemplateId)
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
          <dl className="space-y-3 px-4 py-4 text-sm sm:px-5">
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

        <RequiredSuppliesCard appointment={appt} />
      </div>
    </div>
  )
}
