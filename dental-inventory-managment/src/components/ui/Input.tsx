import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-line bg-white pr-3 pl-9 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      />
    </div>
  )
}

export function Select({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  label?: string
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      {label ? <span className="text-xs font-medium text-muted">{label}</span> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  min,
  step,
  placeholder,
  error,
  required,
  readOnly,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  min?: number
  step?: number
  placeholder?: string
  error?: string
  required?: boolean
  readOnly?: boolean
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 rounded-md border bg-white px-3 text-sm text-ink focus:ring-2 focus:outline-none',
          readOnly && 'cursor-default bg-slate-50 text-slate-600',
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
            : 'border-line focus:border-brand-600 focus:ring-brand-100',
        )}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}
