import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/lib/utils'

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 bottom-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertTriangle : Info
        return (
          <div
            key={toast.id}
            className={cn(
              'toast-enter flex gap-3 rounded-lg border bg-white p-3 shadow-lg',
              toast.type === 'success' && 'border-emerald-200',
              toast.type === 'error' && 'border-rose-200',
              toast.type === 'info' && 'border-slate-200',
            )}
          >
            <Icon
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0',
                toast.type === 'success' && 'text-emerald-600',
                toast.type === 'error' && 'text-rose-600',
                toast.type === 'info' && 'text-brand-700',
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-sm text-muted">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
