import { cn } from '../../utils/cn'

// Renders the real logo once one is uploaded via Admin > Paramètres;
// falls back to a clean wordmark placeholder in the brand palette.
export function Logo({ logoUrl, siteName = 'NOUR', tagline = 'Diagnostic Medical', className, tone = 'light' }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={siteName} className={cn('h-8 w-auto', className)} />
  }

  const textColor = tone === 'dark' ? 'text-white' : 'text-primary-deep'
  const subColor = tone === 'dark' ? 'text-white/70' : 'text-ink-soft'

  return (
    <span className={cn('flex flex-col leading-none', className)}>
      <span className={cn('text-xl font-semibold tracking-tight', textColor)}>{siteName}</span>
      <span className={cn('text-[11px] font-medium uppercase tracking-wide', subColor)}>{tagline}</span>
    </span>
  )
}
