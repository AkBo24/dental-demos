import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addDays, format, parseISO } from 'date-fns'
import { appointments, getOperatory, getProvider, procedureTemplates } from '@/data/mockData'
import { FORECAST_WEEK_START, NEXT_WEEK_START, useWeeklyForecast } from '@/hooks/useWeeklyForecast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RiskBadge } from '@/components/operations/RiskBadge'
import { cn } from '@/lib/utils'
import type { Appointment } from '@/types'

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16]

function weekDays(weekStart: string) {
  const start = parseISO(weekStart)
  return Array.from({ length: 5 }, (_, i) => addDays(start, i))
}

export function ProcedureSchedulePage() {
  const [weekStart, setWeekStart] = useState(FORECAST_WEEK_START)
  const forecast = useWeeklyForecast(weekStart)
  const riskMap = useMemo(
    () => new Map(forecast.appointmentRisks.map((r) => [r.appointmentId, r])),
    [forecast.appointmentRisks],
  )

  const days = weekDays(weekStart)

  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      map.set(
        key,
        appointments
          .filter((a) => a.startTime.startsWith(key) && a.status !== 'cancelled')
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      )
    }
    return map
  }, [days])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Procedure schedule</h1>
          <p className="mt-1 text-sm text-muted">
            Weekly chair schedule — click an appointment for supply readiness.
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

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-md bg-rose-50 px-2 py-1 font-medium text-rose-800 ring-1 ring-rose-200">
          {forecast.appointmentRisks.length} at risk
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
          {forecast.appointmentCount} appointments
        </span>
        <Link to="/operations/forecast">
          <Button variant="ghost" size="sm">
            View forecast →
          </Button>
        </Link>
      </div>

      {/* Desktop calendar grid */}
      <Card className="hidden overflow-hidden lg:block">
        <div className="grid grid-cols-[64px_repeat(5,1fr)] border-b border-line bg-slate-50">
          <div className="p-2" />
          {days.map((d) => (
            <div key={d.toISOString()} className="border-l border-line px-2 py-2 text-center">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                {format(d, 'EEE')}
              </p>
              <p className="text-sm font-bold text-ink">{format(d, 'MMM d')}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[64px_repeat(5,1fr)]">
          <div className="border-r border-line">
            {HOURS.map((h) => (
              <div key={h} className="h-20 border-b border-line px-1 py-1 text-[10px] text-muted">
                {h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`}
              </div>
            ))}
          </div>
          {days.map((d) => {
            const key = format(d, 'yyyy-MM-dd')
            const dayAppts = byDay.get(key) ?? []
            return (
              <div key={key} className="relative border-l border-line">
                {HOURS.map((h) => (
                  <div key={h} className="h-20 border-b border-line bg-white" />
                ))}
                {dayAppts.map((appt) => {
                  const start = parseISO(appt.startTime)
                  const hour = start.getHours() + start.getMinutes() / 60
                  const top = (hour - 8) * 80
                  const height = Math.max(28, (appt.durationMinutes / 60) * 80 - 4)
                  const provider = getProvider(appt.providerId)
                  const template = procedureTemplates.find((t) => t.id === appt.procedureTemplateId)
                  const risk = riskMap.get(appt.id)
                  if (hour < 8 || hour > 17) return null
                  return (
                    <Link
                      key={appt.id}
                      to={`/operations/appointments/${appt.id}`}
                      className="absolute right-1 left-1 overflow-hidden rounded-md border px-1.5 py-1 text-[11px] shadow-sm hover:brightness-95"
                      style={{
                        top,
                        height,
                        backgroundColor: `${provider?.color ?? '#0f766e'}18`,
                        borderColor: `${provider?.color ?? '#0f766e'}55`,
                      }}
                      title={`${appt.patientName} — ${template?.name}`}
                    >
                      <p className="truncate font-semibold text-ink">{appt.patientName}</p>
                      <p className="truncate text-slate-600">{template?.name}</p>
                      {risk ? (
                        <span className="mt-0.5 inline-block">
                          <RiskBadge level={risk.riskLevel} />
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Mobile / compact list by day */}
      <div className="space-y-4 lg:hidden">
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const dayAppts = byDay.get(key) ?? []
          return (
            <Card key={key}>
              <div className="border-b border-line bg-slate-50 px-4 py-2">
                <p className="text-sm font-semibold">{format(d, 'EEEE, MMM d')}</p>
                <p className="text-xs text-muted">{dayAppts.length} appointments</p>
              </div>
              <ul className="divide-y divide-line">
                {dayAppts.map((appt) => {
                  const provider = getProvider(appt.providerId)
                  const op = getOperatory(appt.operatoryId)
                  const template = procedureTemplates.find((t) => t.id === appt.procedureTemplateId)
                  const risk = riskMap.get(appt.id)
                  return (
                    <li key={appt.id}>
                      <Link
                        to={`/operations/appointments/${appt.id}`}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                      >
                        <div
                          className="mt-1 h-8 w-1 rounded-full"
                          style={{ backgroundColor: provider?.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-ink">{appt.patientName}</p>
                          <p className="text-sm text-slate-600">{template?.name}</p>
                          <p className="text-xs text-muted">
                            {format(parseISO(appt.startTime), 'h:mm a')} · {appt.durationMinutes}m ·{' '}
                            {provider?.name} · {op?.name}
                          </p>
                        </div>
                        {risk ? <RiskBadge level={risk.riskLevel} /> : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
