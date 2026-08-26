import { cn } from '../../utils/cn'
import { Container } from './Container'

// Alternating-background section wrapper — the primary tool for visual
// separation between sections (see design guidelines: no continuous grid).
export function Section({ id, tone = 'white', className, containerClassName, children }) {
  const toneClasses = {
    white: 'bg-white',
    muted: 'bg-surface-muted',
    deep: 'bg-primary-deep text-white',
  }

  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-28', toneClasses[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', className }) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        'mb-10 sm:mb-12',
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {intro ? <p className="mt-3 text-ink-soft">{intro}</p> : null}
    </div>
  )
}
