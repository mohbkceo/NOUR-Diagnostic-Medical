import { cn } from '../../utils/cn'

// Sticky glass navigation shell. The interface layer where Liquid Glass
// belongs — floating above content rather than part of it.
export function GlassNav({ className, children }) {
  return (
    <div className={cn('sticky top-0 z-40 w-full', className)}>
      <div className="glass-surface border-x-0 border-t-0 shadow-none">{children}</div>
    </div>
  )
}
