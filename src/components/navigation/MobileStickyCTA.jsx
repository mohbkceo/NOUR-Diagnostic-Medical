import { useLocale } from '../../i18n/LocaleProvider'
import { Link } from 'react-router-dom'
import { Calendar, MessageCircle } from 'lucide-react'
import { GlassSurface } from '../glass'
import { useSiteSettings } from '../../hooks/useSiteSettings'

// A floating glass control kept accessible on mobile at all times, per the
// requirement that the reservation CTA remain within reach on small screens.
export function MobileStickyCTA() {
  const { copy } = useLocale()
  const { settings } = useSiteSettings()
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
      <GlassSurface className="flex items-center gap-2 rounded-pill p-2 shadow-xs">
        <Link
          to="/rendez-vous"
          className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-4 py-3 text-sm font-medium text-white"
        >
          <Calendar size={16} />
          {copy.hero.cta}
        </Link>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label={copy.hero.ctaSecondary}
            className="flex h-11 w-11 items-center justify-center rounded-full text-primary-deep"
          >
            <MessageCircle size={20} />
          </a>
        ) : null}
      </GlassSurface>
    </div>
  )
}
