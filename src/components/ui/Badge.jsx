import { cn } from '../../utils/cn'

const tones = {
  neutral: 'bg-ink/5 text-ink-soft',
  primary: 'bg-primary-50 text-primary-700',
  new: 'bg-primary-50 text-primary-700',
  reviewing: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-ink/5 text-ink-soft',
  cancelled: 'bg-red-50 text-red-600',
}

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-medium',
        tones[tone] ?? tones.neutral,
        className
      )}
    >
      {children}
    </span>
  )
}
