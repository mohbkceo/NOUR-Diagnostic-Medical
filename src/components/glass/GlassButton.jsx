import { cn } from '../../utils/cn'

// Reserved for floating / overlay contexts (e.g. the mobile sticky booking
// control) where a glass affordance genuinely helps it read as an
// interface layer above content. Ordinary in-page CTAs use ui/Button.
export function GlassButton({ as: Tag = 'button', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'glass-surface inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3',
        'text-sm font-medium text-primary transition-transform duration-250 ease-spring',
        'hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
