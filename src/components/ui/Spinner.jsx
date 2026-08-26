import { cn } from '../../utils/cn'

export function Spinner({ className, size = 18 }) {
  return (
    <span
      className={cn('inline-block animate-spin rounded-full border-2 border-current border-t-transparent', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Chargement"
    />
  )
}
