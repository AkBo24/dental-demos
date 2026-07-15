import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types'

const styles: Record<RiskLevel, string> = {
  none: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  low: 'bg-sky-50 text-sky-800 ring-sky-200',
  moderate: 'bg-amber-50 text-amber-800 ring-amber-200',
  high: 'bg-orange-50 text-orange-800 ring-orange-200',
  critical: 'bg-rose-50 text-rose-800 ring-rose-200',
}

const labels: Record<RiskLevel, string> = {
  none: 'Ready',
  low: 'Watch',
  moderate: 'At risk',
  high: 'High risk',
  critical: 'Critical',
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        styles[level],
      )}
    >
      {labels[level]}
    </span>
  )
}

export function RiskScoreGauge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-rose-700'
  const bar =
    score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Inventory risk score</p>
          <p className={`mt-1 text-4xl font-bold tabular-nums ${color}`}>{score}</p>
          <p className="mt-1 text-sm font-medium text-ink">{label}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted">
        <span>Critical</span>
        <span>Perfect</span>
      </div>
    </div>
  )
}
