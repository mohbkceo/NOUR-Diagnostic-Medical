import { cn } from '../../utils/cn'

/**
 * The single reusable Liquid Glass surface. Use sparingly — the navbar,
 * floating controls, sheets/modals, and small interactive overlays. Never
 * for ordinary content cards or large containers (see design guidelines).
 */
export function GlassSurface({ as: Tag = 'div', deep = false, className, children, ...props }) {
  return (
    <Tag className={cn(deep ? 'glass-surface-deep' : 'glass-surface', 'rounded-lg', className)} {...props}>
      {children}
    </Tag>
  )
}
